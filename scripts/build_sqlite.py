"""Build the gzipped SQLite database that the live demo queries in the browser.

Usage: python3 scripts/build_sqlite.py [output path]
"""
import csv
import gzip
import io
import shutil
import sqlite3
import sys
import tempfile
import zipfile
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / 'data'
DEFAULT_OUTPUT = DATA.parent / 'client' / 'public' / 'tradesphere.sqlite.gz'

# Text columns use NOCASE because the original MySQL database compared strings
# case-insensitively, and the data relies on it ("Re-export" vs. "Re-Export").
SCHEMA = """
CREATE TABLE CountryInfo (
  CountryName TEXT PRIMARY KEY COLLATE NOCASE,
  Continent TEXT COLLATE NOCASE,
  ISO2 TEXT,
  ISO3 TEXT,
  Latitude REAL,
  Longitude REAL
);
CREATE TABLE CountryDemographics (
  Country TEXT PRIMARY KEY COLLATE NOCASE REFERENCES CountryInfo (CountryName),
  Region TEXT,
  Improved_Drinking_Water_Access REAL,
  Unimproved_Drinking_Water_Access REAL,
  Improved_Sanitation_Access REAL,
  Unimproved_Sanitation_Access REAL,
  Urban_Population REAL,
  Rural_Population REAL,
  Population REAL,
  Population_under_1yo REAL,
  Population_under_15yo REAL,
  Population_aged_15to64 REAL
);
CREATE TABLE USTradingData (
  Symbol TEXT,
  Country1 TEXT COLLATE NOCASE,
  Country2 TEXT COLLATE NOCASE,
  Value REAL,
  Year INTEGER,
  Type TEXT COLLATE NOCASE,
  Category TEXT COLLATE NOCASE
);
CREATE TABLE IndexTable (
  Country TEXT COLLATE NOCASE,
  Category TEXT COLLATE NOCASE,
  Unit TEXT,
  PRIMARY KEY (Country, Category)
);
CREATE TABLE UnitConversion (
  Unit TEXT PRIMARY KEY,
  UnitGroup TEXT,
  FrequencyGroup TEXT,
  FrequencyRate REAL,
  ExchangeRate REAL,
  ConversionRate REAL
);
CREATE TABLE Labour (
  Country TEXT COLLATE NOCASE,
  Category TEXT COLLATE NOCASE,
  Year INTEGER,
  Month INTEGER,
  Value REAL,
  PRIMARY KEY (Country, Category, Year, Month)
) WITHOUT ROWID;
CREATE TABLE Climate (
  Country TEXT COLLATE NOCASE,
  Category TEXT COLLATE NOCASE,
  Year INTEGER,
  Month INTEGER,
  Value REAL,
  PRIMARY KEY (Country, Category, Year, Month)
) WITHOUT ROWID;
"""


def read_csv(name):
    with open(DATA / name, encoding='utf-8-sig', newline='') as f:
        return list(csv.DictReader(f))


def read_zipped_csv(name):
    with zipfile.ZipFile(DATA / name) as archive:
        inner = next(n for n in archive.namelist() if n.endswith('.csv') and not n.startswith('__MACOSX'))
        with archive.open(inner) as f:
            return list(csv.DictReader(io.TextIOWrapper(f, encoding='utf-8-sig', newline='')))


def insert(db, table, columns, rows):
    placeholders = ', '.join('?' for _ in columns)
    db.executemany(
        f'INSERT INTO {table} ({", ".join(columns)}) VALUES ({placeholders})',
        ([row.get(column) or None for column in columns] for row in rows),
    )


def build(path):
    db = sqlite3.connect(path)
    db.executescript(SCHEMA)

    coordinates = {row['ISO2']: row for row in read_csv('CountryCoordinates.csv')}
    countries = read_csv('CountryContinent.csv')
    for country in countries:
        country.update({key: coordinates.get(country['ISO2'], {}).get(key) for key in ('Latitude', 'Longitude')})
    insert(db, 'CountryInfo', ['CountryName', 'Continent', 'ISO2', 'ISO3', 'Latitude', 'Longitude'], countries)

    demographics = read_csv('(0-1)country_stats.csv')
    insert(db, 'CountryDemographics', list(demographics[0].keys()), demographics)

    insert(db, 'USTradingData', ['Symbol', 'Country1', 'Country2', 'Value', 'Year', 'Type', 'Category'],
           read_zipped_csv('(2)US_trading_data.csv.zip'))
    insert(db, 'IndexTable', ['Country', 'Category', 'Unit'], read_csv('(1)index_table.csv'))
    insert(db, 'UnitConversion', ['Unit', 'UnitGroup', 'FrequencyGroup', 'FrequencyRate', 'ExchangeRate', 'ConversionRate'],
           read_csv('Unit_Conversion.csv'))
    for table, name in (('Labour', '(3)Labour.csv'), ('Climate', '(14)Climate.csv')):
        insert(db, table, ['Country', 'Category', 'Year', 'Month', 'Value'], read_csv(name))

    db.commit()
    db.execute('VACUUM')
    db.close()


if __name__ == '__main__':
    output = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_OUTPUT
    output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        database = Path(tmp) / 'tradesphere.sqlite'
        build(database)
        with open(database, 'rb') as src, gzip.open(output, 'wb', compresslevel=9) as dst:
            shutil.copyfileobj(src, dst)
    print(f'Wrote {output} ({output.stat().st_size / 1e6:.1f} MB)')

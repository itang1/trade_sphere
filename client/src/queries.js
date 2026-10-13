// The Express routes in server/routes.js, ported to SQLite so the demo can run them in the browser.
// Each one takes the route's query parameters and returns [sql, bound parameters].

const number = (value, fallback) => (value === undefined || value === '' ? fallback : Number(value));

// Indented to sit inside the WITH clauses below, so Show SQL lays it out cleanly
const wageTable = `
      SELECT B.Country, B.Year, B.Month, B.Value * U.ConversionRate AS ConvertedValue
      FROM Labour B
        JOIN IndexTable I ON B.Category = I.Category AND B.Country = I.Country
        JOIN UnitConversion U ON I.Unit = U.Unit
      WHERE B.Category = 'Wages'`;

const queries = {
  '/trading_data': ({ type = '', category = '' }) => [`
    SELECT Symbol, Country1, Country2, Type, Year, Category, Value
    FROM USTradingData
    WHERE Type = ? AND Category = ?`,
    [type, category]],

  '/trading_partner': ({ type = '', category = '' }) => [`
    SELECT U.Country2, format_number(U.Value) AS Value, C.Latitude, C.Longitude
    FROM USTradingData U JOIN CountryInfo C ON C.CountryName = U.Country2
    WHERE U.Type = ? AND U.Category = ? AND U.Country2 != 'World'
      AND C.Latitude IS NOT NULL AND C.Longitude IS NOT NULL
    ORDER BY U.Value DESC
    LIMIT 5`,
    [type, category]],

  '/trading_partner_catg': ({ type = '', country2 = '' }) => [`
    SELECT Category, format_number(Value) AS Value2
    FROM USTradingData
    WHERE Country2 = ? AND Type = ? AND Category IS NOT NULL
    ORDER BY Value DESC
    LIMIT 1`,
    [country2, type]],

  '/trading_volume': ({ type = '' }) => [`
    SELECT C.Continent, format_number(SUM(U.Value)) AS TotalExportValue
    FROM USTradingData U JOIN CountryInfo C ON C.CountryName = U.Country2
    WHERE U.Type = ? AND C.Continent IS NOT NULL
    GROUP BY C.Continent
    ORDER BY SUM(U.Value) DESC`,
    [type]],

  '/top_traded': ({ type = 'Import', country = 'World' }) => [`
    -- Symbols like USAMEXXX871 are whole product chapters rather than single products
    WITH Chapters AS (
      SELECT Category, Value
      FROM USTradingData
      WHERE Type = ? AND Country2 = ? AND Year = 2022 AND Symbol LIKE 'USA___XX%'
    )
    SELECT Category, Value, ROUND(100.0 * Value / SUM(Value) OVER (), 1) AS SharePercent
    FROM Chapters
    ORDER BY Value DESC
    LIMIT 5`,
    [type, country]],

  '/trading_export': () => [`
    SELECT Category, format_number(SUM(Value)) AS TotalExportValue
    FROM USTradingData
    WHERE Type = 'Export' AND Category IS NOT NULL
    GROUP BY Category
    ORDER BY SUM(Value) DESC`,
    []],

  '/country/population': params => [`
    WITH PopulationCTE AS (
      SELECT Country,
        Region,
        ROUND(Urban_Population / Population * 100, 2) AS UrbanProportion,
        ROUND(Improved_Drinking_Water_Access, 2) AS DrinkingWaterProportion,
        ROUND(Improved_Sanitation_Access, 2) AS SanitationProportion,
        ROUND(Population_under_1yo / Population * 100, 2) AS InfantProportion,
        ROUND(Population, 2) AS TotalPopulation
      FROM CountryDemographics
    )
    SELECT *
    FROM PopulationCTE
    WHERE UrbanProportion > ? AND UrbanProportion < ?
      AND DrinkingWaterProportion > ? AND DrinkingWaterProportion < ?
      AND SanitationProportion > ? AND SanitationProportion < ?
      AND InfantProportion > ? AND InfantProportion < ?`,
    [
      number(params.urban_low, 0), number(params.urban_high, 100),
      number(params.drinking_water_low, 0), number(params.drinking_water_high, 100),
      number(params.sanitation_low, 0), number(params.sanitation_high, 100),
      number(params.infant_low, 0), number(params.infant_high, 100),
    ]],

  '/country/populationwater': () => [`
    WITH MaxUM AS (
      SELECT C.Continent, MAX(H.Unimproved_Drinking_Water_Access) AS MaxUnimprovedWater
      FROM CountryDemographics H JOIN CountryInfo C ON H.Country = C.CountryName
      WHERE C.Continent IS NOT NULL
      GROUP BY C.Continent
    )
    SELECT C.Continent, H.Country, MUM.MaxUnimprovedWater
    FROM CountryDemographics H
      JOIN CountryInfo C ON H.Country = C.CountryName
      JOIN MaxUM MUM ON C.Continent = MUM.Continent AND H.Unimproved_Drinking_Water_Access = MUM.MaxUnimprovedWater`,
    []],

  '/country/wages': ({ country1 = '', country2 = '' }) => [`
    WITH WageData AS (${wageTable} AND (B.Country = ? OR B.Country = ?)
    )
    SELECT Country, Year, Month, ROUND(ConvertedValue, 2) AS TotalWage
    FROM WageData
    ORDER BY Year, Month, Country`,
    [country1, country2]],

  '/country/wage_growth': params => [`
    WITH WageTable AS (${wageTable}
    ), FirstYear AS (
      SELECT Country, MIN(Year) AS FirstYear FROM WageTable GROUP BY Country
    ), LastYear AS (
      SELECT Country, MAX(Year) AS LastYear FROM WageTable GROUP BY Country
    ), FirstValue AS (
      SELECT wt.Country, wt.ConvertedValue AS FirstValue
      FROM WageTable wt
        INNER JOIN FirstYear fy ON wt.Country = fy.Country AND wt.Year = fy.FirstYear
      WHERE Month = (SELECT MIN(Month) FROM WageTable WHERE Country = wt.Country AND Year = wt.Year)
    ), LastValue AS (
      SELECT wt.Country, wt.ConvertedValue AS LastValue
      FROM WageTable wt
        INNER JOIN LastYear ly ON wt.Country = ly.Country AND wt.Year = ly.LastYear
      WHERE Month = (SELECT MAX(Month) FROM WageTable WHERE Country = wt.Country AND Year = wt.Year)
    ), ProportionalIncrease AS (
      SELECT fv.Country,
        (lv.LastValue - fv.FirstValue) / fv.FirstValue AS PropIncrease,
        ly.LastYear - fy.FirstYear AS YearDifference
      FROM FirstValue fv
        INNER JOIN LastValue lv ON fv.Country = lv.Country
        INNER JOIN FirstYear fy ON fv.Country = fy.Country
        INNER JOIN LastYear ly ON fv.Country = ly.Country
    ), PercIncrease AS (
      SELECT Country,
        CASE WHEN YearDifference = 0 THEN NULL ELSE ROUND(PropIncrease / YearDifference * 100, 2) END AS AvgYearlyIncrease_perc
      FROM ProportionalIncrease
    )
    SELECT *
    FROM PercIncrease
    WHERE AvgYearlyIncrease_perc > ? AND AvgYearlyIncrease_perc < ?
    ORDER BY AvgYearlyIncrease_perc DESC`,
    [number(params.growth_low, -99999), number(params.growth_high, 99999)]],

  '/home/labour': params => [`
    WITH RankedLabour AS (
      SELECT Country, Year, Month, Value, RANK() OVER (PARTITION BY Country ORDER BY Value DESC) AS ValueRank
      FROM Labour
      WHERE Category = 'Unemployment Rate'
    )
    SELECT Country, Year, Month, Value AS HighestUnemploymentRate
    FROM RankedLabour
    WHERE ValueRank = 1 AND Value > ? AND Value < ?
    ORDER BY Country`,
    [number(params.unemp_low, 0), number(params.unemp_high, 100)]],

  '/country/temperature': params => [`
    WITH FirstLastYears AS (
      SELECT Country, MIN(Year) AS FirstYear, MAX(Year) AS LastYear
      FROM Climate
      WHERE Category = 'Temperature'
      GROUP BY Country
    ), FirstYearValue AS (
      SELECT c.Country, c.Year AS Year, c.Value AS FirstYearValue
      FROM Climate c INNER JOIN FirstLastYears fl ON c.Country = fl.Country AND c.Year = fl.FirstYear
      WHERE c.Category = 'Temperature'
    ), LastYearValue AS (
      SELECT c.Country, c.Year AS Year, c.Value AS LastYearValue
      FROM Climate c INNER JOIN FirstLastYears fl ON c.Country = fl.Country AND c.Year = fl.LastYear
      WHERE c.Category = 'Temperature'
    ), Deltas AS (
      SELECT f.Country, l.Year - f.Year AS YearsElapsed, l.LastYearValue - f.FirstYearValue AS TemperatureChange
      FROM FirstYearValue f INNER JOIN LastYearValue l ON f.Country = l.Country
    )
    SELECT *
    FROM Deltas
    WHERE TemperatureChange > ? AND TemperatureChange < ?
    ORDER BY TemperatureChange DESC`,
    [number(params.delta_low, -999999), number(params.delta_high, 999999)]],

  '/distcountries': () => ['SELECT DISTINCT Country2 FROM USTradingData ORDER BY Country2', []],
  '/distcategories': () => ['SELECT DISTINCT Category FROM USTradingData ORDER BY Category', []],
  '/distyears': () => ['SELECT DISTINCT Year FROM Labour ORDER BY Year', []],
  '/distcountries2': () => ['SELECT DISTINCT Country FROM Labour ORDER BY Country', []],
};

export default queries;

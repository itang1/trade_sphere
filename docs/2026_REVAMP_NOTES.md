# 2026 revamp notes

Problems found in the 2023 version while reviving TradeSphere in October 2026, and how each was handled. Most were found by checking the site's output against the real world.

## Data

- **Wage conversion.** `data/Unit_Conversion.csv` multiplied hourly wages by 8,760 (every hour of the year) and daily wages by 365, so the site showed the average US wage as $254,040 a year. The 17 affected rows now use a full-time year of 2,080 hours or 260 working days, which brings the US to about $58,800. Wage growth was unaffected, because the multiplier cancels out.
- **Double counting.** Trade categories come at two levels: whole HS chapters, such as "Electrical, electronic equipment," and the products inside them. The continent totals summed both. The query now keeps only chapters, which are identifiable by their symbol code (`USA___XX%`).
- **Coverage gaps.** China has only 402 trade records, none after 2021, and Germany has 780, compared with 3,000 to 3,900 for other major partners. Neither has chapter-level totals, so both drop out of rankings, and Vietnam shows up as the top source of US toys and phones. The site's About page discloses this.
- **Incomplete totals.** The source's World figure is larger than the sum of its countries ($103 billion vs. $71 billion for aircraft exports), so country-level trade data doesn't cover everything.
- **Snapshot, not a time series.** The trade data has one value per product and country, for the most recent year reported (mostly 2022, as early as 2010).
- **Unexplained row count.** The trade CSV has 288,564 rows, but the final report says the 2023 database held 232,412. What was dropped when loading it is unknown.
- **Inconsistent labels.** The data mixes "Re-export" with "Re-Export," "Bosnia And Herzegovina" with "Bosnia and Herzegovina," and "AUD/Week" with "AUD/week," and it lists "Other Asia" as a country. MySQL's default collation ignores case, which hid most of these. The SQLite build uses `COLLATE NOCASE` on text columns to match that behavior, and keeps units case-sensitive so the duplicate units don't double rows.
- **Lost coordinates.** The map's latitudes and longitudes existed only in the AWS database. `data/CountryCoordinates.csv` rebuilds them from Google's public country list.

## Code

- The wages chart plotted the text "No Data" as if it were a number.
- Search values weren't URL-encoded, so names containing characters such as "&" could break a search.
- Five routes in `server/routes.js` read `req.param.page` instead of `req.query.page`, so pagination was silently ignored.
- The routes paste user input directly into SQL strings, which allows SQL injection. The browser version binds parameters instead; the Express server still has the original code.
- The map didn't zoom to its markers, and the wages chart showed empty axes before a search.
- `react-leaflet` was declared as `>=3.0.0`, which installs an incompatible version 5 on a fresh install. It's now pinned to version 4.
- The client started from the course's Homework 2 template, and an unused `LazyTable` component was left over from it.
- Create React App was deprecated, and the client's dependencies had 163 Dependabot alerts. The client now builds with Vite, and both `npm audit` reports are clean.

## Wording

- The site described the trade data as 2005 to 2022, the temperature page as 2006 to 2022 (it's 2005 to 2021), and wage growth as 2006 to 2022 (it's 2005 to 2023).
- Trade values were labeled "Volume" with no unit; they're US dollars.
- The Living Conditions intro mentioned infant mortality, but the data is the share of infants in the population.

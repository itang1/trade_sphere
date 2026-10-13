# TradeSphere

Server- and client-side code for a web application showcasing the prettified output of complex and dynamically generated SQL queries that pull international trade data from [TradingEconomics.com](https://www.TradingEconomics.com), among other sources.

TradeSphere lets you explore US trade with about 200 partner countries, mostly as of 2022, alongside country-level indicators from 2005 to 2023, such as wages, unemployment, living conditions, and temperature change. It was built in Fall 2023 as the group final project for CIS 5500: Databases & Information Systems at the University of Pennsylvania, taught by Professor Susan B. Davidson.

**[Try the live demo](https://itang1.github.io/trade_sphere/).** It runs the project's SQL queries on a copy of the database inside your browser, so there is no server to keep paying for.

View the [Final Report](Final_Report.pdf) for details about the database architecture, table normalization practices, API specification, query performance and evaluation, and the entity-relationship (ER) diagram.

View the [Video Demo](https://drive.google.com/file/d/1Nybc92zDlOBBINsfdfigPUxMy5g0cNJv/view?usp=sharing) for a video demonstration of the functionality of each page.

## Features

- **Home:** the top five US imports or exports by dollar value, for the world or one of five countries, and starter questions that link into the rest of the site.
- **US Trade:** a map of the top 5 US trading partners for any trade type and product category, plus tables of every partner, trade volume by continent, and each partner's largest trade category.
- **Country Profiles:** one page with four tabs that filter countries with sliders and drop-downs: living conditions, temperature change, highest unemployment rate, and wages (a two-country line chart plus average yearly wage growth).
- **About:** what the project shows, the pipeline, the ER diagram, a query optimization with both versions of the SQL, and the project history.
- **Show SQL** under every chart and table, with the query and its current parameters.
- **Tables** with search, column filters, and CSV export.

## How it works

```
TradingEconomics API ─┐
                      ├─> Python + pandas ─> MySQL on AWS RDS ─> Express API ─> React app
Our World in Data ────┘   (clean, merge,      (17 tables,          (16 routes)   (MUI, Recharts,
                           unit conversion)    up to 312k rows)                   Leaflet)
```

1. **Collect:** Python notebooks in [`preprocessing/`](preprocessing) pull economic indicators for 196 countries from the TradingEconomics API and country statistics from Our World in Data.
2. **Clean:** pandas removes duplicates, fixes inconsistent country names, splits dates into year and month, and builds a unit-conversion table so values reported in different currencies, scales, and frequencies can be compared in USD per year. The cleaned CSVs are in [`data/`](data).
3. **Store:** the data loads into a MySQL schema of 17 tables designed to BCNF or 3NF, with country names as foreign keys. `UnitConversion` deliberately breaks 3NF so conversions need no extra joins.
4. **Serve:** an Express server ([`server/routes.js`](server/routes.js)) exposes 16 routes. Each one runs a SQL query using CTEs, joins, aggregates, or window functions.
5. **Show:** a React client ([`client/`](client)) calls the API and renders tables, charts, and a map.

The live demo skips the server. [`scripts/build_sqlite.py`](scripts/build_sqlite.py) rebuilds the tables from the CSVs as a SQLite file, and the client runs the same route queries ([`client/src/queries.js`](client/src/queries.js)) on it with sql.js. GitHub Actions builds and deploys it to GitHub Pages.

## Tech stack

| Layer | Tools |
|---|---|
| Data pipeline | Python, pandas, Jupyter, TradingEconomics API |
| Database | MySQL on AWS RDS |
| Server | Node.js, Express, `mysql` |
| Client | React 18, Vite, React Router, MUI and MUI X Data Grid, Recharts, React Leaflet |
| Live demo | SQLite via sql.js, GitHub Actions, GitHub Pages |

## Team

Built by Lisa Garcia, Zung-Ru Lin, Hanling Su, and Irene Tang.

## Project history

### December 2023: the original project

The four of them built TradeSphere over the semester for CIS 5500. Along the way, the team learned to:

- **Build a React app from scratch:** start a project with Create React App, then build it out with pages and routing (React Router), components with state and hooks, and libraries for tables, charts, and maps.
- **Design a relational schema:** normalize tables to BCNF or 3NF, draw the ER diagram, and break 3NF on purpose when it made queries simpler (`UnitConversion`).
- **Write and tune complex SQL:** CTEs, window functions, and multi-table joins. Rewriting one query with subqueries instead of window functions cut it from 146 ms to 114 ms.
- **Keep data consistent across sources:** clean and merge datasets, and fix the country names that broke foreign key constraints.
- **Wire up a full stack:** connect a React client to an Express API and a MySQL database on AWS, while the API contract kept changing.

### October 2026: the revamp

By 2026 the site no longer worked because the paid AWS database behind it had been shut down after the course. Irene Tang revived the project with help from [Claude Code](https://claude.com/claude-code), an AI coding assistant. She decided what to change and reviewed every result; Claude read the old code and history, wrote most of the changes, and tested them. The original took four people a semester, and the revamp took about a day.

- **Live demo:** the database now runs as SQLite inside the browser, so there is no server to pay for.
- **SQL on display:** a Show SQL button under every chart and table, and pages that open with results and a one-line takeaway.
- **Design:** a shared theme, a tabbed Country Profiles page, a new home page, and an About page with this history.
- **Fixes:** the wages chart had plotted the text "No Data" as a value, query strings weren't URL-encoded, continent totals counted some products twice, and hourly and daily wages were converted as if people worked around the clock, every day of the year.
- **Tooling:** Vite in place of the deprecated Create React App, updated dependencies, and tests that run every query against the real data. Only the build tool changed; the React skills from 2023 still apply.
- **Docs:** this README, rewritten with features, architecture, and setup.

What Irene learned:

- **Check the data against reality.** The revamp found gaps that went unnoticed in 2023, such as China and Germany missing from the trade data, continent totals that counted some products twice, and US wages shown as $254,000 a year.
- **Hosting decides how long a project lives.** The app died with its paid server; a free static site can stay up indefinitely.
- **AI shifts the work from writing code to judging it.** The hard parts were deciding what mattered, checking that the results were right, and catching the assistant's mistakes.

## Running it locally

The client runs on its own against an in-browser SQLite database built from the CSVs in [`data/`](data):

- Build the database with `python3 scripts/build_sqlite.py`.
- In the `client` folder, run `npm install` and `npm start`, then open http://localhost:5173.
- `npm test` runs every query against the database.

To run the original Express server instead, you need a MySQL database of your own, loaded from the CSVs in [`data/`](data). The AWS database used during the course has been shut down.

- Download the code as a .zip file and extract it.
- Create `server/config.json` with `rds_host`, `rds_port`, `rds_user`, `rds_password`, `rds_db`, `server_host`, and `server_port` for your database. This file is gitignored.
- Open the `server` folder in a terminal or command prompt.
- Install packages and start the server with `npm install` and `npm start`.
- Open the `client` folder in a terminal or command prompt.
- Install packages and start the client with `npm install` and `npm start`. Set `VITE_API_URL` to the server's URL, such as `http://localhost:8080`, so the client calls the server instead of the in-browser database.
- Deprecation warnings can be ignored.

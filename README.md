# TradeSphere

Server- and client-side code for a web application showcasing the prettified output of complex and dynamically-generated SQL queries that pull international trade data from [TradingEconomics.com](https://www.TradingEconomics.com), among other sources.

TradeSphere lets you explore US trade with about 200 partner countries from 2005 to 2022, alongside country-level indicators such as wages, unemployment, living conditions and temperature change. It was built in fall 2023 as the group final project for CIS 5500: Databases & Information Systems at the University of Pennsylvania, taught by Professor Susan B. Davidson.

View the [Final Report](Final_Report.pdf) for details about the database architecture, table normalization practices, API specification, query performance and evaluation, and Entity-Relation (ER) diagram.

View the [Video Demo](https://drive.google.com/file/d/1Nybc92zDlOBBINsfdfigPUxMy5g0cNJv/view?usp=sharing) for a video demonstration of the functionality of each page.

## Features

- **Trades:** a map of the top 5 US trading partners for any trade type and product category, plus tables of every partner, trade volume by continent and each partner's largest trade category.
- **Countries:** five pages that filter countries with sliders and drop-downs: living conditions, temperature change, highest unemployment rate, wages over time (two-country line chart) and average yearly wage growth.
- **Tables** with search, column filters and CSV export.

## How it works

```
TradingEconomics API ─┐
                      ├─> Python + pandas ─> MySQL on AWS RDS ─> Express API ─> React app
Our World in Data ────┘   (clean, merge,      (17 tables,          (16 routes)   (MUI, Recharts,
                           unit conversion)    up to 312k rows)                   Leaflet)
```

1. **Collect:** Python notebooks in [`preprocessing/`](preprocessing) pull economic indicators for 196 countries from the TradingEconomics API and country statistics from Our World in Data.
2. **Clean:** pandas removes duplicates, fixes inconsistent country names, splits dates into year and month, and builds a unit-conversion table so values reported in different currencies, scales and frequencies can be compared in USD per year. The cleaned CSVs are in [`data/`](data).
3. **Store:** the data loads into a MySQL schema of 17 tables designed to BCNF or 3NF, with country names as foreign keys. `UnitConversion` deliberately breaks 3NF so conversions need no extra joins.
4. **Serve:** an Express server ([`server/routes.js`](server/routes.js)) exposes 16 routes. Each one runs a SQL query using CTEs, joins, aggregates or window functions.
5. **Show:** a React client ([`client/`](client)) calls the API and renders tables, charts and a map.

## Tech stack

| Layer | Tools |
|---|---|
| Data pipeline | Python, pandas, Jupyter, TradingEconomics API |
| Database | MySQL on AWS RDS |
| Server | Node.js, Express, `mysql` |
| Client | React 18, React Router, MUI and MUI X Data Grid, Recharts, React Leaflet |

## Team

Built by Lisa Garcia, Zung-Ru Lin, Hanling Su and Irene Tang.

## Project history

### December 2023: the original project

Four of us built TradeSphere over the semester for CIS 5500. Along the way I learned to:

- **Design a relational schema:** normalize tables to BCNF or 3NF, draw the ER diagram, and break 3NF on purpose when it made queries simpler (`UnitConversion`).
- **Write and tune complex SQL:** CTEs, window functions and multi-table joins. Rewriting one query with subqueries instead of window functions cut it from 146 ms to 114 ms.
- **Keep data consistent across sources:** clean and merge datasets, and fix the country names that broke foreign key constraints.
- **Wire up a full stack:** connect a React client to an Express API and a MySQL database on AWS, while the API contract kept changing.

### October 2026: the revamp

Coming back almost three years later, I worked through the project with an AI coding assistant ([Claude Code](https://claude.com/claude-code)). I decided what to change and what to keep; the assistant read the code and history, wrote most of the changes and tested them.

- **Security:** removed database credentials that had been committed in 2023 from the entire git history, after confirming the old AWS database no longer existed.
- **UI:** one shared theme and set of components across all pages, charts that resize with the window, a map that zooms to fit its markers, and clearer empty states.
- **Bugs:** the wages chart had been plotting the text "No Data" as a value, and query strings weren't URL-encoded.
- **Docs:** this README, rewritten with features, architecture and setup.

What changed with AI: the 2023 project took four people a semester. The revamp, including reading old code I barely remembered and tracing who wrote what from git history, took about a day. The assistant made it cheap to fix things a class project usually leaves behind, like the leaked credentials. What it didn't change: I still had to decide what mattered, check the results, and catch its mistakes.

## Running it locally

The AWS database used during the course has been shut down, so the app needs a MySQL database of your own, loaded from the CSVs in [`data/`](data).

- Download code as .zip file and extract files
- Create `server/config.json` with `rds_host`, `rds_port`, `rds_user`, `rds_password`, `rds_db`, `server_host` and `server_port` for your database. This file is gitignored.
- Navigate to `server` folder using terminal or command prompt
- Install packages and start server using `npm install` and `npm start`
- Navigate to `client` folder using terminal or command prompt
- Install packages and start client using `npm install` and `npm start`. Set `REACT_APP_API_URL` if the server isn't at `http://localhost:8080`.
- Deprecation warnings can be ignored

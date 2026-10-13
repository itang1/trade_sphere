import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import Page, { Section } from '../components/Page';
import { CodeBlock } from '../components/ShowSql';

const REPO_URL = 'https://github.com/itang1/trade_sphere';

// Both versions as run against MySQL in December 2023, from the final report
const WINDOW_VERSION = `WITH TemperatureChanges AS (
  SELECT Country, Year, Value,
    FIRST_VALUE(Value) OVER (PARTITION BY Country ORDER BY Year ASC) AS FirstYearValue,
    LAST_VALUE(Value) OVER (PARTITION BY Country ORDER BY Year ASC
      RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS LastYearValue
  FROM Climate
  WHERE Category = 'Temperature'
)
SELECT Country,
  MAX(Year) - MIN(Year) AS YearsElapsed,
  LastYearValue - FirstYearValue AS TemperatureChange
FROM TemperatureChanges
GROUP BY Country, FirstYearValue, LastYearValue
ORDER BY TemperatureChange DESC`;

const JOIN_VERSION = `WITH FirstLastYears AS (
  SELECT Country, MIN(Year) AS FirstYear, MAX(Year) AS LastYear
  FROM Climate
  WHERE Category = 'Temperature'
  GROUP BY Country
), FirstYearValue AS (
  SELECT c.Country, c.Year AS Year, c.Value AS FirstYearValue
  FROM Climate c
    INNER JOIN FirstLastYears fl ON c.Country = fl.Country AND c.Year = fl.FirstYear
  WHERE Category = 'Temperature'
), LastYearValue AS (
  SELECT c.Country, c.Year AS Year, c.Value AS LastYearValue
  FROM Climate c
    INNER JOIN FirstLastYears fl ON c.Country = fl.Country AND c.Year = fl.LastYear
  WHERE c.Category = 'Temperature'
)
SELECT f.Country,
  l.Year - f.Year AS YearsElapsed,
  l.LastYearValue - f.FirstYearValue AS TemperatureChange
FROM FirstYearValue f
  INNER JOIN LastYearValue l ON f.Country = l.Country
ORDER BY TemperatureChange DESC`;

export default function AboutPage() {
  return (
    <Page
      title='About'
      intro={
        <>
          <p>TradeSphere was my group final project for CIS 5500: Databases & Information Systems at the University of Pennsylvania, taught by Professor Susan B. Davidson in Fall 2023. It was built by Lisa Garcia, Zung-Ru Lin, Hanling Su and Irene Tang.</p>
          <p>
            See the <a href={REPO_URL}>code on GitHub</a>, the <a href={`${REPO_URL}/blob/main/Final_Report.pdf`}>final report</a> and
            the <a href='https://drive.google.com/file/d/1Nybc92zDlOBBINsfdfigPUxMy5g0cNJv/view?usp=sharing'>original video demo</a>.
          </p>
        </>
      }
    >
      <Section title='What this project shows'>
        <ul>
          <li><strong>Database design and SQL:</strong> a normalized schema of 17 tables, and queries built from CTEs, window functions and multi-table joins. Press Show SQL under any chart or table to read its query, or see how it's built below.</li>
          <li><strong>Turning messy data into consistent data:</strong> two sources with different country names, currencies, units and reporting frequencies, merged into one schema with a unit conversion table.</li>
          <li><strong>Connecting a database to a product:</strong> every filter, toggle and slider becomes a query parameter, and every result becomes a table, chart or map.</li>
          <li><strong>Maintaining and modernizing old code:</strong> in 2026 I moved the app off a paid server and deprecated tooling, and added tests. See the revamp below.</li>
        </ul>
      </Section>

      <Section title="How it's built">
        <Typography variant='h3' gutterBottom>Pipeline</Typography>
        <ol>
          <li><strong>Collect:</strong> Python notebooks pulled economic indicators for 196 countries from the TradingEconomics API, and country statistics from Our World in Data, in November 2023.</li>
          <li><strong>Clean:</strong> pandas removed duplicates, matched country names across sources, split dates into year and month, and built a unit conversion table so values in different currencies and frequencies compare as US dollars per year.</li>
          <li><strong>Store:</strong> the cleaned data loaded into a MySQL database of 17 tables, normalized to BCNF or 3NF, with country names as foreign keys.</li>
          <li><strong>Serve and show:</strong> an Express API ran one SQL query per route, and the React app turned the results into tables, charts and a map. The live demo runs the same queries on a SQLite copy in your browser.</li>
        </ol>

        <Typography variant='h3' gutterBottom>Schema</Typography>
        <p>The entity-relationship diagram. Economic indicators share one shape (country, category, year, month, value), so they are modeled as subtypes of one historical data entity, split into a table per category.</p>
        <Box component='a' href={`${import.meta.env.BASE_URL}er-diagram.png`} sx={{ display: 'block', maxWidth: 720 }}>
          <Box component='img' src={`${import.meta.env.BASE_URL}er-diagram.png`} alt='Entity-relationship diagram of the TradeSphere database' sx={{ width: '100%', border: 1, borderColor: 'divider', borderRadius: 1 }} />
        </Box>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>Click the diagram to open it full size.</Typography>

        <Typography variant='h3' gutterBottom>Making a query faster</Typography>
        <p>
          The <Link to='/countries-temperature'>Temperature</Link> tab finds how much each country's temperature changed between its first and last year of data.
          The first version used window functions, which compute a value for every row of every country. The rewrite finds each country's first and last year once,
          then joins back only those rows. It ran in 114 ms instead of 146 ms, about 22% faster, and the same pattern went into most of the country queries.
        </p>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <Typography fontWeight={600}>Before: window functions, 146 ms</Typography>
            <CodeBlock>{WINDOW_VERSION}</CodeBlock>
          </Grid>
          <Grid item xs={12}>
            <Typography fontWeight={600}>After: first and last year, then a join, 114 ms</Typography>
            <CodeBlock>{JOIN_VERSION}</CodeBlock>
          </Grid>
        </Grid>

        <Typography variant='h3' gutterBottom>Data</Typography>
        <p>
          Trade and economic data come from <a href='https://tradingeconomics.com'>TradingEconomics</a>, and living conditions from <a href='https://ourworldindata.org'>Our World in Data</a>.
          The data was collected in November 2023, so trade figures run through 2022 and country indicators through 2023. Some countries are incomplete:
          China and Germany, for example, have no product-level trade figures.
        </p>
      </Section>

      <Section title='December 2023: what I learned'>
        <ul>
          <li><strong>Build a React app from scratch:</strong> start a project with Create React App, then build it out with pages and routing (React Router), components with state and hooks, and libraries for tables, charts and maps.</li>
          <li><strong>Design a relational schema:</strong> normalize tables to BCNF or 3NF, draw the ER diagram, and break 3NF on purpose when it made queries simpler (<code>UnitConversion</code>).</li>
          <li><strong>Write and tune complex SQL:</strong> CTEs, window functions and multi-table joins. Rewriting one query with subqueries instead of window functions cut it from 146 ms to 114 ms.</li>
          <li><strong>Keep data consistent across sources:</strong> clean and merge datasets, and fix the country names that broke foreign key constraints.</li>
          <li><strong>Wire up a full stack:</strong> connect a React client to an Express API and a MySQL database on AWS, while the API contract kept changing.</li>
        </ul>
      </Section>

      <Section title='October 2026: the revamp'>
        <Typography variant='h3' gutterBottom>Why</Typography>
        <p>By 2026 the site no longer worked. The app depended on a paid AWS database that was shut down after the course, so the website only showed the README. I wanted the project to work again as a portfolio piece that anyone can try.</p>

        <Typography variant='h3' gutterBottom>What changed</Typography>
        <ul>
          <li><strong>Live demo:</strong> the database now runs inside your browser. A script rebuilds it from the project's CSV files as SQLite, and the app runs the same SQL queries the Express server ran, so there is no server to pay for.</li>
          <li><strong>SQL on display:</strong> every chart and table has a Show SQL button with the query behind it, and the home page opens with the top US imports and exports by country.</li>
          <li><strong>UI:</strong> one shared theme and set of components across all pages, charts that resize with the window, a map that zooms to fit its markers, and clearer empty states.</li>
          <li><strong>Tooling:</strong> moved from Create React App to Vite, updated the dependencies, and added tests that run every query against the real data.</li>
        </ul>

        <Typography variant='h3' gutterBottom>Does Vite replace what I learned?</Typography>
        <p>No. Create React App was the standard way to start a React project in 2023, and React has since deprecated it in favor of tools like Vite. Only the build tool changed: the components, state, routing and data flow I learned to write are the same code running on this site.</p>

        <Typography variant='h3' gutterBottom>What changed with AI</Typography>
        <p>I did the revamp with an AI coding assistant (<a href='https://claude.com/claude-code'>Claude Code</a>). I decided what to change and what to keep; the assistant read the code and history, wrote most of the changes and tested them. The 2023 project took four people a semester; the revamp took about a day. What it didn't change: I still had to decide what mattered, check the results, and catch its mistakes.</p>
      </Section>
    </Page>
  );
}

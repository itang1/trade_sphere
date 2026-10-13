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

const diagramUrl = `${import.meta.env.BASE_URL}er-diagram.png`;

export default function AboutPage() {
  return (
    <Page
      title='About'
      intro={
        <>
          <p>
            By Lisa Garcia, Zung-Ru Lin, Hanling Su and Irene Tang for CIS 5500: Databases & Information Systems at the University of Pennsylvania,
            taught by Professor Susan B. Davidson, Fall 2023. Revamped by Irene Tang in October 2026.
          </p>
          <p>
            <a href={REPO_URL}>Code on GitHub</a> · <a href={`${REPO_URL}/blob/main/Final_Report.pdf`}>Final report</a> ·{' '}
            <a href='https://drive.google.com/file/d/1Nybc92zDlOBBINsfdfigPUxMy5g0cNJv/view?usp=sharing'>Original video demo</a>
          </p>
        </>
      }
    >
      <Section title='How TradeSphere works'>
        <Typography variant='h3' gutterBottom>Pipeline</Typography>
        <ol>
          <li><strong>Collect:</strong> Python notebooks pulled economic indicators for 196 countries from the TradingEconomics API, and country statistics from Our World in Data, in November 2023.</li>
          <li><strong>Clean:</strong> pandas removed duplicates, matched country names across sources, split dates into year and month, and built a unit conversion table so values in different currencies and frequencies compare as US dollars per year.</li>
          <li><strong>Store:</strong> the cleaned data loaded into a MySQL database of 17 tables, normalized to BCNF or 3NF, with country names as foreign keys.</li>
          <li><strong>Serve and show:</strong> an Express API ran one SQL query per route, and the React app turned the results into tables, charts and a map. The live demo runs the same queries on a SQLite copy in your browser.</li>
        </ol>

        <Typography variant='h3' gutterBottom>Schema</Typography>
        <p>
          An entity-relationship (ER) diagram is the blueprint of a database, drawn before any tables exist. Rectangles are entities, the things the data
          describes, such as a country or a trade record. Ovals are their attributes, and underlined attributes form each entity's key. Diamonds are
          relationships between entities, and labels such as 1..1 and 0..* say how many of one entity can relate to another: each trade record belongs to
          exactly one country, while a country can have any number of trade records. The ISA triangle marks Labour, GDP, Climate and the other indicator
          tables as kinds of one historical data entity, since they all share the same columns. The team drew it in draw.io (diagrams.net).
        </p>
        <Box component='a' href={diagramUrl} sx={{ display: 'block', maxWidth: 720 }}>
          <Box component='img' src={diagramUrl} alt='Entity-relationship diagram of the TradeSphere database' sx={{ width: '100%', border: 1, borderColor: 'divider', borderRadius: 1 }} />
        </Box>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>Click the diagram to open it full size.</Typography>

        <Typography variant='h3' gutterBottom>Data</Typography>
        <p>
          Trade and economic data come from <a href='https://tradingeconomics.com'>TradingEconomics</a>, and living conditions from <a href='https://ourworldindata.org'>Our World in Data</a>.
          The data was collected in November 2023, so trade figures run through 2022 and country indicators through 2023. Some countries are incomplete:
          China and Germany, for example, have no product-level trade figures.
        </p>
      </Section>

      <Section title='December 2023: what the team learned'>
        <ul>
          <li><strong>Building a React app from scratch:</strong> starting a project with Create React App, then building it out with pages and routing (React Router), components with state and hooks, and libraries for tables, charts and maps.</li>
          <li><strong>Designing a relational schema:</strong> normalizing tables to BCNF or 3NF, drawing the ER diagram, and breaking 3NF on purpose when it made queries simpler (<code>UnitConversion</code>).</li>
          <li><strong>Writing and tuning complex SQL:</strong> CTEs, window functions and multi-table joins, and rewriting slow queries. Press Show SQL under any chart or table to read its query, and see the example below.</li>
          <li><strong>Keeping data consistent across sources:</strong> merging two sources with different country names, currencies, units and reporting frequencies into one schema, and fixing the country names that broke foreign key constraints.</li>
          <li><strong>Wiring up a full stack:</strong> connecting a React client to an Express API and a MySQL database on AWS, so that every filter, toggle and slider becomes a query parameter and every result becomes a table, chart or map, while the API contract kept changing.</li>
        </ul>

        <Typography variant='h3' gutterBottom>Example: making a query faster</Typography>
        <p>
          The <Link to='/countries-temperature'>Temperature</Link> tab finds how much each country's temperature changed between its first and last year of data.
          The first version used window functions, which compute a value for every row of every country. The rewrite finds each country's first and last year once,
          then joins back only those rows. It ran in 114 ms instead of 146 ms, about 22% faster, and the same pattern went into most of the country queries.
        </p>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography fontWeight={600}>Before: window functions, 146 ms</Typography>
            <CodeBlock>{WINDOW_VERSION}</CodeBlock>
          </Grid>
          <Grid item xs={12}>
            <Typography fontWeight={600}>After: first and last year, then a join, 114 ms</Typography>
            <CodeBlock>{JOIN_VERSION}</CodeBlock>
          </Grid>
        </Grid>
      </Section>

      <Section title='October 2026: the revamp'>
        <p>
          By 2026 the site no longer worked because the paid AWS database behind it had been shut down after the course. Irene revived the project with
          help from <a href='https://claude.com/claude-code'>Claude Code</a>, an AI coding assistant.
        </p>
        <ul>
          <li><strong>Live demo:</strong> the database now runs as SQLite inside your browser, so there is no server to pay for.</li>
          <li><strong>SQL on display:</strong> a Show SQL button under every chart and table, and pages that open with results and a one-line takeaway.</li>
          <li><strong>Fixes:</strong> continent totals that counted some products twice, and hourly and daily wages converted as if people worked around the clock, every day of the year.</li>
          <li><strong>Design:</strong> a shared theme, a tabbed Country Profiles page, a new home page and this About page.</li>
          <li><strong>Tooling:</strong> Vite in place of the deprecated Create React App, updated dependencies, and tests that run every query against the real data. Only the build tool changed; the React skills from 2023 still apply.</li>
        </ul>
        <p>
          Irene decided what to change and reviewed every result; Claude read the old code, wrote most of the changes and tested them. The original took
          four people a semester, and the revamp took about a day.
        </p>

        <Typography variant='h3' gutterBottom>What Irene learned</Typography>
        <ul>
          <li><strong>Check the data against reality.</strong> The revamp found gaps that went unnoticed in 2023, such as China and Germany missing from the trade data, continent totals that counted some products twice, and US wages shown as $254,000 a year.</li>
          <li><strong>Hosting decides how long a project lives.</strong> The app died with its paid server; a free static site can stay up indefinitely.</li>
          <li><strong>AI shifts the work from writing code to judging it.</strong> The hard parts were deciding what mattered, checking that the results were right, and catching the assistant's mistakes.</li>
        </ul>
      </Section>
    </Page>
  );
}

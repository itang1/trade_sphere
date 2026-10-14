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

const CONTENTS = [
  ['how-it-works', 'How TradeSphere works'],
  ['what-we-learned', 'What we learned'],
  ['query-example', 'Making a query faster'],
  ['revamp', 'The 2026 revamp'],
];

const diagramUrl = `${import.meta.env.BASE_URL}er-diagram.png`;

export default function AboutPage() {
  return (
    <Page
      title='About'
      intro={
        <>
          <p>
            By Lisa Garcia, Zung-Ru Lin, Hanling Su, and Irene Tang for CIS 5500: Databases & Information Systems at the University of Pennsylvania,
            taught by Professor Susan B. Davidson, Fall 2023.
            <br />
            Revamped by Irene Tang in October 2026.
          </p>
          <p>
            <strong>Relevant links:</strong> <a href={REPO_URL}>Code on GitHub</a> · <a href={`${REPO_URL}/blob/main/Final_Report.pdf`}>Final report</a> ·{' '}
            <a href='https://drive.google.com/file/d/1Nybc92zDlOBBINsfdfigPUxMy5g0cNJv/view?usp=sharing'>Original video demo</a>
          </p>
          <p>
            <strong>On this page:</strong>{' '}
            {CONTENTS.map(([id, label], i) => (
              <React.Fragment key={id}>{i > 0 && ' · '}<a href={`#${id}`}>{label}</a></React.Fragment>
            ))}
          </p>
        </>
      }
    >
      <Section id='how-it-works' title='How TradeSphere works'>
        <Typography variant='h3' gutterBottom>Pipeline</Typography>
        <ol>
          <li><strong>Collect:</strong> Python notebooks pulled economic indicators for 196 countries from the TradingEconomics API, and country statistics from Our World in Data, in November 2023.</li>
          <li><strong>Clean:</strong> pandas removed duplicates, matched country names across sources, split dates into year and month, and built a unit conversion table so values in different currencies and frequencies compare as US dollars per year.</li>
          <li><strong>Store:</strong> the cleaned data loaded into a MySQL database of 17 tables, normalized to BCNF or 3NF, with country names as foreign keys.</li>
          <li><strong>Serve and show:</strong> an Express API ran one SQL query per route, and the React app turned the results into tables, charts, and a map. The live demo runs the same queries on a SQLite copy in your browser.</li>
        </ol>

        <Typography variant='h3' gutterBottom>Schema</Typography>
        <p>
          An entity-relationship (ER) diagram is the blueprint of a database, drawn before any tables exist. Rectangles are entities (the things that the data
          describes, such as a country or a trade record). Ovals are their attributes, and underlined attributes form each entity's key. Diamonds are
          relationships between entities, and labels such as 1..1 and 0..* say how many of one entity can relate to another: each trade record belongs to
          exactly one country, while a country can have any number of trade records. The ISA triangle marks Labour, GDP, Climate, and the other indicator
          tables as kinds of one historical data entity, since they all share the same columns.
        </p>
        <Box component='a' href={diagramUrl} sx={{ display: 'block', maxWidth: 720 }}>
          <Box component='img' src={diagramUrl} alt='Entity-relationship diagram of the TradeSphere database' sx={{ width: '100%', border: 1, borderColor: 'divider', borderRadius: 1 }} />
        </Box>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
          Entity-relationship diagram of the TradeSphere database, designed by our team in draw.io, Fall 2023. Click the diagram to open it full size.
        </Typography>

        <Typography variant='h3' gutterBottom>Data</Typography>
        <p>
          Trade and economic data come from <a href='https://tradingeconomics.com'>TradingEconomics</a>, and living conditions from <a href='https://ourworldindata.org'>Our World in Data</a>.
          The data was collected in November 2023, and each part covers a different period:
        </p>
        <ul>
          <li><strong>US trade:</strong> one value per product and country, for the most recent year reported. Most values are from 2022, and a few go back to 2010. It is a snapshot, so it can't show how trade changed over time.</li>
          <li><strong>Living conditions:</strong> a single snapshot from 2020.</li>
          <li><strong>Temperature:</strong> yearly figures from 2005 to 2021.</li>
          <li><strong>Wages and unemployment:</strong> figures from 2005 to 2023, reported monthly, quarterly, or yearly depending on the country.</li>
        </ul>
        <p>Some countries are incomplete. China has only 402 trade records, none after 2021, and Germany has 780, while other major partners have 3,000 or more. Neither has totals for whole product groups.</p>
      </Section>

      <Section id='what-we-learned' title='December 2023: what we learned'>
        <p>
          TradeSphere was the final project for a course that covered SQL, ER design, relational design theory, transactions, indexing, query optimization,
          and NoSQL databases such as MongoDB and Neo4j. The project put the relational half of that into practice.
        </p>
        <p>
          <strong>Designing a schema before writing code.</strong> We drew the ER diagram first, then turned it into 17 tables normalized to BCNF or
          3NF. Normalizing stores each fact once, such as a country's continent, so it can't fall out of sync. We also broke 3NF on purpose in{' '}
          <code>UnitConversion</code>, storing a conversion rate that could be computed from two other columns, because every wage query needed it.
        </p>
        <p>
          <strong>Writing and tuning complex SQL.</strong> The queries use CTEs, window functions, and multi-table joins, and we rewrote slow ones to
          run faster. The charts and tables on this site run our original queries, except the home page's top imports and exports chart; press Show SQL
          under any of them to read the exact query, or see the example below.
        </p>
        <p>
          <strong>Keeping data consistent across sources.</strong> The two sources spelled country names differently and reported values in different
          currencies, units, and reporting frequencies. Making country names foreign keys exposed every mismatch, because the database refused rows that
          didn't match a known country, and we fixed them one by one.
        </p>
        <p>
          <strong>Running a database in the cloud.</strong> We hosted the MySQL database on Amazon RDS, a managed database service from Amazon Web
          Services (AWS), and created and loaded the tables there.
        </p>
        <p>
          <strong>Building a React app.</strong> React is a JavaScript library for building interactive web pages out of reusable pieces
          called components. We started the client with Create React App, a tool that set up a new React project and everything needed to build it, then built it out with pages and routing
          (React Router), components with state and hooks, and libraries for tables, charts, and maps.
        </p>
        <p>
          <strong>Wiring up a full stack.</strong> An Express API connected the React client to the database, so that every filter, toggle, and slider
          became a query parameter and every result became a table, chart, or map. The request and response formats kept changing as the pages evolved,
          so both sides had to adapt.
        </p>

        <Typography id='query-example' variant='h3' gutterBottom sx={{ scrollMarginTop: 80 }}>Example: making a query faster</Typography>
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

      <Section id='revamp' title='October 2026: the revamp with AI tools'>
        <p>
          By 2026, our site no longer worked because the paid AWS database behind it had been shut down after the course. I (Irene) revived the project so that
          anyone can try it at no hosting cost, by moving the database to SQLite, which runs inside each visitor's web browser instead of on a paid server.
        </p>

        <Typography id='ai' variant='h3' gutterBottom sx={{ scrollMarginTop: 80 }}>How AI was used</Typography>
        <p>
          I did the revamp with help from <a href='https://claude.com/claude-code'>Claude Code</a>, an AI coding assistant that can read and edit a project's files. I described each desired change in plain English, such as "get the live demo website running
          without a paid server," "let visitors see the SQL code that we wrote for every chart," and "make the pages give context instead of just displaying tables." Claude read the 2023 code, its git history, and our team's documents, then wrote the changes, ran the
          tests, and checked each page in a browser. I reviewed its work for errors in the calculations, wording, and clarity, asked for revisions until each page was right, and edited much of the final wording myself.
        </p>

        <Typography variant='h3' gutterBottom>Switched from MySQL to SQLite</Typography>
        <p>
          SQLite is a database that lives in a single file instead of on a server. A server database like our MySQL runs as a program that apps
          connect to, and it costs money for as long as it runs. SQLite has no server; a program opens the file and runs SQL on it directly, and it is built
          into every iPhone, Android phone, and web browser.
        </p>
        <p>
          I rebuilt the database from the same cleaned CSV files that we loaded into MySQL on AWS in 2023. A Python script creates the
          tables with the same names, columns, and keys as the original schema, loads each CSV into its table, and compresses the result into one 10 MB
          file. The site uses sql.js, a version of SQLite that runs in the browser, so your browser downloads that file and runs our queries on
          your own computer. Whenever the code changes, GitHub Actions rebuilds the database, runs the tests, and publishes the site for free.
        </p>
        <p>
          SQLite fits because TradeSphere's data never changes and only needs to be read. An app where many people save data at the same time would still
          need a server database like MySQL.
        </p>

        <Typography variant='h3' gutterBottom>Switched from Create React App to Vite</Typography>
        <p>
          React is still the library behind every page; what changed is the build tool around it. A build tool turns the code we write into the files a
          browser downloads, and runs a local preview of the site during development. In 2023, we used Create React App, which set all of this up with one
          command and was the standard way to start a React project at the time.
        </p>
        <p>
          React's maintainers deprecated Create React App in 2025. It was no longer actively maintained, its dependencies had fallen out of date, and newer
          tools like Vite do the same job much faster. I moved the client to Vite and updated the rest of the dependencies. The switch changed how the site
          is built, not how React is written, so the React skills from 2023 still apply.
        </p>

        <Typography variant='h3' gutterBottom>Showing the SQL</Typography>
        <p>
          Each chart and table's query is stored once in the site's code and run as is against the in-browser database, so the text you see is exactly
          what runs. The Show SQL button under every chart and table opens that query, lists the current filter values passed into it, and notes whether
          it is one we wrote in 2023, one fixed in 2026, or one added in 2026.
        </p>

        <Typography variant='h3' gutterBottom>Smaller changes</Typography>
        <ul>
          <li><strong>Default results:</strong> pages that open with results and a one-line takeaway.</li>
          <li><strong>Design:</strong> small edits to the color scheme and font, a cleaner layout built from one shared set of components, a tabbed Country Profiles page, and a reorganized and decluttered home page.</li>
          <li><strong>Fixes:</strong> corrected problems in the 2023 data and code, such as wages converted as if people worked around the clock and continent totals that counted some products twice.</li>
          <li><strong>Tests:</strong> every query runs against the real data before each deploy.</li>
          <li><strong>History:</strong> this write-up of the project's history.</li>
        </ul>

        <Typography variant='h3' gutterBottom>Lessons learned</Typography>
        <ul>
          <li><strong>Check the data against reality.</strong> Some problems went unnoticed in 2023 because the output was never compared with the real world. A US average wage of $254,000 a year should have been a red flag.</li>
          <li><strong>Choose the database for how the data is used.</strong> A read-only dataset doesn't need a server; moving to SQLite cut the hosting cost to zero without changing the SQL.</li>
          <li><strong>AI speeds up the work but doesn't replace judgment.</strong> Claude made changes far faster than I could by hand, but deciding which changes mattered and noticing when a result looked wrong were still up to me.</li>
        </ul>
      </Section>
    </Page>
  );
}

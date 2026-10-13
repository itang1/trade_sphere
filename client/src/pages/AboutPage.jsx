import React from 'react';
import { Typography } from '@mui/material';

import Page, { Section } from '../components/Page';

const REPO_URL = 'https://github.com/itang1/trade_sphere';

export default function AboutPage() {
  return (
    <Page
      title='About'
      intro={
        <>
          <p>TradeSphere was my group final project for CIS 5500: Databases & Information Systems at the University of Pennsylvania, taught by Professor Susan B. Davidson in fall 2023. It was built by Lisa Garcia, Zung-Ru Lin, Hanling Su and Irene Tang.</p>
          <p>
            See the <a href={REPO_URL}>code on GitHub</a>, the <a href={`${REPO_URL}/blob/main/Final_Report.pdf`}>final report</a> and
            the <a href='https://drive.google.com/file/d/1Nybc92zDlOBBINsfdfigPUxMy5g0cNJv/view?usp=sharing'>original video demo</a>.
          </p>
        </>
      }
    >
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
        <p>By 2026 the site no longer worked. The app depended on a paid AWS database that was shut down after the course, so the website only showed the README. The repository also had a database password in its git history and over 160 security alerts on outdated packages. I wanted the project to work again as a portfolio piece that anyone can try.</p>

        <Typography variant='h3' gutterBottom>What changed</Typography>
        <ul>
          <li><strong>Live demo:</strong> the database now runs inside your browser. A script rebuilds it from the project's CSV files as SQLite, and the app runs the same SQL queries the Express server ran, so there is no server to pay for.</li>
          <li><strong>Security:</strong> removed the committed database password from the entire git history, and cleared all of the security alerts.</li>
          <li><strong>UI:</strong> one shared theme and set of components across all pages, charts that resize with the window, a map that zooms to fit its markers, and clearer empty states.</li>
          <li><strong>Tooling:</strong> moved from Create React App to Vite, and added tests that run every query against the real data.</li>
        </ul>

        <Typography variant='h3' gutterBottom>Does Vite replace what I learned?</Typography>
        <p>No. Create React App was the standard way to start a React project in 2023, and React has since deprecated it in favor of tools like Vite. Only the build tool changed: the components, state, routing and data flow I learned to write are the same code running on this site.</p>

        <Typography variant='h3' gutterBottom>What changed with AI</Typography>
        <p>I did the revamp with an AI coding assistant (<a href='https://claude.com/claude-code'>Claude Code</a>). I decided what to change and what to keep; the assistant read the code and history, wrote most of the changes and tested them. The 2023 project took four people a semester; the revamp took about a day. What it didn't change: I still had to decide what mattered, check the results, and catch its mistakes.</p>
      </Section>
    </Page>
  );
}

import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

import { getJson } from '../api';
import { colors } from '../theme';
import Page, { Section } from '../components/Page';
import DataTable from '../components/DataTable';

const QUESTIONS = [
  { question: 'Who buys the most US aircraft?', hint: 'Choose Export and "Aircraft, spacecraft"', page: 'Trades', to: '/trades' },
  { question: 'Which countries have the least clean drinking water?', hint: 'Set the drinking water range to 0 to 50', page: 'Living Conditions', to: '/countries-living-conditions' },
  { question: 'How do US and Mexican wages compare?', hint: 'Pick United States and Mexico', page: 'Wages', to: '/countries-wages' },
  { question: 'Where did wages grow fastest?', hint: 'Press Search to rank every country', page: 'Wage Growth', to: '/countries-wage-growth' },
];

const FACTS = [
  { label: 'Coffee', category: 'Coffee, coffee husks, substitutes with coffee' },
  { label: 'Cars', category: 'Motor cars and vehicles for transporting persons' },
  { label: 'Wine', category: 'Wine, Grape Must (Excluding Grape Juice)' },
];

function billions(value) {
  return `$${(Number(String(value).replaceAll(',', '')) / 1e9).toFixed(1)} billion`;
}

// Shows the country the US imports the most of a product from, using the Trades page's top partners query
function Fact({ label, category }) {
  const [top, setTop] = useState(null);

  useEffect(() => {
    getJson('/trading_partner', { type: 'Import', category }).then(rows => setTop(rows[0])).catch(console.error);
  }, [category]);

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant='body2' color='text.secondary'>{label}</Typography>
      <Typography variant='h4' component='p' color='primary' fontWeight={800}>{top ? top.Country2 : '…'}</Typography>
      <Typography variant='body2'>{top ? `${billions(top.Value)} of imports in 2022` : ' '}</Typography>
    </Paper>
  );
}

function QuestionCard({ question, hint, page, to }) {
  return (
    <Paper
      component={Link}
      to={to}
      sx={{
        display: 'block', height: '100%', p: 2, textDecoration: 'none', color: 'text.primary',
        transition: 'border-color .15s, box-shadow .15s',
        '&:hover': { borderColor: 'primary.main', boxShadow: 2 },
      }}
    >
      <Typography fontWeight={700} gutterBottom>{question}</Typography>
      <Typography variant='body2' color='text.secondary' gutterBottom>{hint}</Typography>
      <Typography variant='body2' color='primary' fontWeight={600}>Open {page} →</Typography>
    </Paper>
  );
}

const exportColumns = [
  { field: 'Category', headerName: 'Category', flex: 2 },
  { field: 'TotalExportValue', headerName: 'Total Export Value', flex: 1 },
];

export default function HomePage() {
  const [exports, setExports] = useState([]);
  const [water, setWater] = useState([]);
  const [partners, setPartners] = useState(0);
  const [categories, setCategories] = useState(0);

  useEffect(() => {
    getJson('/trading_export').then(setExports).catch(console.error);
    getJson('/country/populationwater').then(setWater).catch(console.error);
    getJson('/distcountries').then(rows => setPartners(rows.filter(row => row.Country2 !== 'World').length)).catch(console.error);
    getJson('/distcategories').then(rows => setCategories(rows.filter(row => row.Category).length)).catch(console.error);
  }, []);

  return (
    <Page
      title='TradeSphere'
      intro={
        <>
          <Typography variant='h5' component='p' color='text.primary' sx={{ mb: 1, maxWidth: 760 }}>
            Your coffee, your car, your wine: chances are it crossed a border to reach you.
          </Typography>
          <p>
            TradeSphere shows what the United States buys from and sells to {partners ? partners.toLocaleString() : '…'} countries,
            across {categories ? categories.toLocaleString() : '…'} kinds of goods, and what life is like in those countries:
            wages, jobs, clean water and climate.
          </p>
          <Typography variant='body2' sx={{ mb: 3 }}>
            By Lisa Garcia, Zung-Ru Lin, Hanling Su and Irene Tang for CIS 5500 at the University of Pennsylvania, fall 2023. Revamped in 2026.
            {' '}<Link to='/about'>About the project</Link>
          </Typography>
        </>
      }
    >
      <Typography variant='h3' gutterBottom>Where the US buys the most of it</Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {FACTS.map(fact => (
          <Grid item xs={12} sm={4} key={fact.label}>
            <Fact {...fact} />
          </Grid>
        ))}
      </Grid>
      <Typography variant='h3'>Not sure where to start?</Typography>
      <Typography color='text.secondary' sx={{ mb: 1.5 }}>Pick a question to open the page that answers it. Each card says what to select once you're there.</Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {QUESTIONS.map(item => (
          <Grid item xs={12} sm={6} md={3} key={item.to}>
            <QuestionCard {...item} />
          </Grid>
        ))}
      </Grid>
      <Typography variant='body2' color='text.secondary' sx={{ mb: 4 }}>
        Every chart and table runs a SQL query in your browser. The data was collected in November 2023: trade figures run through 2022 and country indicators through 2023.
      </Typography>

      <Section
        title='Data Introduction and Preview'
        description={
          <>
            The data used in this application stems from a SQL database which contains United States' trading information from
            2005 to 2022 and country specific information. More information on the data sources used for the database can be found here:
            {' '}<a href='https://tradingeconomics.com'>Trading Data</a> and <a href='https://ourworldindata.org/hunger-and-undernourishment'>Country Data</a>.
            Due to the vast number of trading information only some aspects were chosen to be showcased on this website, such as the total number
            of exports conducted by the United States, as can be seen in this table, and the continents with the highest proportion of
            unimproved drinking water.
          </>
        }
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant='h3' gutterBottom>Unimproved Drinking Water by Continent</Typography>
            <ResponsiveContainer width='100%' height={360}>
              <BarChart data={water} margin={{ top: 10, right: 10, bottom: 30, left: 0 }}>
                <CartesianGrid strokeDasharray='3 3' vertical={false} />
                <XAxis dataKey='Continent' interval={0} angle={-25} textAnchor='end' tick={{ fontSize: 12 }} />
                <YAxis unit='%' />
                <Tooltip formatter={value => [`${value}%`, 'Max unimproved water access']} />
                <Bar dataKey='MaxUnimprovedWater' fill={colors.teal} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant='h3' gutterBottom>US Total Export by Trade Category</Typography>
            <DataTable rows={exports} columns={exportColumns} getRowId={row => row.Category} defaultPageSize={5} />
          </Grid>
        </Grid>
      </Section>

    </Page>
  );
}

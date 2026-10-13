import React, { useEffect, useState } from 'react';
import { Grid, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

import { getJson } from '../api';
import { colors } from '../theme';
import Page, { Section } from '../components/Page';
import DataTable from '../components/DataTable';
import ShowSql from '../components/ShowSql';

const QUESTIONS = [
  { question: 'Who buys the most US aircraft?', hint: 'Choose Export and "Aircraft, spacecraft"', page: 'Trades', to: '/trades' },
  { question: 'Which countries have the least clean drinking water?', hint: 'Set the drinking water range to 0 to 50', page: 'Living Conditions', to: '/countries-living-conditions' },
  { question: 'How do US and Mexican wages compare?', hint: 'Pick United States and Mexico', page: 'Wages', to: '/countries-wages' },
  { question: 'Where did wages grow fastest?', hint: 'Press Search to rank every country', page: 'Wage Growth', to: '/countries-wage-growth' },
];

const TRADE_COUNTRIES = [
  { label: 'All countries', value: 'World' },
  { label: 'Canada', value: 'Canada' },
  { label: 'Mexico', value: 'Mexico' },
  { label: 'Japan', value: 'Japan' },
  { label: 'South Korea', value: 'South Korea' },
  { label: 'United Kingdom', value: 'United Kingdom' },
];

const billions = value => `$${(value / 1e9).toFixed(1)}B`;

function TopTraded() {
  const [type, setType] = useState('Import');
  const [country, setCountry] = useState('World');
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getJson('/top_traded', { type, country }).then(setRows).catch(console.error);
  }, [type, country]);

  const direction = type === 'Import' ? 'imports from' : 'exports to';
  const place = country === 'World' ? 'the world' : country;

  return (
    <Section
      title={`Top US ${direction} ${place}, 2022`}
      description="The five largest product groups by dollar value, with each one's share of the total."
      query={['/top_traded', { type, country }]}
    >
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <ToggleButtonGroup size='small' color='primary' exclusive value={type} onChange={(e, value) => value && setType(value)}>
          <ToggleButton value='Import'>Imports</ToggleButton>
          <ToggleButton value='Export'>Exports</ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup size='small' color='primary' exclusive value={country} onChange={(e, value) => value && setCountry(value)} sx={{ flexWrap: 'wrap' }}>
          {TRADE_COUNTRIES.map(option => <ToggleButton key={option.value} value={option.value}>{option.label}</ToggleButton>)}
        </ToggleButtonGroup>
      </Stack>
      <ResponsiveContainer width='100%' height={280}>
        <BarChart data={rows} layout='vertical' margin={{ top: 0, right: 30, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray='3 3' horizontal={false} />
          <XAxis type='number' tickFormatter={billions} />
          <YAxis type='category' dataKey='Category' width={260} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value, name, { payload }) => [`${billions(value)} (${payload.SharePercent}% of the total)`, 'Value']} />
          <Bar dataKey='Value' fill={colors.teal} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Section>
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
            Your coffee, car, and phone likely crossed a border to reach you.
          </Typography>
          <p>
            TradeSphere follows those goods. It shows what the United States buys from and sells to {partners ? partners.toLocaleString() : '…'} countries
            across {categories ? categories.toLocaleString() : '…'} kinds of goods, and what life is like in those countries, from wages and jobs to clean
            water and climate.
          </p>
          <Typography variant='body2' sx={{ mb: 3 }}>
            By Lisa Garcia, Zung-Ru Lin, Hanling Su and Irene Tang for CIS 5500 at the University of Pennsylvania, Fall 2023.
            Revamped by Irene Tang in October 2026. <Link to='/about'>About the project</Link>
          </Typography>
        </>
      }
    >
      <TopTraded />

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
        Every chart and table runs a SQL query in your browser; press Show SQL under any of them to read it. The data was collected in November 2023: trade figures run through 2022 and country indicators through 2023.
      </Typography>

      <Section
        title='Data Introduction and Preview'
        description={
          <>
            The data used in this application stems from a SQL database that contains the United States' trading information from
            2010 to 2022 and country-specific information. More information on the data sources used for the database can be found here:
            {' '}<a href='https://tradingeconomics.com'>Trading Data</a> and <a href='https://ourworldindata.org/hunger-and-undernourishment'>Country Data</a>.
            Due to the vast amount of trading information, only some aspects were chosen to be showcased on this website, such as the total
            exports of the United States, as can be seen in this table, and the continents with the highest proportion of unimproved
            drinking water.
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
            <ShowSql route='/country/populationwater' />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant='h3' gutterBottom>US Total Exports by Trade Category</Typography>
            <DataTable rows={exports} columns={exportColumns} getRowId={row => row.Category} defaultPageSize={5} />
            <ShowSql route='/trading_export' />
          </Grid>
        </Grid>
      </Section>

    </Page>
  );
}

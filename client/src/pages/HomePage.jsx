import React, { useEffect, useState } from 'react';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

import { getJson, getText } from '../api';
import { colors } from '../theme';
import Page, { Section } from '../components/Page';
import DataTable from '../components/DataTable';

const QUESTIONS = [
  { text: 'Who buys the most US aircraft?', to: '/trades' },
  { text: 'Which countries have the least access to clean drinking water?', to: '/countries-living-conditions' },
  { text: 'How do wages in the US and Mexico compare over time?', to: '/countries-wages' },
  { text: 'Where did wages grow fastest?', to: '/countries-wage-growth' },
];

function Stat({ value, label }) {
  return (
    <Box>
      <Typography variant='h4' component='p' color='primary' fontWeight={800}>{value.toLocaleString()}</Typography>
      <Typography variant='body2'>{label}</Typography>
    </Box>
  );
}

const exportColumns = [
  { field: 'Category', headerName: 'Category', flex: 2 },
  { field: 'TotalExportValue', headerName: 'Total Export Value', flex: 1 },
];

export default function HomePage() {
  const [author, setAuthor] = useState('');
  const [exports, setExports] = useState([]);
  const [water, setWater] = useState([]);
  const [partners, setPartners] = useState(0);
  const [categories, setCategories] = useState(0);

  useEffect(() => {
    getText('/author/name').then(setAuthor).catch(console.error);
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
          <Typography variant='h5' component='p' color='text.primary' sx={{ mb: 2, maxWidth: 700 }}>
            Explore what the United States trades, with whom, and how those countries live.
          </Typography>
          <Stack direction='row' spacing={2} sx={{ mb: 3 }}>
            <Stat value={partners || '…'} label='trading partners' />
            <Stat value={categories || '…'} label='product categories' />
            <Stat value='18' label='years of data, 2005 to 2022' />
          </Stack>
          <Typography color='text.primary' fontWeight={600} gutterBottom>Start with a question</Typography>
          <Box component='ul' sx={{ mt: 0, pl: 2.5, '& li': { mb: 0.5 } }}>
            {QUESTIONS.map(({ text, to }) => (
              <li key={to}><Link to={to}>{text}</Link></li>
            ))}
          </Box>
          <p>
            Every number on this site comes from a SQL query running in your browser on a copy of the project's database.
            Trade data runs through 2022 and country indicators through 2023, as collected in November 2023.
          </p>
          <p>
            A group project for CIS 5500 at the University of Pennsylvania, fall 2023, revamped in 2026. <Link to='/about'>About the project</Link>
          </p>
        </>
      }
    >
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

      <Typography variant='body2' color='text.secondary' align='center'>{author}</Typography>
    </Page>
  );
}

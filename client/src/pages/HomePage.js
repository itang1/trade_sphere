import React, { useEffect, useState } from 'react';
import { Button, Grid, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

import { getJson, getText } from '../api';
import { colors } from '../theme';
import Page, { Section } from '../components/Page';
import DataTable from '../components/DataTable';

const exportColumns = [
  { field: 'Category', headerName: 'Category', flex: 2 },
  { field: 'TotalExportValue', headerName: 'Total Export Value', flex: 1 },
];

export default function HomePage() {
  const [author, setAuthor] = useState('');
  const [exports, setExports] = useState([]);
  const [water, setWater] = useState([]);

  useEffect(() => {
    getText('/author/name').then(setAuthor).catch(console.error);
    getJson('/trading_export').then(setExports).catch(console.error);
    getJson('/country/populationwater').then(setWater).catch(console.error);
  }, []);

  return (
    <Page
      title='TradeSphere'
      intro={
        <>
          <p>This web application provides an interactive platform for visualizing statistics pertaining to
            the United States' trading patterns and
            additional characteristics, such as demographics and social-economic indicators, on its trading partners.
            Users can explore detailed analytical findings on trade-related and country-specific indicators on the
            Trades and Countries pages respectively.
            They can interactively customize their data exploration by selecting countries,
            specific time intervals, and the type of exchanged goods by using our
            user-friendly tools (including sliders, drop-down menus, and pagination).</p>
          <p>We anticipate that our web application appeals to researchers and business
            owners who are interested in import and export strategies, market selection,
            and supply chain optimization.</p>
          <Stack direction='row' spacing={2}>
            <Button variant='contained' component={Link} to='/trades'>Explore trades</Button>
            <Button variant='outlined' component={Link} to='/countries-living-conditions'>Explore countries</Button>
          </Stack>
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

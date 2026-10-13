import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';

import { getJson } from '../api';
import { colors } from '../theme';
import { Note, Section } from '../components/Page';
import DataTable from '../components/DataTable';
import { Filters, Picker } from '../components/Controls';

const columns = [
  { field: 'Country', headerName: 'Country', flex: 1 },
  { field: 'Year', headerName: 'Year', flex: 1 },
  { field: 'Month', headerName: 'Month', flex: 1 },
  { field: 'TotalWage', headerName: 'Wage (USD/Year)', flex: 1, valueFormatter: ({ value }) => value?.toLocaleString() },
];

// One point per year-month, with a key for each selected country
function toTimeSeries(rows, countries) {
  const byMonth = new Map();
  for (const row of rows) {
    const yearMonth = `${row.Year}-${String(row.Month).padStart(2, '0')}`;
    if (!byMonth.has(yearMonth)) {
      byMonth.set(yearMonth, Object.fromEntries([['yearMonth', yearMonth], ...countries.map(c => [c, null])]));
    }
    byMonth.get(yearMonth)[row.Country] = row.TotalWage;
  }
  return [...byMonth.values()].sort((a, b) => a.yearMonth.localeCompare(b.yearMonth));
}

export default function CountriesWagesPage() {
  const [countries, setCountries] = useState([]);
  const [country1, setCountry1] = useState('United States');
  const [country2, setCountry2] = useState('Mexico');
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    getJson('/distcountries2')
      .then(rows => setCountries([...new Set(['United States', ...rows.map(row => row.Country)])]))
      .catch(console.error);
    searchWages();
  }, []);

  const searchWages = () => {
    getJson('/country/wages', { country1, country2 })
      .then(rows => {
        setData(rows);
        setSelected([country1, country2].filter(Boolean));
      })
      .catch(console.error);
  };

  const timeSeries = toTimeSeries(data, selected);

  return (
    <>
      <Typography color='text.secondary' sx={{ mb: 3, maxWidth: 820 }}>Compare average yearly wages in two countries over time, converted to US dollars, and see which countries' wages grew fastest.</Typography>
      <Section title='Comparison of Wages' query={['/country/wages', { country1, country2 }]}>
        <Filters onSearch={searchWages}>
          <Picker label='Country #1' value={country1} onChange={setCountry1} options={countries} />
          <Picker label='Country #2' value={country2} onChange={setCountry2} options={countries} />
        </Filters>

        {selected.length > 0 && (
          <Typography variant='h3' gutterBottom>Wage Comparison Over Time ({selected.join(' vs. ')})</Typography>
        )}
        {timeSeries.length === 0 ? (
          <Typography color='text.secondary' sx={{ py: 6, textAlign: 'center' }}>Pick two countries and press Search to compare their wages.</Typography>
        ) : (
          <Box sx={{ height: 360, mb: 3 }}>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={timeSeries} margin={{ top: 5, right: 10, bottom: 5, left: 20 }}>
                <CartesianGrid strokeDasharray='3 3' vertical={false} />
                <XAxis dataKey='yearMonth' tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={value => value.toLocaleString()} />
                <Tooltip formatter={value => value?.toLocaleString()} />
                <Legend />
                {selected.map((country, i) => (
                  <Line key={country} type='monotone' dataKey={country} stroke={i === 0 ? colors.teal : colors.accent} strokeWidth={2} dot={false} connectNulls />
                ))}
                <Brush dataKey='yearMonth' height={24} stroke={colors.teal} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}
        {data.length > 0 && <DataTable rows={data} columns={columns} getRowId={row => row.Country + row.Year + row.Month} />}
        <Note>Note: If no line is drawn for a selected country, our dataset has no wage data for that country.</Note>
      </Section>
    </>
  );
}

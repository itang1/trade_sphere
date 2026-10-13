import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { getJson } from '../api';
import { colors } from '../theme';
import { Note, Section } from '../components/Page';
import DataTable from '../components/DataTable';
import { Filters, RangeSlider } from '../components/Controls';

const columns = [
  { field: 'Country', headerName: 'Country', flex: 1.5 },
  { field: 'Region', headerName: 'Region', flex: 1.5 },
  { field: 'UrbanProportion', headerName: 'Urban Areas (%)', flex: 1 },
  { field: 'DrinkingWaterProportion', headerName: 'Drinking Water Access (%)', flex: 1 },
  { field: 'SanitationProportion', headerName: 'Sanitation Access (%)', flex: 1 },
  { field: 'InfantProportion', headerName: 'Infant Population (%)', flex: 1 },
];

export default function CountriesLivingConditionsPage() {
  const [data, setData] = useState([]);
  const [urbanProportion, setUrbanProportion] = useState([0, 100]);
  const [drinkingWaterProportion, setDrinkingWaterProportion] = useState([0, 100]);
  const [sanitationProportion, setSanitationProportion] = useState([0, 100]);
  const [infantProportion, setInfantProportion] = useState([0, 5]);
  const [water, setWater] = useState([]);

  useEffect(() => {
    getJson('/country/populationwater').then(setWater).catch(console.error);
  }, []);

  const params = {
    urban_low: urbanProportion[0], urban_high: urbanProportion[1],
    drinking_water_low: drinkingWaterProportion[0], drinking_water_high: drinkingWaterProportion[1],
    sanitation_low: sanitationProportion[0], sanitation_high: sanitationProportion[1],
    infant_low: infantProportion[0], infant_high: infantProportion[1],
  };

  const search = () => {
    getJson('/country/population', params)
      .then(setData)
      .catch(console.error);
  };

  return (
    <>
      <Typography color='text.secondary' sx={{ mb: 3, maxWidth: 820 }}>Filter countries by how urban they are, how many people have clean drinking water and sanitation, and the share of infants in the population.</Typography>
      <Section title='Living Conditions by Country' query={['/country/population', params]}>
        <Filters onSearch={search}>
          <RangeSlider label='Urban areas (%)' value={urbanProportion} onChange={setUrbanProportion} min={0} max={100} step={5} />
          <RangeSlider label='Drinking water (%)' value={drinkingWaterProportion} onChange={setDrinkingWaterProportion} min={0} max={100} step={5} />
          <RangeSlider label='Sanitation (%)' value={sanitationProportion} onChange={setSanitationProportion} min={0} max={100} step={5} />
          <RangeSlider label='Infants (%)' value={infantProportion} onChange={setInfantProportion} min={0} max={5} step={1} />
        </Filters>
        <DataTable rows={data} columns={columns} getRowId={row => row.Country} />
        <Note>
          <p>
            (1) Improved Drinking Water Access:
            This term signifies the availability of water sources that are adequately protected from external contaminants, particularly fecal matter, ensuring safe and clean water for consumption and use.
          </p>
          <p>
            (2) Improved Sanitation Access:
            This term refers to facilities that effectively separate human excreta from human contact, thus reducing health risks and enhancing hygiene, essential for preventing the spread of diseases.
          </p>
          <p>
            (3) Infant:
            Children under one year old.
          </p>
        </Note>
      </Section>

      <Section
        title='Least Access to Drinking Water, by Continent'
        description='For each continent, the country where the largest share of people lack improved drinking water.'
        query={['/country/populationwater']}
      >
        <ResponsiveContainer width='100%' height={320}>
          <BarChart data={water} margin={{ top: 10, right: 10, bottom: 30, left: 0 }}>
            <CartesianGrid strokeDasharray='3 3' vertical={false} />
            <XAxis dataKey='Continent' interval={0} angle={-25} textAnchor='end' tick={{ fontSize: 12 }} />
            <YAxis unit='%' />
            <Tooltip formatter={(value, name, { payload }) => [`${value}% in ${payload.Country}`, 'Without improved drinking water']} />
            <Bar dataKey='MaxUnimprovedWater' fill={colors.teal} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Section>
    </>
  );
}

import React, { useState } from 'react';

import { getJson } from '../api';
import Page, { Note, Section } from '../components/Page';
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

  const search = () => {
    getJson('/country/population', {
      urban_low: urbanProportion[0], urban_high: urbanProportion[1],
      drinking_water_low: drinkingWaterProportion[0], drinking_water_high: drinkingWaterProportion[1],
      sanitation_low: sanitationProportion[0], sanitation_high: sanitationProportion[1],
      infant_low: infantProportion[0], infant_high: infantProportion[1],
    })
      .then(setData)
      .catch(console.error);
  };

  return (
    <Page
      title='Living Conditions'
      intro={<p>Uncover the realities of living conditions around the world, a journey that reveals the contrasts and similarities between nations. From the bustling urban landscapes to the availability of essential services like clean drinking water and sanitation, each country tells a unique story. Understanding these conditions, including the critical aspect of infant mortality rates, offers invaluable insights into the challenges and progress of different societies. This knowledge not only enriches your global perspective but also empowers you to engage with international issues more meaningfully. Dive into this exploration to grasp the diverse tapestry of life across our planet.</p>}
    >
      <Section>
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
            Refers to facilities that effectively separate human excreta from human contact, thus reducing health risks and enhancing hygiene, essential for preventing the spread of diseases.
          </p>
          <p>
            (3) Infant:
            Children under one year old.
          </p>
        </Note>
      </Section>
    </Page>
  );
}

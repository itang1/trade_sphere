import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';

import { getJson } from '../api';
import { Insight, Note, Section } from '../components/Page';
import DataTable from '../components/DataTable';
import { Filters, RangeSlider } from '../components/Controls';

const columns = [
    { field: 'Country', headerName: 'Country', flex: 1 },
    { field: 'TemperatureChange', headerName: 'Temperature Change (°C)', flex: 1, valueFormatter: ({ value }) => value?.toFixed(2) },
];

export default function CountriesTemperaturePage() {
    const [data, setData] = useState([]);
    const [temperatureChange, setTemperatureChange] = useState([-2, 2]);

    const search = () => {
        getJson('/country/temperature', { delta_low: temperatureChange[0], delta_high: temperatureChange[1] })
            .then(setData)
            .catch(console.error);
    };

    useEffect(search, []);

    const [warmest] = data;
    const coolest = data[data.length - 1];

    return (
        <>
            <Typography color='text.secondary' sx={{ mb: 3, maxWidth: 820 }}>How much each country's average temperature changed between its first and last year of data, 2005 to 2021.</Typography>
            <Section title='Temperature Change, 2005 to 2021' query={['/country/temperature', { delta_low: temperatureChange[0], delta_high: temperatureChange[1] }]}>
                <Filters onSearch={search}>
                    <RangeSlider label='Temperature change (°C)' value={temperatureChange} onChange={setTemperatureChange} min={-2} max={2} step={0.5} />
                </Filters>
                {warmest && (
                    <Insight>
                        Largest rise: {warmest.Country}, {warmest.TemperatureChange.toFixed(1)} °C over {warmest.YearsElapsed} years.
                        {coolest.TemperatureChange < 0 && ` Largest drop: ${coolest.Country}, ${coolest.TemperatureChange.toFixed(1)} °C.`}
                    </Insight>
                )}
                <DataTable rows={data} columns={columns} getRowId={row => row.Country} />
                <Note>
                    Note: Countries experiencing drastic changes in temperature could be affected by a combination of natural climate variability and human-induced climate change factors.
                    <br />
                    Kuwait extreme climate: <a href="https://www.dw.com/en/kuwaits-climate-crisis-a-scorching-nation-in-denial/a-61261999" target="_blank" rel="noopener noreferrer">DW: Kuwait's climate crisis</a>
                </Note>
            </Section>
        </>
    );
}

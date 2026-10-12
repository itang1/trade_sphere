import React, { useState } from 'react';

import { getJson } from '../api';
import Page, { Note, Section } from '../components/Page';
import DataTable from '../components/DataTable';
import { Filters, RangeSlider } from '../components/Controls';

const columns = [
    { field: 'Country', headerName: 'Country', flex: 1 },
    { field: 'TemperatureChange', headerName: 'Temperature Change (°C)', flex: 1 },
];

export default function CountriesTemperaturePage() {
    const [data, setData] = useState([]);
    const [temperatureChange, setTemperatureChange] = useState([-2, 2]);

    const search = () => {
        getJson('/country/temperature', { delta_low: temperatureChange[0], delta_high: temperatureChange[1] })
            .then(setData)
            .catch(console.error);
    };

    return (
        <Page
            title='Temperature Change 2006-2022'
            intro={<p>Embark on a journey to understand how countries around the world are tackling the pressing challenge of global warming. Discover the innovative strategies and measures being implemented to combat climate change, from cutting-edge green technologies to bold policy initiatives. This exploration not only highlights the urgency of the issue but also celebrates the collective efforts to protect our planet. Gain insights into the global temperature trends and become part of a growing community that's raising environmental awareness. Your awareness and actions can make a significant difference in shaping a sustainable future.</p>}
        >
            <Section>
                <Filters onSearch={search}>
                    <RangeSlider label='Temperature change (°C)' value={temperatureChange} onChange={setTemperatureChange} min={-2} max={2} step={0.5} />
                </Filters>
                <DataTable rows={data} columns={columns} getRowId={row => row.Country} />
                <Note>
                    Note: Countries experiencing drastic changes in temperature could be affected by a combination of natural climate variability and human-induced climate change factors.
                    <br />
                    Kuwait extreme climate: <a href="https://www.dw.com/en/kuwaits-climate-crisis-a-scorching-nation-in-denial/a-61261999" target="_blank" rel="noopener noreferrer">DW: Kuwait's climate crisis</a>
                </Note>
            </Section>
        </Page>
    );
}

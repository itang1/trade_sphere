import React, { useState } from 'react';

import { getJson } from '../api';
import Page, { Note, Section } from '../components/Page';
import DataTable from '../components/DataTable';
import { Filters, RangeSlider } from '../components/Controls';

const columns = [
    { field: 'Country', headerName: 'Country', flex: 2 },
    { field: 'Year', headerName: 'Year', flex: 1 },
    { field: 'Month', headerName: 'Month', flex: 1 },
    { field: 'HighestUnemploymentRate', headerName: 'Highest Unemployment Rate (%)', flex: 2 },
];

export default function CountriesLaborPage() {
    const [data, setData] = useState([]);
    const [unemployment, setUnemployment] = useState([0, 100]);

    const search = () => {
        getJson('/home/labour', { unemp_low: unemployment[0], unemp_high: unemployment[1] })
            .then(setData)
            .catch(console.error);
    };

    return (
        <Page
            title='Highest Unemployment Rate by Country'
            intro={<p>Dive into the revealing world of global unemployment rates, where numbers tell stories of socio-economic landscapes and pivotal events shaping nations. Discovering countries with the highest unemployment rates opens a window into complex issues like political unrest, economic downturns, or transformative industrial shifts. This knowledge not only illuminates the challenges faced by these countries but also offers a deeper understanding of global economic interconnections. By exploring these unemployment statistics, you become a witness to the evolving narratives of nations and the resilience of their people in the face of adversity.</p>}
        >
            <Section>
                <Filters onSearch={search}>
                    <RangeSlider label='Highest unemployment rate (%)' value={unemployment} onChange={setUnemployment} min={0} max={100} step={10} />
                </Filters>
                <DataTable rows={data} columns={columns} getRowId={row => row.Country} />
                <Note>
                    The peak year and month can shed light on significant real-world events, offering insights into underlying factors and circumstances.
                    <br />
                    South Africa coverage (2021): <a href="https://www.reuters.com/world/africa/south-africas-unemployment-rate-hits-new-record-high-q4-2021-2022-03-29/" target="_blank" rel="noopener noreferrer">Reuters: South Africa's unemployment rate hits new record high</a>
                </Note>
            </Section>
        </Page>
    );
}

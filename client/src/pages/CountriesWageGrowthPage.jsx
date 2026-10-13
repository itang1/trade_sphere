import React, { useState } from 'react';

import { getJson } from '../api';
import Page, { Note, Section } from '../components/Page';
import DataTable from '../components/DataTable';
import { Filters, RangeSlider } from '../components/Controls';

const columns = [
    { field: 'Country', headerName: 'Country', flex: 1 },
    { field: 'AvgYearlyIncrease_perc', headerName: '% Yearly Wage Increase', flex: 1 },
];

export default function CountriesWageGrowthPage() {
    const [data, setData] = useState([]);
    const [growth, setGrowth] = useState([-5, 1200]);

    const search = () => {
        getJson('/country/wage_growth', { growth_low: growth[0], growth_high: growth[1] })
            .then(setData)
            .catch(console.error);
    };

    return (
        <Page
            title='Average Yearly Wage Increase, 2005 to 2023'
            intro={<p>Discover the dynamic landscape of global wage growth and unlock a wealth of opportunities. Delve into the intricacies of different countries' economies through their wage trends, providing a unique lens to gauge economic health and job market vitality. This knowledge not only guides astute investment decisions and business strategies but also opens doors to promising career paths and enlightens policy understanding. Stay ahead in the fast-paced world of economics by keeping a pulse on the ever-evolving patterns of wage growth across the globe.</p>}
        >
            <Section query={['/country/wage_growth', { growth_low: growth[0], growth_high: growth[1] }]}>
                <Filters onSearch={search}>
                    <RangeSlider label='Average yearly increase (%)' value={growth} onChange={setGrowth} min={-5} max={1200} step={5} />
                </Filters>
                <DataTable rows={data} columns={columns} getRowId={row => row.Country} />
                <Note>
                    Note: Financial instability, including inflation and other economic crises, can be a factor in significant wage increases.
                    <br />
                    Argentina inflation: <a href="https://www.inflationtool.com/rates/argentina/historical" target="_blank" rel="noopener noreferrer">historical inflation rates</a>
                </Note>
            </Section>
        </Page>
    );
}

import React, { useEffect, useState } from 'react';
import { getJson } from '../api';
import { Insight, Note, Section } from '../components/Page';
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

    useEffect(search, []);

    const [fastest] = data;

    return (
        <>
            <Section title='Average Yearly Wage Growth, 2005 to 2023' query={['/country/wage_growth', { growth_low: growth[0], growth_high: growth[1] }]}>
                <Filters onSearch={search}>
                    <RangeSlider label='Average yearly increase (%)' value={growth} onChange={setGrowth} min={-5} max={1200} step={5} />
                </Filters>
                {fastest && (
                    <Insight>
                        Fastest growth: {fastest.Country}, {fastest.AvgYearlyIncrease_perc}% a year on average. Very high rates usually reflect inflation rather than richer workers.
                    </Insight>
                )}
                <DataTable rows={data} columns={columns} getRowId={row => row.Country} />
                <Note>
                    Note: Financial instability, including inflation and other economic crises, can be a factor in significant wage increases.
                    <br />
                    Argentina inflation: <a href="https://www.inflationtool.com/rates/argentina/historical" target="_blank" rel="noopener noreferrer">historical inflation rates</a>
                </Note>
            </Section>
        </>
    );
}

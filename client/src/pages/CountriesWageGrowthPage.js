import { Button, Container, Grid, Slider } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useState } from 'react';

const config = require('../config.json');

export default function CountriesWageGrowthPage() {
    const [pageSize, setPageSize] = useState(5);
    const [data, setData] = useState([]);

    const [avgYearlyIncrease_perc, setAvgYearlyIncrease_perc] = useState([-5, 1200]);

    const search = () => {
        fetch(`http://${config.server_host}:${config.server_port}/country/wage_growth?growth_low=${avgYearlyIncrease_perc[0]}&growth_high=${avgYearlyIncrease_perc[1]}`)
            .then(res => res.json())
            .then(resJson => {
                const countriesWithId = resJson.map((country) => ({ id: country.Country, ...country }));
                setData(countriesWithId);
            });
    };


    const columns = [
        { field: 'Country', headerName: 'Country', width: 200 },
        { field: 'AvgYearlyIncrease_perc', headerName: '% Yearly Wage Increase', width: 500},
    ];

    return (
        <Container>
            <h2>View Countries by Average Yearly Wage Increase</h2>
            <Grid container spacing={15}>
                <Grid item xs={15}>
                    <p>Average Percent Yearly Increase</p>
                    <Slider
                        value={avgYearlyIncrease_perc}
                        min={-5}
                        max={1200}
                        step={5}
                        onChange={(_, newValue) => setAvgYearlyIncrease_perc(newValue)}
                        valueLabelDisplay='auto'
                    />
                </Grid>
            </Grid>
            <Button onClick={() => search()} style={{ marginTop: '16px' }} variant="contained" color="primary" >
                Search
            </Button>
            <br></br>
            <br></br>
            <br></br>
            <DataGrid
                rows={data}
                columns={columns}
                pageSize={pageSize}
                rowsPerPageOptions={[5, 10, 25]}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                autoHeight
            />

        </Container>
    );
}
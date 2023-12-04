import React, { useEffect, useState } from 'react';
import { Button, Container, Grid, Slider } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const config = require('../config.json');

export default function CountriesLaborPage() {
    const [pageSize, setPageSize] = useState(5);
    const [data, setData] = useState([]);
    const [unemployment, setUnemployment] = useState([0, 100]);

    const search = () => {
        fetch(`http://${config.server_host}:${config.server_port}/home/labour?unemp_low=${unemployment[0]}&unemp_high=${unemployment[1]}`)
            .then(res => res.json())
            .then(resJson => {
                const countriesWithId = resJson.map((country) => ({ id: country.Country, ...country }));
                setData(countriesWithId);
            });
    };


    const columns = [
        { field: 'Country', headerName: 'Country', width: 100 },
        { field: 'Year', headerName: 'Year', width: 200 },
        { field: 'Month', headerName: 'Month', width: 200 },
        { field: 'HighestUnemploymentRate', headerName: 'Highest Unemployment Rate', width: 400 },
    ];

    return (
        <Container>
            <h2>View Highest Unemployment Rate By Country</h2>
            <Grid container spacing={6}>
                <Grid item xs={15}>
                    <p>Highest Unemployment Rate</p>
                    <Slider
                        value={unemployment}
                        min={0}
                        max={100}
                        step={10}
                        onChange={(_, newValue) => setUnemployment(newValue)}
                        valueLabelDisplay='auto'
                    />
                </Grid>
            </Grid>
            <Button onClick={() => search()} style={{ marginTop: '16px' }} variant="contained" color="primary" >
                Search
            </Button>
            <h2></h2>
            <DataGrid
                rows={data}
                columns={columns}
                pageSize={pageSize}
                rowsPerPageOptions={[5, 10, 25]}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                autoHeight
                onSelectionModelChange={(selection) => setSelectedCountry(selection[0])}
            />

            <br></br>
            <br></br>

        </Container>
    );
}

import React, { useEffect, useState } from 'react';
import { Button, Container, Grid, Slider } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
// import Chart from 'chart.js/auto'; // Import Chart.js

const config = require('../config.json');

export default function CountriesTemperaturePage() {
    const [pageSize, setPageSize] = useState(5);
    const [data, setData] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [temperatureChange, setTemperatureChange] = useState([-2, 2]);

    const search = () => {
        fetch(`http://${config.server_host}:${config.server_port}/country/temperature?delta_low=${temperatureChange[0]}&delta_high=${temperatureChange[1]}`)
            .then(res => res.json())
            .then(resJson => {
                const countriesWithId = resJson.map((country) => ({ id: country.Country, ...country }));
                setData(countriesWithId);
            });
    };

    // const displayChart = () => {
    //     fetch(`http://${config.server_host}:${config.server_port}/country/temperature?delta_low=${temperatureChange[0]}&delta_high=${temperatureChange[1]}`)
    //         .then(res => res.json())
    //         .then(resJson => {
    //             const countriesWithId = resJson.map((country) => ({ id: country.Country, ...country }));

    //             // Chart creation logic within the search function
    //             const ctx = document.getElementById('temperatureChangeChart');
    //             const labels = countriesWithId.map(country => country.Country);
    //             const tempChangeValues = countriesWithId.map(country => country.TemperatureChange);

    //             const chart = new Chart(ctx, {
    //                 type: 'bar',
    //                 data: {
    //                     labels: labels,
    //                     datasets: [{
    //                         label: 'Temperature Change',
    //                         data: tempChangeValues,
    //                         backgroundColor: 'rgba(255, 99, 132, 0.6)',
    //                         borderColor: 'rgba(255, 99, 132, 1)',
    //                         borderWidth: 1
    //                     }]
    //                 },
    //                 options: {
    //                     scales: {
    //                         y: {
    //                             beginAtZero: true
    //                         }
    //                     }
    //                 }
    //             });
    //         });
    // };

    const columns = [
        { field: 'Country', headerName: 'Country', width: 100 },
        { field: 'TemperatureChange', headerName: 'TemperatureChange', width: 200 },
    ];

    return (
        <Container>
            <h2>View Countries by Temperature Change 2006-2022</h2>
            <Grid container spacing={6}>
                <Grid item xs={15}>
                    <p>Temperature Change</p>
                    <Slider
                        value={temperatureChange}
                        min={-2}
                        max={2}
                        step={0.5}
                        onChange={(_, newValue) => setTemperatureChange(newValue)}
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

            {/* <h2>Chart</h2>

            <Button onClick={() => displayChart()} style={{ marginTop: '16px' }} variant="contained" color="primary" >
                Display Chart
            </Button>

            <canvas id="temperatureChangeChart" width="400" height="200"></canvas> */}

        </Container>
    );
}
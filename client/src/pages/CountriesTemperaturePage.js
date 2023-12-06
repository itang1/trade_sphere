import React, { useState } from 'react';
import { Button, Container, Grid, Slider } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import Chart from 'chart.js/auto'; // Import Chart.js

const config = require('../config.json');

export default function CountriesTemperaturePage() {
    const [pageSize, setPageSize] = useState(10);
    const [data, setData] = useState([]);
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
        { field: 'Country', headerName: 'Country', width: 600 },
        { field: 'TemperatureChange', headerName: 'Temperature Change (°C)', width: 800 },
    ];

    return (
        <div style={{ backgroundColor: '#F8F7F1', padding: '10px' }}>
        <Container>
            <h1>Temperature Change 2006-2022</h1>
            <p style={{ marginTop: '10px', fontStyle: 'italic' }}>
            Embark on a journey to understand how countries around the world are tackling the pressing challenge of global warming. Discover the innovative strategies and measures being implemented to combat climate change, from cutting-edge green technologies to bold policy initiatives. This exploration not only highlights the urgency of the issue but also celebrates the collective efforts to protect our planet. Gain insights into the global temperature trends and become part of a growing community that's raising environmental awareness. Your awareness and actions can make a significant difference in shaping a sustainable future.
                    
            </p>
            <hr></hr>
            <br></br>
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
                        sx={{
                            '& .MuiSlider-thumb': {
                              color: '#3C6E71', // This will change the thumb color
                            },
                            '& .MuiSlider-track': {
                              color: '#3C6E71', // This will change the track color
                            },
                            '& .MuiSlider-rail': {
                              color: '#bfbfbf', // This will change the rail color
                            },
                          }}
                    />
                </Grid>
            </Grid>
            <Button onClick={() => search()} style={{ marginTop: '16px', backgroundColor: '#3C6E71', color: 'white' }}
  variant="contained">
                Search
            </Button>
            <br></br>
            <br></br>
            <DataGrid
                rows={data}
                columns={columns}
                pageSize={pageSize}
                rowsPerPageOptions={[5, 10, 25]}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              csvOptions: { disableToolbarButton: false},
              printOptions: { disableToolbarButton: true },
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 250 },
            },}}
                autoHeight
                sx={{
                    backgroundColor: '#F2ECE1',
                    '& .MuiDataGrid-cell': {
                        borderColor: '#F7E7CE',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#F2ECE1',
                    },
                    '& .MuiDataGrid-row': {
                        '&:nth-of-type(odd)': {
                            backgroundColor: '#F8F7F1', // for zebra striping, if needed
                        },
                    },
                }}
            />

            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            
            <br></br>
            <br></br>
            
            <br></br>
            <br></br>
            
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            
            

            {/* <h2>Chart</h2>

            <Button onClick={() => displayChart()} style={{ marginTop: '16px' }} variant="contained" color="primary" >
                Display Chart
            </Button>

            <canvas id="temperatureChangeChart" width="400" height="200"></canvas> */}

        </Container></div>
    );
}
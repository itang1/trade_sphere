import React, { useState } from 'react';
import { Button, Container, Grid, Slider } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

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
                            csvOptions: { disableToolbarButton: false },
                            printOptions: { disableToolbarButton: true },
                            showQuickFilter: true,
                            quickFilterProps: { debounceMs: 250 },
                        },
                    }}
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
                <p style={{ marginTop: '10px', fontStyle: 'italic' }}>
                    <br></br>
                    Note: Countries experiencing drastic changes in temperature could be affected by a combination of natural climate variability and human-induced climate change factors.
                    <br></br>
                    Kuwait Extreme Climate: <a href="https://www.dw.com/en/kuwaits-climate-crisis-a-scorching-nation-in-denial/a-61261999#:~:text=,everyone%20to%20the%20brink" target="_blank" rel="noopener noreferrer">
                        https://www.dw.com/en/kuwaits-climate-crisis-a-scorching-nation-in-denial/
                    </a>



                </p>

            </Container></div>
    );
}
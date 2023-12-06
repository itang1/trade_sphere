import React, { useState } from 'react';
import { Button, Container, Grid, Slider} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const config = require('../config.json');

export default function CountriesLivingConditionsPage() {
    const [pageSize, setPageSize] = useState(10);
    const [data, setData] = useState([]);

    const [urbanProportion, setUrbanProportion] = useState([0, 100]);
    const [drinkingWaterProportion, setDrinkingWaterProportion] = useState([0, 100]);
    const [sanitationProportion, setSanitationProportion] = useState([0, 100]);
    const [infantProprtion, setInfantProportion] = useState([0, 5]);

    const search = () => {
        fetch(`http://${config.server_host}:${config.server_port}/country/population?urban_low=${urbanProportion[0]}&urban_high=${urbanProportion[1]}`
            + `&drinking_water_low=${drinkingWaterProportion[0]}&drinking_water_high=${drinkingWaterProportion[1]}`
            + `&sanitation_low=${sanitationProportion[0]}&sanitation_high=${sanitationProportion[1]}`
            + `&infant_low=${infantProprtion[0]}&infant_high=${infantProprtion[1]}`
        )
            .then(res => res.json())
            .then(resJson => {
                const countriesWithId = resJson.map((country) => ({ id: country.Country, ...country }));
                setData(countriesWithId);
            });
    };


    const columns = [
        { field: 'Country', headerName: 'Country', width: 150 },
        { field: 'Region', headerName: 'Region', width: 200 },
        { field: 'UrbanProportion', headerName: 'Urban Areas (%)', width: 200 },
        { field: 'DrinkingWaterProportion', headerName: 'Drinking Water Access (%)', width: 200 },
        { field: 'SanitationProportion', headerName: 'Sanitation Access (%)', width: 200 },
        { field: 'InfantProportion', headerName: 'Infant Population (%)', width: 200 },
    ];

    return (
        <div style={{ backgroundColor: '#F8F7F1', padding: '10px' }}>
        <Container>
            <h1>Living Condition</h1>
            <p style={{ marginTop: '10px', fontStyle: 'italic' }}>
            Uncover the realities of living conditions around the world, a journey that reveals the contrasts and similarities between nations. From the bustling urban landscapes to the availability of essential services like clean drinking water and sanitation, each country tells a unique story. Understanding these conditions, including the critical aspect of infant mortality rates, offers invaluable insights into the challenges and progress of different societies. This knowledge not only enriches your global perspective but also empowers you to engage with international issues more meaningfully. Dive into this exploration to grasp the diverse tapestry of life across our planet.

                    
            </p>
            <hr></hr>
<br></br>
            <Grid container spacing={6}>
                <Grid item xs={3}>
                    <p>Urban Areas (%)</p>
                    <Slider
                        value={urbanProportion}
                        min={0}
                        max={100}
                        step={5}
                        onChange={(_, newValue) => setUrbanProportion(newValue)}
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
                <Grid item xs={3}>
                    <p>Drinking Water Access (%)</p>
                    <Slider
                        value={drinkingWaterProportion}
                        min={0}
                        max={100}
                        step={5}
                        onChange={(_, newValue) => setDrinkingWaterProportion(newValue)}
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
                <Grid item xs={3}>
                    <p>Sanitation Access (%)</p>
                    <Slider
                        value={sanitationProportion}
                        min={0}
                        max={100}
                        step={5}
                        onChange={(_, newValue) => setSanitationProportion(newValue)}
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
                <Grid item xs={3}>
                    <p>Infant Population (%)</p>
                    <Slider
                        value={infantProprtion}
                        min={0}
                        max={5}
                        step={1}
                        onChange={(_, newValue) => setInfantProportion(newValue)}
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
            <div style={{ marginTop: '10px', fontStyle: 'italic' }}>
            <br></br>Definition:
    <p>
        (1) Improved Drinking Water Access:
        This term signifies the availability of water sources that are adequately protected from external contaminants, particularly fecal matter, ensuring safe and clean water for consumption and use.
    </p>
    <p>
        (2) Improved Sanitation Access:
        Refers to facilities that effectively separate human excreta from human contact, thus reducing health risks and enhancing hygiene, essential for preventing the spread of diseases.
    </p>
    <p>
        (3) Infant:
        Children under one year old.
    </p>
</div>
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
        </Container></div>
    );
}
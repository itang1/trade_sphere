import React, { useState } from 'react';
import { Button, Container, Grid, Slider} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const config = require('../config.json');

export default function CountriesLivingConditionsPage() {
    const [pageSize, setPageSize] = useState(5);
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
        { field: 'Country', headerName: 'Country', width: 100 },
        { field: 'Region', headerName: 'Region', width: 200 },
        { field: 'UrbanProportion', headerName: '% In urban areas', width: 200 },
        { field: 'DrinkingWaterProportion', headerName: '% Having drinking water', width: 200 },
        { field: 'SanitationProportion', headerName: '% Having sanitation', width: 200 },
        { field: 'InfantProportion', headerName: '% Being infant', width: 200 },
    ];

    return (
        <Container>
            <h2>View Countries by Living Condition</h2>
            <Grid container spacing={6}>
                <Grid item xs={3}>
                    <p>% In urban areas</p>
                    <Slider
                        value={urbanProportion}
                        min={0}
                        max={100}
                        step={5}
                        onChange={(_, newValue) => setUrbanProportion(newValue)}
                        valueLabelDisplay='auto'
                    />
                </Grid>
                <Grid item xs={3}>
                    <p>% Having drinking water</p>
                    <Slider
                        value={drinkingWaterProportion}
                        min={0}
                        max={100}
                        step={5}
                        onChange={(_, newValue) => setDrinkingWaterProportion(newValue)}
                        valueLabelDisplay='auto'
                    />
                </Grid>
                <Grid item xs={3}>
                    <p>% Having sanitation</p>
                    <Slider
                        value={sanitationProportion}
                        min={0}
                        max={100}
                        step={5}
                        onChange={(_, newValue) => setSanitationProportion(newValue)}
                        valueLabelDisplay='auto'
                    />
                </Grid>
                <Grid item xs={3}>
                    <p>% Being Infant</p>
                    <Slider
                        value={infantProprtion}
                        min={0}
                        max={5}
                        step={1}
                        onChange={(_, newValue) => setInfantProportion(newValue)}
                        valueLabelDisplay='auto'
                    />
                </Grid>
            </Grid>
            <Button onClick={() => search()} style={{ marginTop: '16px' }} variant="contained" color="primary" >
                Search
            </Button>
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
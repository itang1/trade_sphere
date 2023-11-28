
import { useEffect, useState } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import LazyTable from '../components/LazyTable';

const config = require('../config.json');

export default function CountriesTemperaturePage() {
    const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

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


    const columns = [
        { field: 'Country', headerName: 'Country', width: 100 },
        { field: 'TemperatureChange', headerName: 'TemperatureChange', width: 200 },
    ];


    return (
        <Container>
            <h2>View Countries by Temperture Change 2006-2022</h2>
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

        </Container>
    );
}

import { useEffect, useState } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import LazyTable from '../components/LazyTable';


const config = require('../config.json');

export default function CountriesPage() {
    const [pageSize, setPageSize] = useState(10);

    const [countries, setCountries] = useState([]);
    const [data, setData] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);

    const [urbanProportion, setUrbanProportion] = useState([0, 100]);

    const searchPopulation = () => {
        fetch(`http://${config.server_host}:${config.server_port}/country/population?urban_prop_low=${urbanProportion[0]}&urban_prop_high=${urbanProportion[1]}`)
            .then(res => res.json())
            .then(resJson => {
                const countriesWithId = resJson.map((country) => ({ id: country.Country, ...country }));
                setData(countriesWithId);
            });
    };

    const columns = [
        { field: 'Country', headerName: 'Country', width: 200 },
        { field: 'UrbanProportion', headerName: 'Proportion in Urban areas', width: 500 },
    ];

    // flexFormat provides the formatting options for a "flexbox" layout that enables the album cards to
    // be displayed side-by-side and wrap to the next line when the screen is too narrow. Flexboxes are
    // incredibly powerful. You can learn more on MDN web docs linked below (or many other online resources)
    // https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox
    const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

    return (
        <Container>
            {selectedCountry && <p>{`Selected Country: ${selectedCountry}`}</p>}
            <h2>View Countries by Demographics</h2>
            <Grid container spacing={1}>
                <Grid item xs={14}>
                    <p>Proportion of population in Urban areas</p>
                    <Slider
                        value={urbanProportion}
                        min={0}
                        max={100}
                        step={5}
                        onChange={(_, newValue) => setUrbanProportion(newValue)}
                        valueLabelDisplay='auto'
                    />
                </Grid>
            </Grid>
            <Button onClick={() => searchPopulation()} style={{ marginTop: '16px' }}>
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

import { useEffect, useState } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SongCard from '../components/SongCard';
import LazyTable from '../components/LazyTable';


const config = require('../config.json');

export default function CountriesPage() {
    const [pageSize, setPageSize] = useState(10);

    const [countries, setCountries] = useState([]);
    const [data, setData] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);

    const [population, setPopulation] = useState([0, 1000000000]);
    const [urbanProportion, setUrbanProportion] = useState([0, 100]);
    const [unimprovedWater, setUnimprovedWater] = useState([0, 100]);

    useEffect(() => {
        // Fetch initial data on component mount
        fetch(`http://${config.server_host}:${config.server_port}/country/populationwater/`)
            .then(res => res.json())
            .then(resJson => setCountries(resJson));
    }, []);

    // const countriesWithId = resJson.map((country) => ({ id: country.Country, ...country }));
    // setData(countriesWithId);


    const search = () => {
        fetch(`http://${config.server_host}:${config.server_port}/country/populationwater?population_low=${population[0]}&population_high=${population[1]}` +
            `&urbanProportion_low=${urbanProportion[0]}&urbanProportion_high=${urbanProportion[1]}` +
            `&unimprovedWater_low=${unimprovedWater[0]}&unimprovedWater_high=${unimprovedWater[1]}`)
            .then(res => res.json())
            .then(resJson => {
                const countriesWithId = resJson.map((country) => ({ id: country.Country, ...country }));
                setData(countriesWithId);
            });
    };

    const columns = [
        { field: 'Country', headerName: 'Country', width: 200 },
        { field: 'UrbanProportion', headerName: '% Urban' },
        { field: 'MaxUnimprovedWater', headerName: 'Max Unimproved Water' },
    ];

    // flexFormat provides the formatting options for a "flexbox" layout that enables the album cards to
    // be displayed side-by-side and wrap to the next line when the screen is too narrow. Flexboxes are
    // incredibly powerful. You can learn more on MDN web docs linked below (or many other online resources)
    // https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox
    const flexFormat = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' };

    return (
        <Container>
            {selectedCountry && <p>{`Selected Country: ${selectedCountry}`}</p>}
            <h2>Search Countries</h2>
            <Grid container spacing={3}>
                <Grid item xs={4}>
                    <p>Population</p>
                    <Slider
                        value={population}
                        min={0}
                        max={1000000000}
                        step={10000000}
                        onChange={(_, newValue) => setPopulation(newValue)}
                        valueLabelDisplay='auto'
                    />
                </Grid>
                <Grid item xs={4}>
                    <p>Urban Proportion</p>
                    <Slider
                        value={urbanProportion}
                        min={0}
                        max={100}
                        step={1}
                        onChange={(_, newValue) => setUrbanProportion(newValue)}
                        valueLabelDisplay='auto'
                    />
                </Grid>
                <Grid item xs={4}>
                    <p>Unimproved Water</p>
                    <Slider
                        value={unimprovedWater}
                        min={0}
                        max={100}
                        step={1}
                        onChange={(_, newValue) => setUnimprovedWater(newValue)}
                        valueLabelDisplay='auto'
                    />
                </Grid>
            </Grid>
            <Button onClick={() => search()} style={{ marginTop: '16px' }}>
                Search
            </Button>
            <h2>Results</h2>
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
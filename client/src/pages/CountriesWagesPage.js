import React, { useEffect, useState } from 'react';
import { Button, Container, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';


const config = require('../config.json');


export default function CountriesWagesPage() {

    const [pageSize, setPageSize] = useState(10);
    const [country1, setCountry1] = useState('')
    const [country2, setCountry2] = useState('')
    const [year, setYear] = useState('')
    const [data, setData] = useState([])
    const [possibleCountries, setPossibleCountries] = useState([])
    const [possibleYears, setPossibleYears] = useState([])


    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/distcountries`)
            .then(res => res.json())
            .then(resJson => setPossibleCountries(resJson))
            .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/distyears`)
            .then(res => res.json())
            .then(resJson => setPossibleYears(resJson))
            .catch(error => console.error(error));
    }, []);


    const searchWages = () => {
        fetch(`http://${config.server_host}:${config.server_port}/country/wages?country1=${country1}&country2=${country2}&year=${year}`)
            .then(res => res.json())
            .then(resJson => setData(resJson))
            .catch(error => console.error(error));
    }

    // useEffect(() => {
    //     fetch(`http://${config.server_host}:${config.server_port}/country/wage_growth`)
    //         .then(res => res.json())
    //         .then(resJson => setData(resJson))
    //         .catch(error => console.error(error));
    // }, []);


    const columnsWages = [
        { field: 'Country', headerName: 'Country', flex: 1 },
        { field: 'Year', headerName: 'Year', flex: 1 },
        { field: 'Month', headerName: 'Month', flex: 1 },
        { field: 'B.Value * U.ConversionRate', headerName: 'Wage (USD/Year)', flex: 1 },
    ]

    const countryMenuItems = possibleCountries.map(item => (
        <MenuItem value={item.Country2}>{item.Country2}</MenuItem>
    ));

    const yearMenuItems = possibleYears.map(item => (
        <MenuItem value={item.Year}>{item.Year}</MenuItem>
    ));


    return (

        <Container><div style={{ padding: "10px" }} >
            <h1>Wages</h1>


            <div style={{ padding: "10px", backgroundColor: '#F4ECE2' }} >
                <p> This page provides an overview of wages and wage growth across countries.</p>
            </div>

<br></br>
<hr></hr>
<br></br>

            <div >
                <h2>Comparison of Wages</h2>
            </div>

            <Grid item xs={2} >
                <InputLabel variant="standard" htmlFor="types">
                    Select Country #1
                </InputLabel>
                <Select id="country1"
                    sx={{
                        width: 200, height: 50, border: 1, borderColor: '#7E7E7E',
                    }} onChange=
                    {(event) => { setCountry1(event.target.value) }} value={country1} >
                    <MenuItem disabled>Choose a country ...</MenuItem>
                    <MenuItem value="United States">United States</MenuItem>,
                    {countryMenuItems}
                </Select>

<br></br>

                <InputLabel variant="standard" htmlFor="country1">
                    Select Country #2
                </InputLabel>
                <Select id="country2"
                    sx={{
                        width: 200, height: 50, border: 1, borderColor: '#7E7E7E',
                    }} onChange=
                    {(event) => { setCountry2(event.target.value) }} value={country2} >
                    <MenuItem disabled>Choose a country ...</MenuItem>
                    <MenuItem value="United States">United States</MenuItem>,
                    {countryMenuItems}
                </Select>

                <br></br>

                <InputLabel variant="standard" htmlFor="country1">
                    Select Year
                </InputLabel>
                <Select id="year"
                    sx={{
                        width: 200, height: 50, border: 1, borderColor: '#7E7E7E',
                    }} onChange=
                    {(event) => { setYear(event.target.value) }} value={year} >
                    <MenuItem disabled>Choose a year ...</MenuItem>
                    {yearMenuItems}
                </Select>

            </Grid>
            
            <br></br>
            <br></br>

            <Button onClick={() => searchWages()} style={{ left: '10%', transform: 'translateX(-90%)', variant:"contained", color:"primary" }}>
                Search
            </Button>

            <br></br>
            <br></br>

            <div style={{ border: 1, backgroundColor: '#D9D9D9' }}>
                <DataGrid
                    rows={data}
                    columns={columnsWages}
                    getRowId={(row) => row.Country + row.Year + row.Month}
                    pageSize={pageSize}
                    rowsPerPageOptions={[5, 10, 25]}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    autoHeight
                /></div>

        </div>
        </Container>
    );
}


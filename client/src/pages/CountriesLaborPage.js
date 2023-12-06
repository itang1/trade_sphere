import React, {useState } from 'react';
import { Button, Container, Grid, Slider } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

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
        { field: 'Country', headerName: 'Country', width: 250 },
        { field: 'Year', headerName: 'Year', width: 250 },
        { field: 'Month', headerName: 'Month', width: 300 },
        { field: 'HighestUnemploymentRate', headerName: 'Highest Unemployment Rate', width: 400 },
    ];

    return (
        <div style={{ backgroundColor: '#F8F7F1', padding: '10px' }}>
        <Container>
            <h1>Highest Unemployment Rate by Country</h1>
            <p style={{ marginTop: '10px', fontStyle: 'italic' }}>
            Dive into the revealing world of global unemployment rates, where numbers tell stories of socio-economic landscapes and pivotal events shaping nations. Discovering countries with the highest unemployment rates opens a window into complex issues like political unrest, economic downturns, or transformative industrial shifts. This knowledge not only illuminates the challenges faced by these countries but also offers a deeper understanding of global economic interconnections. By exploring these unemployment statistics, you become a witness to the evolving narratives of nations and the resilience of their people in the face of adversity.
                    
            </p>
            <hr></hr>
            <br></br>
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
            <p style={{ marginTop: '10px', fontStyle: 'italic' }}>
            The peak year and month can shed light on significant real-world events, offering insights into underlying factors and circumstances.
            <br></br>
            South Africa Coverage(2021): <a href="https://www.reuters.com/world/africa/south-africas-unemployment-rate-hits-new-record-high-q4-2021-2022-03-29/" target="_blank" rel="noopener noreferrer">
                https://www.reuters.com/world/africa/south-africas-unemployment-rate-hits-new-record-high-q4-2021-2022-03-29/
            </a>


                    
                </p>
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

        </Container></div>
    );
}
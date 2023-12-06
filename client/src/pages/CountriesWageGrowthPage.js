import { Button, Container, Grid, Slider } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import React, { useState } from 'react';

const config = require('../config.json');

export default function CountriesWageGrowthPage() {
    const [pageSize, setPageSize] = useState(5);
    const [data, setData] = useState([]);

    const [avgYearlyIncrease_perc, setAvgYearlyIncrease_perc] = useState([-5, 1200]);

    const search = () => {
        fetch(`http://${config.server_host}:${config.server_port}/country/wage_growth?growth_low=${avgYearlyIncrease_perc[0]}&growth_high=${avgYearlyIncrease_perc[1]}`)
            .then(res => res.json())
            .then(resJson => {
                const countriesWithId = resJson.map((country) => ({ id: country.Country, ...country }));
                setData(countriesWithId);
            });
    };


    const columns = [
        { field: 'Country', headerName: 'Country', width: 600 },
        { field: 'AvgYearlyIncrease_perc', headerName: '% Yearly Wage Increase', width: 800},
    ];

    return (
        <div style={{ backgroundColor: '#F8F7F1', padding: '10px' }}>
        <Container>
            <h1>Average Yearly Wage Increase 2006-2022</h1>
            {/* Description about the data */}
            <p style={{ marginTop: '10px', fontStyle: 'italic' }}>
            Discover the dynamic landscape of global wage growth and unlock a wealth of opportunities. Delve into the intricacies of different countries' economies through their wage trends, providing a unique lens to gauge economic health and job market vitality. This knowledge not only guides astute investment decisions and business strategies but also opens doors to promising career paths and enlightens policy understanding. Stay ahead in the fast-paced world of economics by keeping a pulse on the ever-evolving patterns of wage growth across the globe.


                    
            </p>
            <hr></hr>
            <br></br>
            <Grid container spacing={15}>
                <Grid item xs={15}>
                    <p>Average Percent Yearly Increase</p>
                    <Slider
                        value={avgYearlyIncrease_perc}
                        min={-5}
                        max={1200}
                        step={5}
                        onChange={(_, newValue) => setAvgYearlyIncrease_perc(newValue)}
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
            {/* Comment about the data */}
            <p style={{ marginTop: '10px', fontStyle: 'italic' }}>
            Note: Financial instability, including inflation and other economic crises, can be a factor in significant wage increases.\
            <br></br>
            Argentina Inflation: <a href="https://www.inflationtool.com/rates/argentina/historical" target="_blank" rel="noopener noreferrer">
            https://www.inflationtool.com/rates/argentina/historical
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
            <br></br>
            <br></br>

        </Container></div>
    );
}
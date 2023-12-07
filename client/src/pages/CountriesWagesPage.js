import React, { useEffect, useState } from 'react';
import { Button, Container, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';



const config = require('../config.json');


export default function CountriesWagesPage() {

    const [pageSize, setPageSize] = useState(10);
    const [country1, setCountry1] = useState('')
    const [country2, setCountry2] = useState('')
    const [year, setYear] = useState('')
    const [data, setData] = useState([])
    const [possibleCountries, setPossibleCountries] = useState([])
    const [possibleYears, setPossibleYears] = useState([])
    const [timeSeriesData, setTimeSeriesData] = useState([]);
    


    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/distcountries2`)
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

    const createTimeSeriesData = (data, country1, country2) => {
        // Create a unique set of year-month strings from the data
        let uniqueYearMonths = new Set(data.map(d => `${d.Year}-${String(d.Month).padStart(2, '0')}`));
        uniqueYearMonths = Array.from(uniqueYearMonths).sort();
      
        // Create a map for quick access to the data
        const dataMap = new Map(data.map(item => [`${item.Year}-${String(item.Month).padStart(2, '0')}-${item.Country}`, item.TotalWage]));
      
        // Initialize the time series data array
        const timeSeriesData = uniqueYearMonths.map(yearMonth => {
          const yearMonthCountry1 = `${yearMonth}-${country1}`;
          const yearMonthCountry2 = `${yearMonth}-${country2}`;
          return {
            yearMonth: yearMonth,
            [country1]: dataMap.get(yearMonthCountry1) || 'No Data', // Replace null with 0 or carry forward the last known value
            [country2]: dataMap.get(yearMonthCountry2) || 'No Data', // Replace null with 0 or carry forward the last known value
          };
        });
      
        // Carry forward the last known value if the current value is 0 and there was a previous known value
        let lastValueCountry1 = null;
        let lastValueCountry2 = null;
        for (const entry of timeSeriesData) {
          if (entry[country1] !== 0) {
            lastValueCountry1 = entry[country1];
          } else if (lastValueCountry1 !== null) {
            entry[country1] = lastValueCountry1;
          }
      
          if (entry[country2] !== 0) {
            lastValueCountry2 = entry[country2];
          } else if (lastValueCountry2 !== null) {
            entry[country2] = lastValueCountry2;
          }
        }
      
        return timeSeriesData;
      };
      
      
      const searchWages = () => {
        fetch(`http://${config.server_host}:${config.server_port}/country/wages?country1=${country1}&country2=${country2}`)
          .then(res => res.json())
          .then(combinedData => {
            // Set the DataGrid data
            setData(combinedData);
        
            // Prepare the time series data for the LineChart
            const timeSeries = createTimeSeriesData(combinedData, country1, country2);
        
            // Set the time series data for the LineChart
            setTimeSeriesData(timeSeries);
          })
          .catch(error => console.error('Failed to fetch wage data:', error));
      };
      
      
    // useEffect(() => {
    //     fetch(`http://${config.server_host}:${config.server_port}/country/wage_growth`)
    //         .then(res => res.json())
    //         .then(resJson => setData(resJson))
    //         .catch(error => console.error(error));
    // }, []);



    const columnsWages = [
        { field: 'Country', headerName: 'Country', width: 300 },
        { field: 'Year', headerName: 'Year', width: 300 },
        { field: 'Month', headerName: 'Month', width: 300 },
        // Update the field to match the key provided by the server for wage values
        { field: 'TotalWage', headerName: 'Wage (USD/ Year)', width: 700 },
    ];
    const countryMenuItems = possibleCountries.map(item => (
        <MenuItem value={item.Country}>{item.Country}</MenuItem>
    ));

    // const yearMenuItems = possibleYears.map(item => (
    //     <MenuItem value={item.Year}>{item.Year}</MenuItem>
    // ));


    return (
        <div style={{ backgroundColor: '#F8F7F1', padding: '10px' }}>
        <Container><div style={{ padding: "10px" }} >
            <h1>Wages</h1>


            
                <p style={{ marginTop: '10px', fontStyle: 'italic' }}>Unlock the fascinating world of wage comparison between two countries over time, a journey that not only reveals differences in pay scales but also mirrors the domestic economic environments within these nations. This exploration provides insights into how economic policies, market trends, and cultural factors influence wage structures. Witness how shifts in the global economy, technological advancements, and political changes impact earnings in different regions. Delving into this comparative analysis offers a deeper understanding of the interconnectedness of global economies and the unique challenges and opportunities each country faces.
                </p>
            


<hr></hr>
<br></br>

            <div >
                <h2>Comparison of Wages</h2>
            </div>

            <Grid item xs={2} >
                <InputLabel variant="standard" htmlFor="types">
                    Select Country #1
                </InputLabel>
                <Select  id="country1"
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

                {/* <InputLabel variant="standard" htmlFor="country1">
                    Select Year
                </InputLabel> */}
                {/* <Select id="year"
                    sx={{
                        width: 200, height: 50, border: 1, borderColor: '#7E7E7E',
                    }} onChange=
                    {(event) => { setYear(event.target.value) }} value={year} >
                    <MenuItem disabled>Choose a year ...</MenuItem>
                    {yearMenuItems}
                </Select> */}

            </Grid>
            
            

            <Button onClick={() => searchWages()} style={{ marginTop: '20px', left: '12%', transform: 'translateX(-90%)', backgroundColor: '#3C6E71', color: 'white'}} 
      variant="contained" >
                Search
            </Button>
            
            <br></br>
            <br></br>
            <div style={{ height: '300px', marginTop: '20px' }}>
  <h2>Wage Comparison Over Time ({country1} vs. {country2}) </h2>
  <ResponsiveContainer width="100%" height="100%">
  <LineChart data={timeSeriesData} margin={{ top: 5, right: 5, bottom: 5, left:20 }}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="yearMonth" angle={-10} />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey={country1} stroke="#8884d8"  activeDot={{ r: 8 }}/>
    <Line type="monotone" dataKey={country2} stroke="#82ca9d" />
    <Brush dataKey="yearMonth" height={30} stroke="green" />
  </LineChart>
</ResponsiveContainer>
{/* Comment about the data */}
</div>
<br></br>
            <br></br>
            <br></br>
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
                /></div>
        </div>
        </Container></div>
    );
}


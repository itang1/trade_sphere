import React, { useEffect, useState } from 'react';
import {  Container, MenuItem , Grid} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts'
//import { LineChart } from '@mui/x-charts/LineChart';



const config = require('../config.json');

export default function TradingPage() {

    const [author, setAuthor] = useState('')

    const [expor, setExpor] = useState([])
    const [labour, setLabour] = useState([])
    const [pageSize, setPageSize] = useState(10);
    const [data, setData] = useState([])
    const [water,setWater] = useState([])

      
    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/author/name`)
          .then(res => res.text())
          .then(resText => setAuthor(resText));

        fetch(`http://${config.server_host}:${config.server_port}/trading_export`)
          .then(data=> data.json())
          .then((data) => {setExpor(data) ;
          })
        
        .catch(error => console.error(error));
       }, []);   
       console.log(expor)  


      useEffect(() => {

        fetch(`http://${config.server_host}:${config.server_port}/labour`)
          .then(data=> data.json())
          .then((data) => {setLabour(data) ;
          })
        
        .catch(error => console.error(error));
       }, []);   
       console.log(labour)  

       useEffect(() => {
       fetch(`http://${config.server_host}:${config.server_port}/country/populationwater`)
          .then(response=> response.json())
          .then((data) => {setWater(data) ;
          })
        
        .catch(error => console.error(error));
       }, []);   
       console.log(labour) 
  
      useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/distcountries`)
          .then(res => res.json())
          .then(resJson => setData(resJson))
          .catch(error => console.error(error));
      }, []);

      const menuItems = data.map(item => (
        <MenuItem value={item.Country2}>{item.Country2}</MenuItem>
      ));

    const traidEColumns = [
    {
      field: 'Category',
      headerName: 'Category',
      flex:1
    },
    {
      field: 'TotalExportValue',
      headerName: 'Total Export Value ',
      flex:1
    }
  ];

  const labourColumns = [
    {
      field: 'HighestUnemploymentRate',
      headerName: 'HighestUnemploymentRate',
      flex:1
    },
    {
      field: 'Year',
      headerName: 'Year',
      flex:1
    }
  ];

return (
  <div style={{ backgroundColor: '#F8F7F1', padding: '10px' }}>
    <Container>
    <h1>Trading Economics Web Application</h1>
        <hr></hr>
        <br></br>
    <h2>Purpose and Usage</h2>
      <p>This web application provides an interactive platform for visualizing statistics pertaining to
        the United States' trading patterns and 
        additional characteristics, such as demographics and social-economic indicators, on its trading partners.
        Users can explore detailed analytical findings on trade-related and country-specific indicators on the 
        Trades and Countries pages respectively.
        They can interactively customize their data exploration by selecting countries,
        specific time intervals, and the type of exchanged goods by using our
        user-friendly tools (including sliders, drop-down menus, and pagination).
        <br></br>
        <br></br>
        We anticipate that our web application appeals to researchers and business
        owners who are interested in import and export strategies, market selection,
        and supply chain optimization.</p>
        <br></br>
        <hr></hr>
        <br></br>
      
      <h2>Data Introduction and Preview </h2>
      <p>The data used in this application stems from a SQL database which contains United States' trading information from 
        2005 to 2022 and country specific information. More information on the data sources used for the database can be found here
      <a href="https://tradingeconomics.com"> Trading Data</a> and here <a href="https://ourworldindata.org/hunger-and-undernourishment"> Country Data. </a> 
       Due to the vast number of trading information only some aspects were chosen to be showcased on this website, such as the total number
       of exports conducted by the United States, as can be seen in this table, and the continents with the highest proportion of 
       unimproved drinking water.  
      </p>
      <br></br>
      <Grid item xs={2} > 
      <h3>Unimproved Drinking Water by Continent</h3>
      <BarChart width={850} height={350} data={water}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Continent" />
          <YAxis />
          <Tooltip />
          <Legend  />
          <Bar dataKey="MaxUnimprovedWater" fill="#3C6E71" />
        </BarChart>
        <br></br>
              <h3>US Total Export by Trade Category</h3>
      <DataGrid
          rows={expor}
          columns={traidEColumns}
          pageSize={pageSize}
          getRowId={(data) => data.Category}
          rowsPerPageOptions={[5, 10, 25]}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          autoHeight
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              csvOptions: { disableToolbarButton: false},
              printOptions: { disableToolbarButton: true },
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 250 },
            },}}
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
          
      /> </Grid>
      
      <p>{author}</p>
 
    </Container></div>
);

}


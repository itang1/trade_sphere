import { useEffect, useState } from 'react';
import { Button, Checkbox, Container, InputLabel, Select, ListItemText , MenuItem, OutlinedInput, FormControlLabel, FormLabel, FormGroup, FormControl, Grid, Link, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import * as L from "leaflet";

import { formatDuration } from '../helpers/formatter';

const config = require('../config.json');


export default function TradingPage() {

    const [pageSize, setPageSize] = useState(10);
    const [volume, setVolume] = useState([]);
    const [traid, setTraiD] = useState([]);
    const [traip, setTraiP] = useState([]);
    const [traipc, setTraiPC] = useState([]);

    const [type, setType] = useState({
        Export: true,
        Import: false,
      });
    const { Export, Import } = type;

    const categories = [ 'Rubbers', 'Aluminum', 'Cereals', 'Plastics'];
    const countries = [ 'Brazil', 'Peru', 'Argentina', 'Germany'];
    
    useEffect(() => {
      fetch(`http://${config.server_host}:${config.server_port}/trading_volume`)
        .then(res => res.json())
        .then(resJson => setVolume(resJson))
        .catch(error => console.error(error));
        
    }, []);
  
    const searchVol = () => {
      fetch(`http://${config.server_host}:${config.server_port}/trading_volume?Type=${type}`
      )
        .then(res => res.json())
        .then(resJson => setVolume(resJson))
        .catch(error => console.error(error));
    }

    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/trading_data`)
          .then(res => res.json())
          .then(resJson => setTraiD(resJson))
          .catch(error => console.error(error));
          
      }, []);
    
    const searchTraiD = () => {
        fetch(`http://${config.server_host}:${config.server_port}/trading_data?Type=${type}` +
        `&Category=${categories}`)
          .then(res => res.json())
          .then(resJson => setTraiD(resJson))
          .catch(error => console.error(error));
      }

    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/trading_partner_catg`)
          .then(res => res.json())
          .then(resJson => setTraiP(resJson))
          .catch(error => console.error(error));
          
      }, []);
    
      const searchTraiP = () => {
        fetch(`http://${config.server_host}:${config.server_port}/trading_partner_catg?Type=${type}` +
        `&Country2=${countries}`)
          .then(res => res.json())
          .then(resJson => setTraiP(resJson))
          .catch(error => console.error(error));
      }

      useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/trading_partner`)
          .then(res => res.json())
          .then(resJson => setTraiPC(resJson))
          .catch(error => console.error(error));
          
      }, []);
    
      const searchTraiPC = () => {
        fetch(`http://${config.server_host}:${config.server_port}/trading_partner?Type=${type}` +
        `&Category=${categories}`)
          .then(res => res.json())
          .then(resJson => setTraiPC(resJson))
          .catch(error => console.error(error));
      }
  
    const columnsVol = [
      { field: 'continent', headerName: 'Continent'},
      { field: 'volume', headerName: 'Volume' },
    ]

    const columnsTraiD = [
        { field: 'country1', headerName: 'country1'},
        { field: 'country2', headerName: 'country2'},
        { field: 'type', headerName: 'Type' },
        { field: 'year', headerName: 'year'},
        { field: 'category', headerName: 'Category'},
        { field: 'value', headerName: 'Value'},
      ]

    const columnsTraiP = [
        { field: 'category', headerName: 'Category'},
        { field: 'value', headerName: 'Value' },
      ]

    const handleChange = (event) => {
          const {
            target: { value },
          } = event;
          setTraiD(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
          );
        };
   
        //dropdown for map
        {/*var html = [$('<option>', {val: 0, text: 'Select a state'})],
        dropdown = $('#regions-dropdown');
        $.each(map_cfg.map_data, function(i, obj) {
        html.push($('<option>', {id:'st'+obj.id, val:'st'+obj.id, text: obj.name}))});

        var selected_region = 0;

        map.on('click', function(ev, sid, map) {
        var option = $('#' + sid);
        if (selected_region != 0) map.stateHighlightOff(selected_region);
        if(selected_region == sid) {
        dropdown.find('option').first().prop('selected', true);
        selected_region = 0;
        } else {
        option.prop('selected', true);
        map.stateHighlightOn(sid, '#3CB371', '#ffffff');
        selected_region = sid;
        }
        });

        dropdown.on('change', function(ev){
        if (selected_region != 0) map.stateHighlightOff(selected_region);
        var id = $(this).val();
        if (id == 0) return false;
        map.stateHighlightOn(id, '#3CB371', '#ffffff');
        selected_region = id;
        });

        dropdown.html(html);

        */}
return (  
      <Container>
        <h2>Largest US trading partner in a specific category </h2>
        <MapContainer center={[54, 15]} zoom={5.5}scrollWheelZoom={false } style={{ height: '50vh', width: '50wh' } } id="map"
        > 
        {/*<link
        rel="stylesheet"
        href= "https://unpkg.com/leaflet@1.6.0/dist/leaflet.css" 
        integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
crossorigin=""/> */}
        {/*<script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js" 
        integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew=="
crossorigin=""></script>*/}
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css" 
        integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ==" crossorigin="" />
        
        <script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js" 
        integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew==" crossorigin=""></script>
        
        <TileLayer
        attribution= '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />

       {/* const map = L.map('map');

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { attribution= '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' 
        }).addTo(map); */}
        {/*<TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
/>*/}
        </MapContainer>
        <h2>Total trading volume by continent</h2>
        <Grid container spacing={2}>
           {/*<<Grid item xs={2}>
            {/*<TextField label='Continent' value={type} onChange={(e) => setVolume(e.target.value)} style={{ width: "100%" }}/> 
          </Grid>*/}
          <Grid item xs={4}>
          <FormLabel component="legend">Choose Type</FormLabel>
          <FormGroup>
            <FormControlLabel
              label='Export'
              control={<Checkbox checked={Export} onChange={(e) => setType(e.target.checked)} name="Export" />}
            />
                <FormControlLabel
              label='Import'
              control={<Checkbox checked={Import} onChange={(e) => setType(e.target.checked)} name="Import" />}
            />
          </FormGroup>
          </Grid>
          </Grid>
          <Button onClick={() => searchVol() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
          Search
          </Button>
          <h2>Results</h2>
          <DataGrid
          rows={volume}
          columns={columnsVol}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 10, 25]}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          autoHeight
        />
         <h4>Interpretation of results</h4>
         <h2>All country trading data with the United States </h2>
         <Grid item xs={2}>
         <FormControl sx={{ m: 1, width: 300 }}>
         <InputLabel id="demo-multiple-checkbox-label">Category</InputLabel>
         <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={traid}
          onChange={handleChange}
          input={<OutlinedInput label="Choose Category" />}
          renderValue={(traind) => traid.join(', ')}
         >
          {categories.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={categories.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))} 
         </Select>
         </FormControl>
          <FormLabel component="legend">Choose Type</FormLabel>
          <FormGroup>
            <FormControlLabel
              label='Export'
              control={<Checkbox checked={Export} onChange={(e) => setType(e.target.checked)} name="Export" />}
            />
            <FormControlLabel
              label='Import'
              control={<Checkbox checked={Import} onChange={(e) => setType(e.target.checked)} name="Import" />}
            />
          </FormGroup>
          </Grid>
          <Button onClick={() => searchTraiD() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
          Search
          </Button>
          <h2>Results</h2>
          <DataGrid
          rows={traid}
          columns={columnsTraiD}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 10, 25]}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          autoHeight
        />
        <h4>Interpretation of results</h4>
        <h2>Largest trading category with the US </h2>
         <Grid item xs={2}>
         <FormControl sx={{ m: 1, width: 300 }}>
         <InputLabel id="demo-multiple-checkbox-label">Category</InputLabel>
         <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={traip}
          onChange={handleChange}
          input={<OutlinedInput label="Choose Category" />}
          renderValue={(traip) => traip.join(', ')}
         >
          {categories.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={categories.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))} 
         </Select>
         </FormControl>
         <FormControl sx={{ m: 1, width: 300 }}>
         <InputLabel id="demo-multiple-checkbox-label">Country</InputLabel>
         <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={traip}
          onChange={handleChange}
          input={<OutlinedInput label="Choose Country" />}
          renderValue={(traip) => traip.join(', ')}
         >
          {countries.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={countries.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))} 
         </Select>
          </FormControl>
          </Grid>
          <Button onClick={() => searchTraiP() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
          Search
          </Button>
          <h2>Results</h2>
          <DataGrid
          rows={traip}
          columns={columnsTraiP}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 10, 25]}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          autoHeight
        />
        <h4>Interpretation of results</h4>
      </Container>
    );
}

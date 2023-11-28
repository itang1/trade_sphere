import { useEffect, useState } from 'react';
import { Button, Container, InputLabel, Select,   MenuItem, Grid} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { MapContainer, TileLayer, Marker} from 'react-leaflet';
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";

var markers = [
    {
      name: 'Canada',
      position: [56.130366, -106.346771],
    },
   {
      name: 'France',
      position: [ 46.227638,2.213749]
    },
   {
      name: 'Taiwan',
      position: [23.69781,120.960515]
    },
    {
      name: 'Japan',
     position: [ 36.204824,138.252924]
    },
    {
      name: 'Argentina',
      position: [-38.416096, -63.616673]
    },
  ]

const customMarkerIcon = L.icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
  });

//import { formatDuration } from '../helpers/formatter';

const config = require('../config.json');


export default function TradingPage() {

    const [pageSize, setPageSize] = useState(10);
    const [volume, setVolume] = useState([]);
    const [traidd, setTraidD] = useState([]);
    const [traidp, setTraidP] = useState([]);
    const [traidpc, setTraidPC] = useState([]);

    const [countries2, setCountries2] = useState('');
    const [type, setType] = useState('')
    const [categories, setCategories] = useState('')

    const [data,setData] = useState([])


    useEffect(() => {
      fetch(`http://${config.server_host}:${config.server_port}/trading_volume`)
        .then(res => res.json())
        .then(vol => setVolume(vol))
        .catch(error => console.error(error))

    }, []);
    console.log(volume)

    const searchVol = () => {
      fetch(`http://${config.server_host}:${config.server_port}/trading_volume?type=${type}`
      )
        .then(res => res.json())
        .then(vol => setVolume(vol))
        .catch(error => console.error(error))
    }
    console.log(volume)

   useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/trading_data`)
          .then(res => res.json())
          .then(resJson => setTraidD(resJson))
          .catch(error => console.error(error));

      }, []);
      console.log(traidd)

    const searchTraidD = () => {
        fetch(`http://${config.server_host}:${config.server_port}/trading_data?type=${type}` +
        `&category=${categories}`)
          .then(res => res.json())
          .then(resJson => setTraidD(resJson))
          .catch(error => console.error(error));
      }
      console.log(traidd)

    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/trading_partner_catg`)
          .then(res => res.json())
          .then(resJson => setTraidP(resJson))
          .catch(error => console.error(error));

      }, []);
      console.log(traidp)

      const searchTraidP = () => {
        fetch(`http://${config.server_host}:${config.server_port}/trading_partner_catg?type=${type}` +
        `&country2=${countries2}`)
          .then(res => res.json())
          .then(resJson => setTraidP(resJson))
          .catch(error => console.error(error))

      }
      console.log(traidp)


     useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/trading_partner`)
         .then(res => res.json())
         .then(resJson => setTraidPC(resJson))
         .catch(error => console.error(error));

     }, []);
     console.log(traidpc)

    const searchTraidPC = () => {
        fetch(`http://${config.server_host}:${config.server_port}/trading_partner?type=${type}` +
        `&category=${categories}`)
          .then(res => res.json())
          .then(resJson => setTraidPC(resJson))
         .catch(error => console.error(error));
        }
        console.log(traidpc)
        console.log(data)

    const columnsVol = [
      { field: 'CountryName', headerName: 'Country', flex:1},
      { field: 'Continent', headerName: 'Continent', flex:1},
      { field: 'TotalExportValue', headerName: 'Volume', flex:1 }
    ]

    const columnsTraiD = [
        { field: 'Country1', headerName: 'Country1', flex:1},
        { field: 'Country2', headerName: 'Country2', flex:1},
        { field: 'Type', headerName: 'Type', flex:1 },
        { field: 'Year', headerName: 'Year', flex:1},
        { field: 'Category', headerName: 'Category', flex:1},
        { field: 'Value', headerName: 'Value' , flex:1},
      ]

    const columnsTraiP = [
        { field: 'Category', headerName: 'Category', flex:1} ,
        { field: 'Value', headerName: 'Value', flex:1 },
      ]

      const columnsTraidPC = [
        { field: 'Country2', headerName: 'Country2', flex:1} ,
        { field: 'Value', headerName: 'Value', flex:1 },
      ]
                function NewMarker () {
                  //const [position, setPosition] = useState(null)
                      if(traidpc.Country2 === markers.name) {
                          console.log('match')
                          console.log(markers[0].position);
                        return (
                          <Marker position = {markers[0].position} icon={customMarkerIcon} title = {markers[0].name}>

                          </Marker>
                        )}

                        else {return (<Marker position = {[54, 15]} icon={customMarkerIcon}>

                          </Marker>
                        )}

                        }

        const pos2 = [-37.699450, 176.279420]

return (
      <Container>
        <h2>Largest US trading partner in a specificoi7 category </h2>

        <Grid item xs={2} >
       <InputLabel variant="standard" htmlFor="types">
        Select a Trade Type
       </InputLabel>
        <Select id = "types"
        sx={{
        width: 200,
        height: 50,}}
        label= "Type" onChange =
        {(event) => {setType(event.target.value)}} value = {type} >
        <MenuItem disabled>Choose a Type ...</MenuItem>
        <MenuItem value="Export">Export</MenuItem>
        <MenuItem value="Import">Import</MenuItem>
        <MenuItem value="Re-Export">Re-Export</MenuItem>
        </Select></Grid>

        <Grid item xs={2}>
        <InputLabel variant="standard" htmlFor="categories">
        Select a Category
       </InputLabel>
        <Select id = "categories"
        sx={{width: 200,height: 50,
      }} onChange =
        {(event) => {setCategories(event.target.value)}} value = {categories} >
        <MenuItem disabled>Choose a Category ...</MenuItem>
        <MenuItem value="Crude Oil">Crude Oil</MenuItem>
        <MenuItem value="Electrical Energy">Electrical Energy</MenuItem>
        <MenuItem value="Rail Locomotives">Rail Locomotives</MenuItem>
        <MenuItem value="Mineral fuels, oils, distillation products">Mineral fuels, oils, distillation products</MenuItem>
        </Select>
          </Grid>

        <Button onClick={() => searchTraidPC() } style={{ left: '10%', transform: 'translateX(-90%)' }}>
          Search
        </Button>

        <DataGrid
          rows={traidpc}
          columns={columnsTraidPC}
          pageSize={pageSize}
          getRowId={(pc) => pc.Country2}
          rowsPerPageOptions={[5, 10, 25]}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          autoHeight
        />

        <MapContainer center={[54, 15]} zoom={5.5}scrollWheelZoom={false } style={{ height: '50vh', width: '50wh' } } id="map"
        >
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
        integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ==" crossOrigin="" />

        <script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
        integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew==" crossOrigin=""></script>

        <TileLayer
        attribution= '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
      <NewMarker/>

          {/*<Marker position= {pos2} icon={customMarkerIcon}>
      <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
    </Marker>*/}
        </MapContainer>
        <h2>Total trading volume by continent</h2>
        <Grid container spacing={2}>

        <Grid item xs={2} >
       <InputLabel variant="standard" htmlFor="types">
        Select a Trade Type
       </InputLabel>
        <Select id = "types"
        sx={{
        width: 200,
        height: 50,}}
        label= "Type" onChange =
        {(event) => {setType(event.target.value)}} value = {type} >
        <MenuItem disabled>Choose a Type ...</MenuItem>
        <MenuItem value="Export">Export</MenuItem>
        <MenuItem value="Import">Import</MenuItem>
        <MenuItem value="Re-Export">Re-Export</MenuItem>
        </Select></Grid>

          </Grid>

        <Button onClick={() => searchVol() } style={{ left: '10%', transform: 'translateX(-90%)' }}>
          Search
          </Button>
          <h2>Results</h2>
          <DataGrid
          rows={volume}
          columns={columnsVol}
          pageSize={pageSize}
          getRowId={(vol) => vol.CountryName}
          rowsPerPageOptions={[5, 10, 25]}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          autoHeight
        />
         <h4>Interpretation of results</h4>
         <h2>All country trading data with the United States </h2>

        <Grid item xs={2} >
       <InputLabel variant="standard" htmlFor="types">
        Select a Trade Type
       </InputLabel>
        <Select id = "types"
        sx={{
        width: 200,
        height: 50,}}
        label= "Type" onChange =
        {(event) => {setType(event.target.value)}} value = {type} >
        <MenuItem disabled>Choose a Type ...</MenuItem>
        <MenuItem value="Export">Export</MenuItem>
        <MenuItem value="Import">Import</MenuItem>
        <MenuItem value="Re-Export">Re-Export</MenuItem>
        </Select></Grid>

        <Grid item xs={2}>
        <InputLabel variant="standard" htmlFor="categories">
        Select a Category
       </InputLabel>
        <Select id = "categories"
        sx={{width: 200,height: 50,
      }} onChange =
        {(event) => {setCategories(event.target.value)}} value = {categories} >
        <MenuItem disabled>Choose a Category ...</MenuItem>
        <MenuItem value="Crude Oil">Crude Oil</MenuItem>
        <MenuItem value="Electrical Energy">Electrical Energy</MenuItem>
        <MenuItem value="Rail Locomotives">Rail Locomotives</MenuItem>
        </Select>
          </Grid>


          <Button onClick={() => searchTraidD() } style={{ left: '10%', transform: 'translateX(-90%)' }}>
          Search
          </Button>
          <h2>Results</h2>
          <DataGrid
          rows={traidd}
          columns={columnsTraiD}
          getRowId={(vol) => vol.Symbol}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 10, 25]}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          autoHeight
        />

        <h4>Interpretation of results</h4>
        <h2>Largest trading category with the US </h2>

        <Grid item xs={2} >
       <InputLabel variant="standard" htmlFor="types">
        Select a Trade Type
       </InputLabel>
        <Select id = "types"
        sx={{
        width: 200,
        height: 50,}}
        label= "Type" onChange =
        {(event) => {setType(event.target.value)}} value = {type} >
        <MenuItem disabled>Choose a Type ...</MenuItem>
        <MenuItem value="Export">Export</MenuItem>
        <MenuItem value="Import">Import</MenuItem>
        <MenuItem value="Re-Export">Re-Export</MenuItem>
        </Select></Grid>

        <Grid item xs={2}>
        <InputLabel variant="standard" htmlFor="countries">
        Select a Country
       </InputLabel>
        <Select id = "countries" placeholder="Country"
        sx={{width: 200,height: 50,
      }} onChange =
        {(event) => {setCountries2(event.target.value)}} value = {countries2} >
        <MenuItem disabled>Choose a Country ...</MenuItem>
        <MenuItem value="Argentina">Argentina</MenuItem>
        <MenuItem value="Brazil">Brazil</MenuItem>
        <MenuItem value="Canada">Canada</MenuItem>
        </Select>
          </Grid>

          <Button onClick={() => searchTraidP() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
          Search
          </Button>
          <h2>Results</h2>

          <DataGrid
          rows={traidp}
          columns={columnsTraiP}
          getRowId={(vol) => vol.Category}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 10, 25]}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          autoHeight
        />
        <h4>Interpretation of results</h4>


      </Container>
    );
}


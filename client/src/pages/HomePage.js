import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';

import LazyTable from '../components/LazyTable';
const config = require('../config.json');

export default function HomePage() {
  // We use the setState hook to persist information across renders (such as the result of our API calls)
  const [countryOfTheDay, setCountryOfTheDay] = useState({});
  const [author, setAuthor] = useState('');
  const [selectedCountryId, setSelectedCountryId] = useState(null);
  const [expor, setExpor] = useState([])
  const [pageSize, setPageSize] = useState(5);

  // The useEffect hook by default runs the provided callback after every render
  // The second (optional) argument, [], is the dependency array which signals
  // to the hook to only run the provided callback if the value of the dependency array
  // changes from the previous render. In this case, an empty array means the callback
  // will only run on the very first render.
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/random`)
      .then(res => res.json())
      .then(resJson => setCountryOfTheDay(resJson));

    fetch(`http://${config.server_host}:${config.server_port}/trading_export`)
      .then(res => res.json())
      .then(resJson => {
        const expoID = resJson.map((expo) => ({ cat: expo.Category, val: expo.TotalExportValue }));
        setExpor(expoID)
      })
      .catch(error => console.error(error));

    fetch(`http://${config.server_host}:${config.server_port}/author/name`)
      .then(res => res.text())
      .then(restText => setAuthor(restText));

  }, []);


  const countryColumns = [
    {
      field: 'country',
      headerName: 'Country',
      renderCell: (row) => <Link onClick={() => setSelectedCountryId(row.Continent)}>{row.Continent}</Link> // A Link component is used just for formatting purposes
    },
    {
      field: 'continent',
      headerName: 'Continent',
      renderCell: (row) => <NavLink to={`/albums/${row.Continent}`}>{row.Continent}</NavLink> // A NavLink component is used to create a link to the album page
    },
    {
      field: 'population',
      headerName: 'Population',
      renderCell: (row) => <NavLink to={`/albums/${row.Continent}`}>{row.Continent}</NavLink> // A NavLink component is used to create a link to the album page
    },
    {
      field: 'trade_count',
      headerName: 'Trade Count'
    },
  ];


  const commodityColumns = [
    {
      field: 'commodity',
      headerName: 'Commodity',
      renderCell: (row) => <NavLink to={`/trades/${row.Continent}`}>{row.Continent}</NavLink> // A NavLink component is used to create a link to the album page
    },
    {
      field: 'plays',
      headerName: 'Trade Count'
    },
  ]


  const tradeColumns = [
    {
      field: 'Category',
      headerName: 'Category',
    },
    {
      field: 'TotalExportValue',
      headerName: 'Total Export Value '
    },
  ];

  return (
    <Container>
      <h1>PURPOSE</h1>
      <p>This web application provides an interactive platform for visualizing statistics pertaining to
        the United States' domestic trading patterns of the United States. It also displays
        additional characteristics, such as population size, on its trading partners.
        <br></br>
        <br></br>
        Users can explore detailed analytical findings in detail tin the Countries and Trades pages.
        They can interactively customize their data exploration by selecting countries,
        specific time intervals, and the type of exchanged goods by using our
        user-friendly tools (including sliders, drop-down menus, and pagination).
        <br></br>
        <br></br>
        We anticipate that our web application appeals to researchers and business
        owners who are interested in import and export strategies, market selection,
        and supply chain optimization.</p>

      <br></br>
      <br></br>
      <br></br>


      <h1>US TRADING EXPORT</h1>

<h3>PAGE SIZING IS BROKEN BELOW -- NEED TO FIX</h3>

      <h2>All Exports Information</h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/trading_export`}
        columns={tradeColumns}
        defaultPageSize={5}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />

      {/* <br></br>
      <br></br>
      <br></br>


      <h2>Most Active Countries</h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/author/name/`} columns={countryColumns} />
      <Divider />

      <br></br>
      <br></br>
      <br></br>

      <h2>Most Traded Commodities</h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/author/name/`} columns={commodityColumns} />
      <Divider />

      <br></br>
      <br></br>
      <br></br> */}

      <br></br>
      <br></br>
      <br></br>

      <p>{author}</p>
    </Container>
  );
};

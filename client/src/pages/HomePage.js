import React, { useEffect, useState } from 'react';
import LazyTable from '../components/LazyTable';
import {Container} from '@mui/material';


const config = require('../config.json');

export default function HomePage() {
  const [author, setAuthor] = useState('');

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/author/name`)
      .then(res => res.text())
      .then(restText => setAuthor(restText));

  }, []);



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
      <h1>PURPOSE OF WEBSITE AND DATABSE </h1>
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

      <h1>US TRADING EXPORT</h1>

      <p>The table below displays all of the material categories that the United States
        exports, along with their total dollar value in USD.
      </p>

      <h2>All Exports Information</h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/trading_export`}
        columns={tradeColumns}
        defaultPageSize={10}
        rowsPerPageOptions={[10, 25, 50, 100]}
      />

      <br></br>
      <br></br>
      <br></br>

      <p>{author}</p>
    </Container>
  );
};

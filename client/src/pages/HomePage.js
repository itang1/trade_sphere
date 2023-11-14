import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';

import LazyTable from '../components/LazyTable';
import CountryCard from '../components/CountryCard';
const config = require('../config.json');

export default function HomePage() {
  // We use the setState hook to persist information across renders (such as the result of our API calls)
  const [countryOfTheDay, setCountryOfTheDay] = useState({});
  const [author, setAuthor] = useState('');
  const [selectedCountryId, setSelectedCountryId] = useState(null);

  // The useEffect hook by default runs the provided callback after every render
  // The second (optional) argument, [], is the dependency array which signals
  // to the hook to only run the provided callback if the value of the dependency array
  // changes from the previous render. In this case, an empty array means the callback
  // will only run on the very first render.
  useEffect(() => {
    // Fetch request to get the song of the day. Fetch runs asynchronously.
    // The .then() method is called when the fetch request is complete
    // and proceeds to convert the result to a JSON which is finally placed in state.
    fetch(`http://${config.server_host}:${config.server_port}/random`)
      .then(res => res.json())
      .then(resJson => setCountryOfTheDay(resJson));

    // TODO (TASK 14): add a fetch call to get the app author (name not pennkey) and store it in the state variable
    // Hint: note that the app author is a string, not a JSON object. To convert to text, call res.text() instead of res.json()
    fetch(`http://${config.server_host}:${config.server_port}/author/name`)
      .then(res => res.text())
      .then(restText => setAuthor(restText));

  }, []);

  // Here, we define the columns of the "Top Songs" table. The countryColumns variable is an array (in order)
  // of objects with each object representing a column. Each object has a "field" property representing
  // what data field to display from the raw data, "headerName" property representing the column label,
  // and an optional renderCell property which given a row returns a custom JSX element to display in the cell.
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

  // TODO (TASK 15): define the columns for the top albums (schema is Album Title, Plays), where Album Title is a link to the album page
  // Hint: this should be very similar to countryColumns defined above, but has 2 columns instead of 3
  // Hint: recall the schema for an album is different from that of a song (see the API docs for /top_albums). How does that impact the "field" parameter and the "renderCell" function for the album title column?
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

  return (
    <Container>
      {/* Embed Neo4j Browser */}
      <iframe title="Neo4j Browser" width="100%" height="600" src="https://your-neo4j-instance.cloud.neo4j.com/browser/" frameBorder="0"></iframe>

      {/* CountryCard is a custom component that we made. selectedCountryId && <CountryCard .../> makes use of short-circuit logic to only render the CountryCard if a non-null song is selected */}
      {selectedCountryId && <CountryCard songId={selectedCountryId} handleClose={() => setSelectedCountryId(null)} />}
      {/* <h2>Check out your country of the day:&nbsp;
        <Link onClick={() => setSelectedCountryId(countryOfTheDay.song_id)}>{countryOfTheDay.title}</Link>
      </h2>
      <Divider /> */}
      <h2>Most Active Countries</h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/author/name/`} columns={countryColumns} />
      <Divider />
      {/* TODO (TASK 16): add a h2 heading, LazyTable, and divider for top albums. Set the LazyTable's props for defaultPageSize to 5 and rowsPerPageOptions to [5, 10] */}
      <h2>Most Traded Commodities</h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/author/name/`} columns={commodityColumns} />
      <Divider />
      {/* TODO (TASK 17): add a paragraph (<p>text</p>) that displays the value of your author state variable from TASK 13 */}
      <p>{author}</p>
    </Container>
  );
};
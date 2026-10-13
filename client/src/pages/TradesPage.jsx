import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import { getJson } from '../api';
import Page, { Section } from '../components/Page';
import DataTable from '../components/DataTable';
import { Filters, Picker, TRADE_TYPES } from '../components/Controls';

// Bundlers rewrite image paths, so Leaflet can't find its default marker icons on its own
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, iconRetinaUrl: markerIcon2x, shadowUrl: markerShadow });

function FitToMarkers({ partners }) {
  const map = useMap();
  useEffect(() => {
    if (partners.length > 0) {
      map.fitBounds(partners.map(p => [p.Latitude, p.Longitude]), { padding: [40, 40], maxZoom: 4 });
    }
  }, [map, partners]);
  return null;
}

const partnerColumns = [
  { field: 'Country2', headerName: 'Country', flex: 1 },
  { field: 'Year', headerName: 'Year', flex: 1 },
  { field: 'Value', headerName: 'Volume', flex: 1, valueFormatter: ({ value }) => value?.toLocaleString() },
];

const volumeColumns = [
  { field: 'Continent', headerName: 'Continent', flex: 1 },
  { field: 'TotalExportValue', headerName: 'Volume', flex: 1 },
];

const topCategoryColumns = [
  { field: 'Category', headerName: 'Category', flex: 1 },
  { field: 'Value2', headerName: 'Volume', flex: 1 },
];

export default function TradesPage() {
  const [countries, setCountries] = useState([]);
  const [categories, setCategories] = useState([]);

  const [topPartners, setTopPartners] = useState([]);
  const [topPartnersType, setTopPartnersType] = useState('');
  const [topPartnersCategory, setTopPartnersCategory] = useState('');

  const [partners, setPartners] = useState([]);
  const [partnersType, setPartnersType] = useState('');
  const [partnersCategory, setPartnersCategory] = useState('');

  const [volume, setVolume] = useState([]);
  const [volumeType, setVolumeType] = useState('');

  const [topCategory, setTopCategory] = useState([]);
  const [topCategoryType, setTopCategoryType] = useState('');
  const [topCategoryCountry, setTopCategoryCountry] = useState('');

  useEffect(() => {
    getJson('/distcountries').then(rows => setCountries(rows.map(row => row.Country2))).catch(console.error);
    getJson('/distcategories').then(rows => setCategories(rows.map(row => row.Category))).catch(console.error);
  }, []);

  const searchTopPartners = () =>
    getJson('/trading_partner', { type: topPartnersType, category: topPartnersCategory }).then(setTopPartners).catch(console.error);
  const searchPartners = () =>
    getJson('/trading_data', { type: partnersType, category: partnersCategory }).then(setPartners).catch(console.error);
  const searchVolume = () =>
    getJson('/trading_volume', { type: volumeType }).then(setVolume).catch(console.error);
  const searchTopCategory = () =>
    getJson('/trading_partner_catg', { type: topCategoryType, country2: topCategoryCountry }).then(setTopCategory).catch(console.error);

  return (
    <Page
      title='International Trade'
      intro={
        <>
          <p>International trade has been prominent throughout history. However, with social, political, and economic changes, such as increasing globalization, international trade has grown immensely both in value and diversity within the last century. The number and types of goods, as well as the pairings of trading partners convey a complex picture of the global economy and inform decision-making by global powers, such as the United States. Therefore, mapping those relationships and collecting trade information is of utmost importance to understand the state of the global economy and gain educated insights.</p>
          <p>This page provides an overview of trading-related data, including the influence of different trading categories and types on trading patterns between the United States and other countries. The below displayed data should be viewed as an example of exploratory analysis that can be conducted with the data but it only displays a small selection of available variables.</p>
        </>
      }
    >
      <Typography variant='h2' gutterBottom>Trading by Trade Category</Typography>
      <Typography color='text.secondary' sx={{ mb: 3 }}>
        Trading category is the most diverse part of trading data as it describes what goods were exchanged between the trading partners. The data reports on over 1000 categories that range from food, agriculture, clothing to raw materials, tools and more.
      </Typography>

      <Section
        title='Top 5 Largest Trading Partners with the United States'
        description="Experience a customized view of global trade on our interactive map. As you select your trade type and product category, the map dynamically updates to showcase the United States' five largest trading partners in this sector. This tailored visualization brings to life the vibrant trade networks and volumes based on your specific interests, offering a unique perspective on international commerce."
      >
        <Filters onSearch={searchTopPartners}>
          <Picker label='Trade type' value={topPartnersType} onChange={setTopPartnersType} options={TRADE_TYPES} />
          <Picker label='Category' value={topPartnersCategory} onChange={setTopPartnersCategory} options={categories} />
        </Filters>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <MapContainer center={[30, 0]} zoom={2} scrollWheelZoom={false} style={{ height: 380, borderRadius: 10 }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              />
              <FitToMarkers partners={topPartners} />
              {topPartners.map(partner => (
                <Marker key={partner.Country2} position={[partner.Latitude, partner.Longitude]}>
                  <Popup><strong>{partner.Country2}</strong><br />Value: {partner.Value}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </Grid>
          <Grid item xs={12} md={4}>
            {topPartners.length > 0 ? (
              <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 2 }}>
                {topPartners.map(partner => (
                  <li key={partner.Country2}><strong>{partner.Country2}</strong>: {partner.Value}</li>
                ))}
              </ol>
            ) : (
              <Typography color='text.secondary'>Pick a trade type and category to see the top partners.</Typography>
            )}
          </Grid>
        </Grid>
      </Section>

      <Section title='All Trading Partners with the United States'>
        <Filters onSearch={searchPartners}>
          <Picker label='Trade type' value={partnersType} onChange={setPartnersType} options={TRADE_TYPES} />
          <Picker label='Category' value={partnersCategory} onChange={setPartnersCategory} options={categories} />
        </Filters>
        <DataTable rows={partners} columns={partnerColumns} getRowId={row => row.Symbol} />
      </Section>

      <Typography variant='h2' gutterBottom sx={{ mt: 6 }}>Regional Trading Differences</Typography>
      <Typography color='text.secondary' sx={{ mb: 3 }}>
        The two below displayed tables showcase the changes of total trade volume by the trade type for the different continents and the largest trading category a country has with the United States. The data reports on close to 200 different trading partners with the United States.
      </Typography>

      <Section title='Total Trading Volume by Continent'>
        <Filters onSearch={searchVolume}>
          <Picker label='Trade type' value={volumeType} onChange={setVolumeType} options={TRADE_TYPES} />
        </Filters>
        <DataTable rows={volume} columns={volumeColumns} getRowId={row => row.Continent} />
      </Section>

      <Section title='Largest Trade Category for United States Trade Partners'>
        <Filters onSearch={searchTopCategory}>
          <Picker label='Trade type' value={topCategoryType} onChange={setTopCategoryType} options={TRADE_TYPES} />
          <Picker label='Country' value={topCategoryCountry} onChange={setTopCategoryCountry} options={countries} />
        </Filters>
        <DataTable rows={topCategory} columns={topCategoryColumns} getRowId={row => row.Category} />
      </Section>
    </Page>
  );
}

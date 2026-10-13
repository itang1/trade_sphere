import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import { getJson } from '../api';
import Page, { Insight, Section } from '../components/Page';
import DataTable from '../components/DataTable';
import { Filters, Picker, TRADE_TYPES } from '../components/Controls';
import { dollars, tradeWords } from '../format';

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
  { field: 'Value', headerName: 'Value (US$)', flex: 1, valueFormatter: ({ value }) => value?.toLocaleString() },
];

const volumeColumns = [
  { field: 'Continent', headerName: 'Continent', flex: 1 },
  { field: 'TotalExportValue', headerName: 'Total value (US$)', flex: 1 },
];

const topCategoryColumns = [
  { field: 'Category', headerName: 'Category', flex: 1 },
  { field: 'Value2', headerName: 'Value (US$)', flex: 1 },
];

const DEFAULT_CATEGORY = 'Aircraft, spacecraft';

// Runs a search with the current filters and keeps those filters with the results,
// so takeaways describe what was searched rather than what is selected now
function useSearch(route, params) {
  const [result, setResult] = useState({ rows: [], params });
  const search = () => getJson(route, params).then(rows => setResult({ rows, params })).catch(console.error);
  return [result, search];
}

const numberOf = value => Number(String(value).replaceAll(',', ''));

export default function TradesPage() {
  const [countries, setCountries] = useState([]);
  const [categories, setCategories] = useState([]);

  const [topPartnersType, setTopPartnersType] = useState('Export');
  const [topPartnersCategory, setTopPartnersCategory] = useState(DEFAULT_CATEGORY);
  const [topPartners, searchTopPartners] = useSearch('/trading_partner', { type: topPartnersType, category: topPartnersCategory });

  const [partnersType, setPartnersType] = useState('Export');
  const [partnersCategory, setPartnersCategory] = useState(DEFAULT_CATEGORY);
  const [partners, searchPartners] = useSearch('/trading_data', { type: partnersType, category: partnersCategory });

  const [volumeType, setVolumeType] = useState('Import');
  const [volume, searchVolume] = useSearch('/trading_volume', { type: volumeType });

  const [topCategoryType, setTopCategoryType] = useState('Export');
  const [topCategoryCountry, setTopCategoryCountry] = useState('Canada');
  const [topCategory, searchTopCategory] = useSearch('/trading_partner_catg', { type: topCategoryType, country2: topCategoryCountry });

  useEffect(() => {
    getJson('/distcountries').then(rows => setCountries(rows.map(row => row.Country2))).catch(console.error);
    getJson('/distcategories').then(rows => setCategories(rows.map(row => row.Category).filter(Boolean))).catch(console.error);
    searchTopPartners();
    searchPartners();
    searchVolume();
    searchTopCategory();
  }, []);

  const partnerRows = partners.rows.filter(row => row.Country2 !== 'World');
  const largestPartner = partnerRows.reduce((best, row) => (!best || row.Value > best.Value ? row : best), null);
  const volumeTotal = volume.rows.reduce((sum, row) => sum + numberOf(row.TotalExportValue), 0);
  const topContinent = volume.rows[0];
  const [topCategoryRow] = topCategory.rows;

  return (
    <Page
      title='International Trade'
      intro={
        <>
          <p>Where US exports go and where US imports come from. Every section starts with an example; change the filters and press Search to explore.</p>
          <p>
            <strong>How to read the values:</strong> each value is the US dollar value of the goods traded, for the most recent year reported for that
            product and country, which is usually 2022. Trade types are <strong>exports</strong> (US goods sold abroad), <strong>imports</strong> (goods the US buys)
            and <strong>re-exports</strong> (foreign goods the US imports and sells on).
          </p>
        </>
      }
    >
      <Typography variant='h2' gutterBottom>Trading by Trade Category</Typography>
      <Typography color='text.secondary' sx={{ mb: 3 }}>
        Trading category is the most diverse part of trading data, as it describes what goods were exchanged between the trading partners. The data reports on over 1,000 categories that range from food, agriculture and clothing to raw materials, tools and more.
      </Typography>

      <Section
        title='Top 5 Largest Trading Partners with the United States'
        query={['/trading_partner', { type: topPartnersType, category: topPartnersCategory }]}
        description='The five countries that trade the most of one product with the United States, pinned on the map.'
      >
        <Filters onSearch={searchTopPartners}>
          <Picker label='Trade type' value={topPartnersType} onChange={setTopPartnersType} options={TRADE_TYPES} />
          <Picker label='Category' value={topPartnersCategory} onChange={setTopPartnersCategory} options={categories} />
        </Filters>
        {topPartners.rows.length > 0 && (
          <Insight>
            {topPartners.rows[0].Country2} is the largest {tradeWords(topPartners.params.type).role} of US {tradeWords(topPartners.params.type).noun} in “{topPartners.params.category}”: {dollars(topPartners.rows[0].Value)}.
          </Insight>
        )}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <MapContainer center={[30, 0]} zoom={2} scrollWheelZoom={false} style={{ height: 380, borderRadius: 10 }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              />
              <FitToMarkers partners={topPartners.rows} />
              {topPartners.rows.map(partner => (
                <Marker key={partner.Country2} position={[partner.Latitude, partner.Longitude]}>
                  <Popup><strong>{partner.Country2}</strong><br />{dollars(partner.Value)}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </Grid>
          <Grid item xs={12} md={4}>
            {topPartners.rows.length > 0 ? (
              <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 2 }}>
                {topPartners.rows.map(partner => (
                  <li key={partner.Country2}><strong>{partner.Country2}</strong>: {dollars(partner.Value)}</li>
                ))}
              </ol>
            ) : (
              <Typography color='text.secondary'>No partners found for this trade type and category.</Typography>
            )}
          </Grid>
        </Grid>
      </Section>

      <Section
        title='All Trading Partners with the United States'
        description='Every country that trades the chosen product with the United States, largest first. The World row is the total the source reports for all countries.'
        query={['/trading_data', { type: partnersType, category: partnersCategory }]}
      >
        <Filters onSearch={searchPartners}>
          <Picker label='Trade type' value={partnersType} onChange={setPartnersType} options={TRADE_TYPES} />
          <Picker label='Category' value={partnersCategory} onChange={setPartnersCategory} options={categories} />
        </Filters>
        {largestPartner && (
          <Insight>
            {partnerRows.length} countries appear for US {tradeWords(partners.params.type).noun} in “{partners.params.category}”. The largest is {largestPartner.Country2}, at {dollars(largestPartner.Value)}.
          </Insight>
        )}
        <DataTable rows={partners.rows} columns={partnerColumns} getRowId={row => row.Symbol} sortBy='Value' />
      </Section>

      <Typography variant='h2' gutterBottom sx={{ mt: 6 }}>Regional Trading Differences</Typography>
      <Typography color='text.secondary' sx={{ mb: 3 }}>
        The two tables below show the total trade value with each continent for a trade type, and the largest trading category a country has with the United States. The data covers close to 200 trading partners of the United States.
      </Typography>

      <Section
        title='Total Trade Value by Continent'
        description='The total value of US trade with each continent for the chosen trade type, adding up whole product groups so that no product is counted twice.'
        query={['/trading_volume', { type: volumeType }]}
      >
        <Filters onSearch={searchVolume}>
          <Picker label='Trade type' value={volumeType} onChange={setVolumeType} options={TRADE_TYPES} />
        </Filters>
        {topContinent && (
          <Insight>
            {topContinent.Continent} accounts for {Math.round(100 * numberOf(topContinent.TotalExportValue) / volumeTotal)}% of the US {tradeWords(volume.params.type).noun} in this dataset: {dollars(topContinent.TotalExportValue)}.
          </Insight>
        )}
        <DataTable rows={volume.rows} columns={volumeColumns} getRowId={row => row.Continent} />
      </Section>

      <Section
        title='Largest Trade Category for United States Trade Partners'
        description='The single product group the United States trades most with the chosen country.'
        query={['/trading_partner_catg', { type: topCategoryType, country2: topCategoryCountry }]}
      >
        <Filters onSearch={searchTopCategory}>
          <Picker label='Trade type' value={topCategoryType} onChange={setTopCategoryType} options={TRADE_TYPES} />
          <Picker label='Country' value={topCategoryCountry} onChange={setTopCategoryCountry} options={countries} />
        </Filters>
        {topCategoryRow && (
          <Insight>
            “{topCategoryRow.Category}” is the largest category of US {tradeWords(topCategory.params.type).noun} {tradeWords(topCategory.params.type).preposition} {topCategory.params.country2}: {dollars(topCategoryRow.Value2)}.
          </Insight>
        )}
        <DataTable rows={topCategory.rows} columns={topCategoryColumns} getRowId={row => row.Category} />
      </Section>
    </Page>
  );
}

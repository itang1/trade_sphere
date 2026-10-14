import React from 'react';
import { Tab, Tabs } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

import Page from '../components/Page';
import CountriesLivingConditionsPage from './CountriesLivingConditionsPage';
import CountriesTemperaturePage from './CountriesTemperaturePage';
import CountriesLaborPage from './CountriesLaborPage';
import CountriesWagesPage from './CountriesWagesPage';
import CountriesWageGrowthPage from './CountriesWageGrowthPage';

export const COUNTRY_TABS = [
  { to: '/countries-living-conditions', label: 'Living Conditions', panel: <CountriesLivingConditionsPage /> },
  { to: '/countries-temperature', label: 'Temperature', panel: <CountriesTemperaturePage /> },
  { to: '/countries-labor', label: 'Unemployment', panel: <CountriesLaborPage /> },
  { to: '/countries-wages', label: 'Wages', panel: <><CountriesWagesPage /><CountriesWageGrowthPage /></> },
];

// The old Wage Growth page now lives under the Wages tab
const ALIASES = { '/countries-wage-growth': '/countries-wages' };

export default function CountriesPage() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const current = ALIASES[pathname] ?? pathname;
  const tab = COUNTRY_TABS.find(t => t.to === current) ?? COUNTRY_TABS[0];

  return (
    <Page
      title='Country Profiles'
      intro={<p>How people live and work in the countries the US trades with: living conditions, climate, jobs, and wages.</p>}
    >
      <Tabs value={tab.to} onChange={(e, to) => navigate(to)} variant='scrollable' sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
        {COUNTRY_TABS.map(t => <Tab key={t.to} value={t.to} label={t.label} sx={{ textTransform: 'none', fontWeight: 600 }} />)}
      </Tabs>
      {tab.panel}
    </Page>
  );
}

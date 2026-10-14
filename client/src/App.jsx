import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import React from 'react';

import { theme } from './theme';
import NavBar from './components/NavBar';
import DatabaseStatus from './components/DatabaseStatus';
import HomePage from './pages/HomePage';
import TradesPage from './pages/TradesPage'
import AboutPage from "./pages/AboutPage";
import CountriesPage from "./pages/CountriesPage";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <NavBar />
        <DatabaseStatus />
        <Routes>
          <Route path="/" element={<HomePage />} />
          {['/countries-living-conditions', '/countries-temperature', '/countries-labor', '/countries-wages', '/countries-wage-growth'].map(path => (
            <Route key={path} path={path} element={<CountriesPage />} />
          ))}
          <Route path="/trades" element={<TradesPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

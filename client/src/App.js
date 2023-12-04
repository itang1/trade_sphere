import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { indigo, amber } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";
import React from 'react';


import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import CountriesLivingConditionsPage from './pages/CountriesLivingConditionsPage'
import TradesPage from './pages/TradesPage'
import CountriesTemperaturePage from "./pages/CountriesTemperaturePage";
import CountriesWagesPage from "./pages/CountriesWagesPage";
import CountriesWageGrowthPage from "./pages/CountriesWageGrowthPage";

// createTheme enables you to customize the look and feel of your app past the default
// in this case, we only change the color scheme
export const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: amber,
  },
});

// App is the root component of our application and as children contain all our pages
// We use React Router's BrowserRouter and Routes components to define the pages for
// our application, with each Route component representing a page and the common
// NavBar component allowing us to navigate between pages (with hyperlinks)
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/countries-living-conditions" element={<CountriesLivingConditionsPage />} />
          <Route path="/countries-temperature" element={<CountriesTemperaturePage />} />
          <Route path="/countries-wages" element={<CountriesWagesPage />} />
          <Route path="/countries-wage-growth" element={<CountriesWageGrowthPage />} />
          <Route path="/trades" element={<TradesPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

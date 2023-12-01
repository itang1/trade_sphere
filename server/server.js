const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
app.get('/author/:type', routes.author);
app.get('/trading_data', routes.trading_data);
app.get('/trading_partner', routes.trading_partner);
app.get('/trading_partner_catg', routes.trading_partner_catg);
app.get('/trading_volume', routes.trading_volume);
app.get('/trading_export', routes.trading_export);
app.get('/country/population', routes.population);
app.get('/country/populationwater', routes.populationwater);
app.get('/country/wages', routes.wages);
app.get('/country/wage_growth', routes.wage_growth);
app.get('/home/labour', routes.labour);
app.get('/country/temperature', routes.temperature);
app.get('/distcountries', routes.distcountries);
app.get('/distcategories', routes.distcategories);



app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;


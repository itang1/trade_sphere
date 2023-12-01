const mysql = require('mysql')
const config = require('./config.json')

const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

// Route 1: GET /author/:type
const author = async function (req, res) {
  const name = 'Lisa Garcia, Zung-Ru Lin, Hanling Su, Irene Tang';
  if (req.params.type === 'name') {
    res.send(`Created by ${name}`);
  }
  else {
    res.status(400).send(`'${req.params.type}' is not a valid author type.`);
  }
}

// Route 2: GET /trading/trading_data
const trading_data = async function(req, res) {
    const type = req.query.type ?? ''; 
    const category = req.query.category ?? ''; 
    connection.query(`SELECT Symbol, Country1, Country2, Type, Year, Category, FORMAT(Value,'NO') AS Value FROM USTradingData 
    WHERE Type = '${type}' AND Category = '${category}'`, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  }

// Route 3: GET /trading/trading_partner
const trading_partner = async function(req, res) {
    const type = req.query.type ?? ''; 
    const category = req.query.category ?? ''; 
    connection.query(`SELECT U.Country2, FORMAT(U.Value, 'NO') AS Value, C.Latitude, C.Longitude FROM USTradingData U 
    JOIN CountryInfo C ON C.CountryName = U.Country2 WHERE Type = '${type}' 
    AND U.Category = '${category}' AND U.Country2 != "World" AND C.Latitude IS NOT NULL AND C.Longitude  IS NOT NULL
    ORDER BY U.Value DESC LIMIT 5`, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  }

// Route 4: GET /trading/trading_partner_catg
const trading_partner_catg = async function(req, res) {
    const type = req.query.type ?? ''; 
    const country2 = req.query.country2 ?? ''; 
    connection.query(`SELECT Category, FORMAT(Value, 'NO') AS Value FROM USTradingData WHERE Country2 = '${country2}' AND Type = '${type}' AND Category IS NOT NULL
    ORDER BY Value DESC LIMIT 1`, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  }

// Route 5: GET /trading/trading_volume
const trading_volume = async function(req, res) {
    const type = req.query.type ?? ''; 
    connection.query(`SELECT C.Continent, FORMAT(sum(U.Value),'N0') AS TotalExportValue 
    FROM USTradingData U JOIN CountryInfo C ON C.CountryName = U.Country2
    WHERE Type = '${type}' AND C.Continent IS NOT NULL 
    GROUP BY C.Continent ORDER BY TotalExportValue DESC`, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json([]);
      } else {
        res.json(data);
      }
    });
  }

  // Route 6: GET /home/trading_export
const trading_export = async function(req, res) {
    const page = req.param.page;
    const page_size = req.param.page_size ?? 10;
    const offset = (page-1)*page_size;
  
    if (!page) {
      connection.query(`SELECT Category, FORMAT(SUM(Value),'NO') AS TotalExportValue 
      FROM USTradingData WHERE Type = 'Export' AND Category is not null
      GROUP BY Category ORDER BY TotalExportValue DESC`,
      (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
          console.log(err);
        } else {
        res.json(data); 
        }
      }); 
    } else {
      connection.query(`SELECT Category, FORMAT(SUM(Value),'NO') AS TotalExportValue 
      FROM USTradingData WHERE Type = 'Export' AND Category is not null
      GROUP BY Category ORDER BY TotalExportValue DESC 
      LIMIT ${page_size} OFFSET ${offset}`,
      (err, data) => {
        if (err || data.length === 0) {
        console.log(err);
        res.json([]);
        console.log(err);
        } else {
        res.json(data);
        }
    });
  }
  }

// Route 7: GET /country/population
const population = async function (req, res) {
  const page = req.param.page;
  const page_size = req.param.page_size ?? 10;
  const offset = (page - 1) * page_size;

  const urban_low = req.query.urban_low ?? 0
  const urban_high = req.query.urban_high ?? 100
  const drinking_water_low = req.query.drinking_water_low ?? 0
  const drinking_water_high = req.query.drinking_water_high ?? 100
  const sanitation_low = req.query.sanitation_low ?? 0
  const sanitation_high = req.query.sanitation_high ?? 100
  const infant_low = req.query.infant_low ?? 0
  const infant_high = req.query.infant_high ?? 100

  if (!page) {
    connection.query(`
        WITH PopulationCTE AS (
          SELECT Country,
            Region,
            Urban_Population/Population*100 AS UrbanProportion,
            Improved_Drinking_Water_Access As DrinkingWaterProportion,
            Improved_Sanitation_Access AS SanitationProportion,
            Population_under_1yo/Population*100 AS InfantProportion,
            Population AS TotalPopulation
          FROM CountryDemographics
        )
        SELECT *
        FROM PopulationCTE
        WHERE UrbanProportion > ${urban_low}
            AND UrbanProportion < ${urban_high}
            AND DrinkingWaterProportion > ${drinking_water_low}
            AND DrinkingWaterProportion < ${drinking_water_high}
            AND SanitationProportion > ${sanitation_low}
            AND SanitationProportion < ${sanitation_high}
            AND InfantProportion > ${infant_low}
            AND InfantProportion < ${infant_high}
        `,
      (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
          console.log(err);
        } else {
          res.json(data);
        }
      });
  } else {
    connection.query(`
        WITH PopulationCTE AS (
          SELECT Country,
            Region,
            Urban_Population/Population*100 AS UrbanProportion,
            Improved_Drinking_Water_Access As DrinkingWaterProportion,
            Improved_Sanitation_Access AS SanitationProportion,
            Population_under_1yo/Population*100 AS InfantProportion,
            Population AS TotalPopulation
          FROM CountryDemographics
        )
        SELECT *
        FROM PopulationCTE
        WHERE UrbanProportion > ${urban_low}
            AND UrbanProportion < ${urban_high}
            AND DrinkingWaterProportion > ${drinking_water_low}
            AND DrinkingWaterProportion < ${drinking_water_high}
            AND SanitationProportion > ${sanitation_low}
            AND SanitationProportion < ${sanitation_high}
            AND InfantProportion > ${infant_low}
            AND InfantProportion < ${infant_high}
        LIMIT ${page_size} OFFSET ${offset}`,
      (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
          console.log(err);
        } else {
          res.json(data);
        }
      });
  }
}

// Route 8: GET /country/populationwater
const populationwater = async function (req, res) {
  const page = req.param.page;
  const page_size = req.param.page_size ?? 10;
  const offset = (page - 1) * page_size;

  if (!page) {
    connection.query(`With MaxUM AS (SELECT C.Continent, MAX(H.Unimproved_Drinking_Water_Access) AS MaxUnimprovedWater
    FROM CountryDemographics H JOIN CountryInfo C on H.Country = C.CountryName where C.Continent IS NOT NULL
    GROUP BY C.Continent) SELECT  C.Continent, H.Country, MUM.MaxUnimprovedWater
    FROM CountryDemographics H JOIN CountryInfo C on H.Country = C.CountryName JOIN MaxUM MUM on C.Continent = MUM.Continent AND H.Unimproved_Drinking_Water_Access = MUM.MaxUnimprovedWater`,
      (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
          console.log(err);
        } else {
          res.json(data);
        }
      });
  } else {
    connection.query(`With MaxUM AS (SELECT C.Continent, MAX(H.Unimproved_Drinking_Water_Access) AS MaxUnimprovedWater
      FROM CountryDemographics H JOIN CountryInfo C on H.Country = C.CountryName where C.Continent IS NOT NULL
      GROUP BY C.Continent) SELECT  C.Continent, H.Country, MUM.MaxUnimprovedWater
      FROM CountryDemographics H JOIN CountryInfo C on H.Country = C.CountryName JOIN MaxUM MUM on C.Continent = MUM.Continent AND H.Unimproved_Drinking_Water_Access = MUM.MaxUnimprovedWater
      LIMIT ${page_size} OFFSET ${offset}`,
      (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
          console.log(err);
        } else {
          res.json(data);
        }
      });
  }
}

// Route 9: GET /country/wages
const wages = async function (req, res) {
  const country1 = req.query.country1 ?? 'United States';
  const country2 = req.query.country2 ?? 'Mexico';
  connection.query(`
    WITH WageTable AS (
      SELECT B.Country, B.Year, B.Month, B.Value*U.ConversionRate, I.Unit, U.UnitGroup, U.ExchangeRate, U.FrequencyRate, U.ConversionRate
      FROM Labour B
        JOIN IndexTable I ON B.Category = I.Category AND B.Country = I.Country
        JOIN UnitConversion U ON I.Unit = U.Unit
      WHERE B.Category = 'Wages'
    )
    SELECT * FROM WageTable
    WHERE Country = '${country1}' OR Country = '${country2}'
    ORDER BY Year, Month ASC`,
    (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route 10: GET /country/wage_growth
const wage_growth = async function (req, res) {
  const page = req.param.page;
  const page_size = req.param.page_size ?? 10;
  const offset = (page - 1) * page_size;

  if (!page) {
    connection.query(`WITH WageTable AS (
    SELECT B.Country, B.Year, B.Month, B.Value*U.ConversionRate AS ConvertedValue, I.Unit, U.UnitGroup, U.ExchangeRate, U.FrequencyRate, U.ConversionRate
    FROM Labour B
    JOIN IndexTable I ON B.Category = I.Category AND B.Country = I.Country
    JOIN UnitConversion U ON I.Unit = U.Unit
    WHERE B.Category = 'Wages'
    ), FirstYear AS (
       SELECT Country, MIN(Year) as FirstYear
       FROM WageTable
       GROUP BY Country
    ), LastYear AS (
       SELECT Country, MAX(Year) as LastYear
       FROM WageTable
       GROUP BY Country
    ), FirstValue AS (
       SELECT wt.Country, wt.ConvertedValue as FirstValue
       FROM WageTable wt
       INNER JOIN FirstYear fy ON wt.Country = fy.Country AND wt.Year = fy.FirstYear
       WHERE Month = (SELECT MIN(Month) FROM WageTable WHERE Country = wt.Country AND Year = wt.Year)
    ), LastValue AS (
       SELECT wt.Country, wt.ConvertedValue as LastValue
       FROM WageTable wt
       INNER JOIN LastYear ly ON wt.Country = ly.Country AND wt.Year = ly.LastYear
       WHERE Month = (SELECT MAX(Month) FROM WageTable WHERE Country = wt.Country AND Year = wt.Year)
    ), ProportionalIncrease AS (
       SELECT
           fv.Country,
           (lv.LastValue - fv.FirstValue) / fv.FirstValue as PropIncrease,
           ly.LastYear - fy.FirstYear as YearDifference
       FROM FirstValue fv
       INNER JOIN LastValue lv ON fv.Country = lv.Country
       INNER JOIN FirstYear fy ON fv.Country = fy.Country
       INNER JOIN LastYear ly ON fv.Country = ly.Country
    )
    SELECT
       Country,
       CASE WHEN YearDifference = 0 THEN NULL ELSE PropIncrease / YearDifference*100 END AS AvgYearlyIncrease_perc
    FROM ProportionalIncrease
    ORDER BY AvgYearlyIncrease_perc DESC`,
      (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
          console.log(err);
        } else {
          res.json(data);
        }
      });
  } else {
    connection.query(`WITH WageTable AS (
      SELECT B.Country, B.Year, B.Month, B.Value*U.ConversionRate AS ConvertedValue, I.Unit, U.UnitGroup, U.ExchangeRate, U.FrequencyRate, U.ConversionRate
      FROM Labour B
      JOIN IndexTable I ON B.Category = I.Category AND B.Country = I.Country
      JOIN UnitConversion U ON I.Unit = U.Unit
      WHERE B.Category = 'Wages'
      ), FirstYear AS (
         SELECT Country, MIN(Year) as FirstYear
         FROM WageTable
         GROUP BY Country
      ), LastYear AS (
         SELECT Country, MAX(Year) as LastYear
         FROM WageTable
         GROUP BY Country
      ), FirstValue AS (
         SELECT wt.Country, wt.ConvertedValue as FirstValue
         FROM WageTable wt
         INNER JOIN FirstYear fy ON wt.Country = fy.Country AND wt.Year = fy.FirstYear
         WHERE Month = (SELECT MIN(Month) FROM WageTable WHERE Country = wt.Country AND Year = wt.Year)
      ), LastValue AS (
         SELECT wt.Country, wt.ConvertedValue as LastValue
         FROM WageTable wt
         INNER JOIN LastYear ly ON wt.Country = ly.Country AND wt.Year = ly.LastYear
         WHERE Month = (SELECT MAX(Month) FROM WageTable WHERE Country = wt.Country AND Year = wt.Year)
      ), ProportionalIncrease AS (
         SELECT
             fv.Country,
             (lv.LastValue - fv.FirstValue) / fv.FirstValue as PropIncrease,
             ly.LastYear - fy.FirstYear as YearDifference
         FROM FirstValue fv
         INNER JOIN LastValue lv ON fv.Country = lv.Country
         INNER JOIN FirstYear fy ON fv.Country = fy.Country
         INNER JOIN LastYear ly ON fv.Country = ly.Country
      )
      SELECT
         Country,
         CASE WHEN YearDifference = 0 THEN NULL ELSE PropIncrease / YearDifference*100 END AS AvgYearlyIncrease_perc
      FROM ProportionalIncrease
      ORDER BY AvgYearlyIncrease_perc DESC
        LIMIT ${page_size} OFFSET ${offset}`,
      (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
          console.log(err);
        } else {
          res.json(data);
        }
      });
  }
}

// Route 11: GET /home/labour
const labour = async function (req, res) {
  const page = req.param.page;
  const page_size = req.param.page_size ?? 10;
  const offset = (page - 1) * page_size;

  if (!page) {
    connection.query(`WITH RankedLabour AS (SELECT Country,Year,Month,Value, RANK() OVER (PARTITION BY Country ORDER BY Value DESC) AS ValueRank
    FROM Labour WHERE Category = 'Unemployment Rate')
    SELECT Country, Year, Month, Value AS HighestUnemploymentRate FROM RankedLabour WHERE ValueRank = 1 ORDER BY HighestUnemploymentRate DESC, Country, Year, Month`,
      (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
          console.log(err);
        } else {
          res.json(data);
        }
      });
  } else {
    connection.query(`WITH RankedLabour AS (SELECT Country,Year,Month,Value, RANK() OVER (PARTITION BY Country ORDER BY Value DESC) AS ValueRank
    FROM Labour WHERE Category = 'Unemployment Rate')
    SELECT Country, Year, Month, Value AS HighestUnemploymentRate FROM RankedLabour WHERE ValueRank = 1 ORDER BY HighestUnemploymentRate DESC, Country, Year, Month
        LIMIT ${page_size} OFFSET ${offset}`,
      (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
          console.log(err);
        } else {
          res.json(data);
        }
      });
  }
}

// Route 12: GET /country/temperature
const temperature = async function (req, res) {
  const page = req.param.page;
  const page_size = req.param.page_size ?? 10;
  const offset = (page - 1) * page_size;

  const delta_low = req.query.delta_low ?? -999999
  const delta_high = req.query.delta_high ?? 999999

  if (!page) {
    connection.query(`
    WITH FirstLastYears AS (
      SELECT Country, MIN(Year) as FirstYear, MAX(Year) as LastYear
      FROM Climate
      WHERE Category = 'Temperature' GROUP BY Country
    ),
    FirstYearValue AS (
      SELECT c.Country, c.Year as Year, c.Value as FirstYearValue
      FROM Climate c INNER JOIN FirstLastYears fl ON c.Country = fl.Country AND c.Year = fl.FirstYear
      WHERE Category = 'Temperature'
    ),
    LastYearValue AS (
      SELECT c.Country, c.Year as Year, c.Value as LastYearValue
      FROM Climate c INNER JOIN FirstLastYears fl ON c.Country = fl.Country AND c.Year = fl.LastYear
      WHERE c.Category = 'Temperature'
    ),
    Deltas AS (
      SELECT f.Country, l.Year - f.Year as YearsElapsed, l.LastYearValue - f.FirstYearValue as TemperatureChange
      FROM FirstYearValue f INNER JOIN LastYearValue l ON f.Country = l.Country
    )
    SELECT *
    FROM Deltas
    WHERE TemperatureChange > ${delta_low} AND TemperatureChange < ${delta_high}
    ORDER BY TemperatureChange DESC`,
      (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
          console.log(err);
        } else {
          res.json(data);
        }
      });
  } else {
    connection.query(`
    WITH FirstLastYears AS (
      SELECT Country, MIN(Year) as FirstYear, MAX(Year) as LastYear
      FROM Climate
      WHERE Category = 'Temperature' GROUP BY Country
    ),
    FirstYearValue AS (
      SELECT c.Country, c.Year as Year, c.Value as FirstYearValue
      FROM Climate c INNER JOIN FirstLastYears fl ON c.Country = fl.Country AND c.Year = fl.FirstYear
      WHERE Category = 'Temperature'
    ),
    LastYearValue AS (
      SELECT c.Country, c.Year as Year, c.Value as LastYearValue
      FROM Climate c INNER JOIN FirstLastYears fl ON c.Country = fl.Country AND c.Year = fl.LastYear
      WHERE c.Category = 'Temperature'
    ),
    Deltas AS (
      SELECT f.Country, l.Year - f.Year as YearsElapsed, l.LastYearValue - f.FirstYearValue as TemperatureChange
      FROM FirstYearValue f INNER JOIN LastYearValue l ON f.Country = l.Country
    )
    SELECT *
    FROM Deltas
    WHERE TemperatureChange > ${delta_low} AND TemperatureChange < ${delta_high}
    ORDER BY TemperatureChange DESC
    LIMIT ${page_size} OFFSET ${offset}`,
      (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
          console.log(err);
        } else {
          res.json(data);
        }
      });
  }
}

 // Route 13: 
 const distcountries = async function(req, res) {
  connection.query(`SELECT DISTINCT C.Continent,  Country2
  FROM USTradingData U JOIN CountryInfo C ON C.CountryName = U.Country2
  AND C.Continent IS NOT NULL ORDER BY U.Country2;`, 
      (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

 // Route 14: 
 const distcategories = async function(req, res) {
  connection.query(`SELECT DISTINCT Category
  FROM USTradingData
  ORDER BY Category;`, 
      (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

module.exports = {
  author,
  trading_data,
  trading_partner,
  trading_partner_catg,
  trading_volume,
  trading_export,
  population,
  populationwater,
  wages,
  wage_growth,
  labour,
  temperature,
  distcountries,
  distcategories,
}

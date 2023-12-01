const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const { cache } = require('ejs');
//const fetch = require('node-fetch');
//const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));


dotenv.config();

const app = express();
app.set('view engine', 'ejs');

let myHeaders = {
    "X-RapidAPI-Key": process.env.X_RAPID_API_KEY,
    "X-RapidAPI-Host": "cricket-live-data.p.rapidapi.com",
    "Content-Type": "application/octet-stream"
}

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

const cache_iplData = new Map();   // declare cache for iplData

app.get('/', async (req, res) => {
  if (cache_iplData.has('fixtures')) {
    const cachedResponse = cache_iplData.get('fixtures');
    console.log('Serving from cache:', cachedResponse);
    res.render('index', { fixtures: cachedResponse });
    return;
  }

  try {
    const response = await axios.get('https://cricket-live-data.p.rapidapi.com/fixtures-by-series/1430', requestOptions);
    const fixturesData = response.data;  // Renamed to avoid conflict with the global variable
    cache_iplData.set('fixtures', fixturesData);
    console.log('Fetching and serving fresh data:', fixturesData);
    res.render('index', { fixtures: fixturesData });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

// ... (other routes)

// ... (getPlayerId and getPlayerInfo functions)
//function to retrieve a player_id from an api by passing the name of the player
//const cache_playerId = new Map(); // adding in-memory caching

async function getPlayerId(search) {
  const apiKey = process.env.CRICKET_DATA_API_KEY;
  const offset = 0;

  
  try {
    const response = await axios.get(`https://api.cricapi.com/v1/players?apikey=${apiKey}&offset=${offset}&search=${search}`);
    const data1 = response.data;
    console.log(data1);
    const playerId = data1.data[0].id;
    console.log(`Player ID for '${search}' is ${playerId}`);
    return playerId;
  } catch (error) {
    console.error(error);
    return error;
  }
}

// function to get player stats for 1 player based on player id
const cache_response = new Map();

async function getPlayerInfo(search) {
  const apiKey = process.env.CRICKET_DATA_API_KEY;
  const playerId = await getPlayerId(search);

  if (playerId && cache_response.has(playerId)) {
    const cachedResponse = cache_response.get(playerId);
    console.log('Serving playerinfo response from cache', cachedResponse);
    const { name, role, country, dateOfBirth, playerImg, battingStyle, bowlingStyle, stats } = cachedResponse;
    console.log('Response from cached data', name, role, country, dateOfBirth, playerImg, battingStyle, bowlingStyle, stats);
    return { data: { name, role, country, dateOfBirth, playerImg, battingStyle, bowlingStyle, stats } };
  }

  try {
    const response = await axios.get(`https://api.cricapi.com/v1/players_info?apikey=${apiKey}&id=${playerId}`);
    const data = response.data.data;

    if (playerId) {
      cache_response.set(playerId, data);
      const { name, role, country, dateOfBirth, playerImg, battingStyle, bowlingStyle, stats } = data;
      console.log(name, role, country, dateOfBirth, playerImg, battingStyle, bowlingStyle, stats);
      return { data: { name, role, country, dateOfBirth, playerImg, battingStyle, bowlingStyle, stats } };
    } else {
      console.error(`No player ID found for search term '${search}'`);
      return { error: `No player ID found for search term '${search}'` };
    }
  } catch (error) {
    console.error(error);
    return { error };
  }
}


app.get('/player-stats/:search', async (req, res) => {
  
  const search = req.params.search;
  try {
    const player = await getPlayerInfo(search);
    const alias = {
      "m": "Matches",
      "inn": "Innings",
      "no": "Not Outs",
      "runs": "Runs",
      "hs": "Highest Score",
      "avg": "Average",
      "bf": "Total Runs",
      "sr": "Strike Rate",
      "100s": "100s",
      "200": "200s",
      "50s": "50s",
      "4s": "4s",
      "6s": "6s",
      "b": "b",
      "wkts": "Wickets",
      "bbi": "Bowling Figures",
      "bbm": "Bowling Figures 2",
      "econ": "Economy",
      "5w": "5 fors",
      "10w": "10 fors"
    };
    res.render('player-stats', { player, alias });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error retrieving player stats');
  }
});


// ... (other configurations)

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App listening on port ${port}`));

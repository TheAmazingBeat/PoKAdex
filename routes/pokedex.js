const axios = require('axios');
// const fetch = require('node-fetch');
const express = require('express');
const app = express.Router();

async function getPokemon() {
  try {
    return await axios.get('https://pokeapi.co/api/v2/pokemon/?limit=20');
  } catch (error) {
    console.log(error);
  }
}

app.get('/', async (req, res) => {
  const pokeData = await getPokemon();

  if (pokeData.status == 200) console.log(pokeData.data);

  res.render('index', {
    data: pokeData.data.results,
  });
});

module.exports = app;

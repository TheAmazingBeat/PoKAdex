const axios = require('axios');
// const fetch = require('node-fetch');
const express = require('express');
const app = express.Router();

async function getPokedexData() {
  try {
    return await axios.get('https://pokeapi.co/api/v2/pokemon/?limit=151');
  } catch (error) {
    console.log(error);
  }
}

async function getPokemon(pokeUrl) {
  try {
    const pokeDetails = await axios.get(pokeUrl);
    const pokemon = {
      name: pokeDetails.name
    }
    return pokemon;
  } catch (error) {
    console.log(error);
  }
}

app.get('/', async (req, res) => {
  const pokeData = await getPokedexData();
  const results = pokeData.data.results;
  let pokeDex = [];

  if (pokeData.status == 200) {
    pokeDex.push(await Promise.all(
      results.map(async (el) => {
        const pokemonData = await getPokemon(el.url);
      })
    ));
    // });
    console.log(pokeDex);
  }

  res.render('index', {
    dex: pokeDex,
  });
});

module.exports = app;

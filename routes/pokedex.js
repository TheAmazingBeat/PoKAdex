const axios = require('axios');
// const fetch = require('node-fetch');
const express = require('express');
const router = express.Router();

const allTypes = [
  'normal',
  'fighting',
  'flying',
  'poison',
  'ground',
  'rock',
  'bug',
  'ghost',
  'steel',
  'fire',
  'water',
  'grass',
  'electric',
  'psychic',
  'ice',
  'dragon',
  'dark',
  'fairy',
];

async function getPokedexData(offset) {
  if (!isNaN(offset)) offset = 0;
  try {
    const pokeData = await axios.get(
      `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`
    );
    const results = pokeData.data.results;
    let pokeDex = [];

    if (pokeData.status == 200) {
      pokeDex = await Promise.all(
        results.map(async (el) => {
          return await getPokemon(el.url);
        })
      );
      // console.log(pokeDex);
    }

    return pokeDex;
  } catch (error) {
    console.log(error);
  }
}

async function getPokemon(pokeUrl) {
  try {
    const pokeDetails = await axios.get(pokeUrl);
    const p = pokeDetails.data;
    // console.log(pokeDetails.data);
    const pokemon = {
      id: p.id,
      name: p.name,
      image: p.sprites.other.home.front_default,
      typeArray: p.types,
    };
    return pokemon;
  } catch (error) {
    console.log(error);
  }
}

router.get('/', async (req, res) => {
  res.render('index', {
    dex: await getPokedexData(),
    types: allTypes,
    offset: 0,
  });
});

router.get('/:offset', async (req, res) => {
	const off = req.params.offset
  res.render('index', {
    dex: await getPokedexData(off),
    types: allTypes,
    offset: off,
  });
});

module.exports = router;

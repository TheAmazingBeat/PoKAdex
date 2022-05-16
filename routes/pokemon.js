const axios = require('axios');
const express = require('express');
const router = express.Router();

async function getPokemonData(pokemonName) {
  if (!pokemonName) return;
  try {
    const data = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );
    return data.data;
  } catch (error) {
    console.log(error);
  }
}

router.get('/pokemon/:name', async (req, res) => {
  const name = req.params.name;
  const pokemonData = await getPokemonData(name);

  res.render('pokemon', {
    data: pokemonData,
    id: pokemonData.id,
    name: pokemonData.name,
    imageURL: pokemonData.sprites.other['official-artwork'].front_default,
  });
});

module.exports = router;

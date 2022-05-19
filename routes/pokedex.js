const axios = require('axios');
const express = require('express');
const { renderSync } = require('sass');
const router = express.Router();
const API_ROOT = `https://pokeapi.co/api/v2/`;

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

async function getPokedexData(limit, offset) {
  try {
    const pokeData = await axios.get(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
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
      image: p.sprites.other['official-artwork'].front_default,
      typeArray: p.types,
    };
    return pokemon;
  } catch (error) {
    console.log(error);
  }
}

async function getGamePokedex(gameURL) {
  try {
		console.log(gameURL)
    // const pokedexData = await axios.get(`${API_ROOT}pokedex/${gameID}`);
    const pokedexData = await axios.get(gameURL);
    if (pokedexData.status != 200) console.log(`Something went wrong`);
    const results = pokedexData.data.pokemon_entries;
    // console.log(pokedexData.data.pokemon_entries);

    let pokedex = null;
    pokedex = await Promise.all(
      results.map(async (el) => {
				const ID_INDEX = 42;
        return await getPokemon(`${API_ROOT}pokemon/${el.pokemon_species.url.substring(ID_INDEX)}`);
      })
    );
    // console.log(pokedex);
    return pokedex;
  } catch (error) {
    console.log(error);
  }
}

async function getGameID(gameName) {
  try {
    const versionsData = await axios.get(`${API_ROOT}version-group`);
    const results = versionsData.data.results;

    if (versionsData.status != 200) {
      console.log(`Something went wrong...${versionsData.status}`);
      return;
    }

    // console.log(versionsData)
    let gameURL = null;
    results.forEach((version) => {
      if (version.name == gameName) gameURL = version.url;
    });
		// console.log(gameURL)

    const game = await axios.get(gameURL);
    const gameData = game.data;
    // console.log(gameData)
    return gameData.pokedexes[0].url;
  } catch (error) {
    console.log(error);
  }
}

router.get('/pokedex', async (req, res) => {
  res.render('index', {
    dex: await getPokedexData(20),
    types: allTypes,
    offset: 0,
  });
});

// Pagination
router.get('/pokedex/:offset', async (req, res) => {
  const off = req.params.offset;
  res.render('index', {
    dex: await getPokedexData(20, off),
    types: allTypes,
    offset: off,
  });
});

router.get('/pokedex/game', (req, res) => {
  res.redirect('/pokedex/game/red-blue');
});

// When user requests pokedex by game
router.get('/pokedex/game/:gameName', async (req, res) => {
  const data = await getGamePokedex(await getGameID(req.params.gameName));
  console.log(data);
  res.render('index', {
		dex: data,
		types: allTypes,
		offset: 'none'
	});
});

// async function getGenerationData(genID) {
//   try {
//     const gen = await axios.get(
//       `https://pokeapi.co/api/v2/`
//     );
//     const genData = await gen.data;
//     const pokemons = genData.pokemon_species;

//     let pokedex = [];
//     if (gen.status == 200) {
//       pokeDex = await Promise.all(
//         pokemons.map(async (el) => {
//           return await getPokemon(el.url);
//         })
//       );
//       console.log(pokeDex);
//     }

//     return {
//       pokemons: pokedex,
//       versions: genData.version_groups,
//     };
//   } catch (error) {
//     console.log(error);
//   }
// }

// router.get('/pokedex/gen/:gen', async (req, res) => {
//   const off = req.params.offset;
//   const genId = req.params.gen;
//   const genData = await getGenerationData(genId);
//   // console.log(genData)
//   res.render('index', {
//     dex: genData.pokemons,
//     types: allTypes,
//   });
// });

module.exports = router;

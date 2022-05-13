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
    const p = pokeDetails.data;
		// console.log(pokeDetails.data);
		const pokemon = {
      id: p.id,
			name: p.name,
      image: p.sprites.other.home.front_default
		};
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
		pokeDex = await Promise.all(
			results.map(async (el) => {
				return await getPokemon(el.url);
			})
		);
		// });
		console.log(pokeDex);
	}

	res.render('index', {
		dex: pokeDex,
	});
});

module.exports = app;

const axios = require('axios');
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

router.get('/pokedex', async (req, res) => {
	res.render('index', {
		dex: await getPokedexData(20),
		types: allTypes,
		offset: 0,
	});
});

router.get('/pokedex/:offset', async (req, res) => {
	const off = req.params.offset;
	res.render('index', {
		dex: await getPokedexData(20, off),
		types: allTypes,
		offset: off,
	});
});

async function getGenerationData(genID) {
	try {
		const genData = await axios.get(
			`https://pokeapi.co/api/v2/generation/${genID}`
		);
		[pokemon_species, version_groups] = genData;
		return { pokemon_species, version_groups };
	} catch (error) {
		console.log(error);
	}
}

router.get('/pokedex/gen/:gen', async (req, res) => {
	const off = req.params.offset;
	const genId = req.params.gen;
	const genData = await getGenerationData(genId)
	res.render('index', {
		dex: genData.pokemon_species,
		types: allTypes,
	});
});

module.exports = router;

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

async function getPokemonStat(pokemonName) {
	try {
		const pokemonData = await getPokemonData(pokemonName);
		const vagueStats = pokemonData.stats;

		let stats = [];
		vagueStats.forEach((i) => {
			stats.push({ name: i.stat.name, style_stat: `width:${i.base_stat}%;`, base_stat: i.base_stat });
		});
    
    function calculateTotal(){
      let total = 0;

      stats.forEach(stat => {
        total += stat.base_stat;
      })

      return total;
    }

    // stats.push({name: total, base_stat: calculateTotal()})

		return stats;
	} catch (error) {
		console.log(error);
	}
}

router.get('/pokemon/:name', async (req, res) => {
	const name = req.params.name;
	const pokemonData = await getPokemonData(name);
	const stats = await getPokemonStat(name);

	res.render('pokemon', {
		data: pokemonData,
		id: pokemonData.id,
		name: pokemonData.name,
		imageURL: pokemonData.sprites.other['official-artwork'].front_default,
		stats: stats,
	});
});

module.exports = router;

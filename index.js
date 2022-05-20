const express = require('express');
const axios = require('axios');
const app = express();

// routes
const pokedex = require('./routes/pokedex');
const pokemon = require('./routes/pokemon');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  // Temporary -- adding more features later on, not just pokedex
	res.redirect('/pokedex');
});

app.get('/pokedex/', pokedex);
app.get('/pokedex/:offset', pokedex);

app.get('/pokemon', pokemon);

app.get('/pokemon/:name', pokemon);

app.get('/pokedex/gen/:gen', pokedex);

app.get('/pokedex/game/:gameName', pokedex)

const PORT = 3000;
app.listen(process.env.PORT || PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});

const express = require('express');
const axios = require('axios');
const app = express();

// routes
const pokedex = require('./routes/pokedex');
const pokemon = require('./routes/pokemon');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', pokedex);

app.get('/:offset', pokedex);

app.get('/pokemon', pokemon)

app.get('/pokemon/:name', pokemon);

app.get('/pokedex/:gen', pokedex);

const PORT = 3000;
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

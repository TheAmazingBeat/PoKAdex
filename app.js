const express = require('express');
const axios = require('axios');
const app = express();

// routes
const pokedex = require('./routes/pokedex')

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', pokedex);

const PORT = 3000;
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

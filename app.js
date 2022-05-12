const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index');
});

const PORT = 3000;
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

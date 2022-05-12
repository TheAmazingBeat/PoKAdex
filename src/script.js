let pokemon = [];

let offset = 0;
// const moreBtn = document.querySelector('#more');
// moreBtn.addEventListener('click', () => {
//   offset += 20;
// });

const pokeRequest = new Request(
  `https://pokeapi.co/api/v2/pokemon/?limit=20&offset=${offset}`
);

async function callPokemon() {
  fetch(pokeRequest)
    .then((response) => {
      if (!response.status == '200') {
        throw new Error(`Network response was ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      data.results.forEach((pokemon) => {
        addPokemon(pokemon);
      });
      return data.results;
    })
    .catch((error) => {
      console.error(
        'There has been a problem with your fetch operation:',
        error
      );
    });
}

callPokemon();

function addPokemon(pokemon) {
  const parent = document.querySelector('.container');

  const pokeContainer = document.createElement('div');
  pokeContainer.classList.add('poke-container');

  const name = document.createElement('h2');
  name.classList.add('pokemon-name');
  name.innerText = pokemon.name;

  pokeContainer.appendChild(name);

  parent.appendChild(pokeContainer);
}

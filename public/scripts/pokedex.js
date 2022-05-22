const app = document.querySelector('#app');
const API_ROOT = `https://pokeapi.co/api/v2/`;
const ITEMS_PER_PAGE = 50;
let OFFSET = 0;
let pokedex = [];

window.onload = displayPokedex(OFFSET, ITEMS_PER_PAGE);
window.onclick = (e) => {
  // console.log(e.target)
  const modal = document.querySelector('.poke-modal-overlay');
  if (e.target == modal) {
    modal.classList.toggle('show');
  }
};

async function getPokedexData(gameURL) {
  try {
    const response = await fetch(`${API_ROOT}pokedex/1`);

    if (!response.ok) throw new Error();

    const dex = await response.json();
    const pokedex = await Promise.all(
      dex.pokemon_entries.map(async (entry) => {
        const ID_INDEX = 42;
        return await getPokemon(
          `${API_ROOT}pokemon/${entry.pokemon_species.url.substring(ID_INDEX)}`
        );
      })
    );
    // console.log(result)
    return pokedex;
  } catch (error) {
    console.error(`Something went wrong with fetching data`, error);
  }
}

async function getPokemon(pokeURL) {
  try {
    const response = await fetch(pokeURL);

    if (!response.ok) throw new Error();

    const pokeDetails = await response.json();

    const pokemon = {
      id: pokeDetails.id,
      name: pokeDetails.name,
      image: pokeDetails.sprites.other['official-artwork'].front_default,
      typeArray: pokeDetails.types,
    };

    return pokemon;
  } catch (error) {
    console.log(`Something went wrong with fetching pokemon`, error);
  }
}

function createPokemonCard(pokemon, index) {
  const pokeContainer = document.createElement('a');
  pokeContainer.classList.add('poke-container');
  pokeContainer.dataset.index = index;
  pokeContainer.onclick = () => {
    displayPokemonModal(index);
  };
  // pokeContainer.onclick = displayPokemonModal(index);

  const id = document.createElement('p');
  id.classList.add('pokemon-id');
  id.innerText = `#${pokemon.id}`;

  const name = document.createElement('h2');
  name.classList.add('pokemon-name');
  name.innerText = pokemon.name;

  const image = document.createElement('img');
  image.classList.add('pokemon-image');
  image.setAttribute('src', pokemon.image);
  image.setAttribute('alt', `Picture of ${pokemon.name}`);
  image.setAttribute('loading', 'lazy');

  const types = document.createElement('div');
  pokemon.typeArray.forEach((t) => {
    const pokeType = document.createElement('div');
    pokeType.classList.add('type');
    pokeType.classList.add(`${t.type.name}`);
    pokeType.innerText = t.type.name;
    types.append(pokeType);
  });
  types.classList.add('pokemon-types');

  pokeContainer.append(id, name, image, types);

  return pokeContainer;
}

async function displayPokedex(offset, limit) {
  if (pokedex.length <= 0) {
    const pokedexData = await getPokedexData();
    pokedex = pokedexData;
  }

  let dexContainer;

  if (dexContainer == undefined) {
    dexContainer = document.createElement('div');
    dexContainer.setAttribute('id', 'dex');
  }

  // Hides the spinner once pokedex is loaded, but cards hasn't rendered
  const spinner = document.querySelector('.spinner');
  spinner.classList.toggle('hide');

  for (let i = offset; i < limit + offset; i++) {
    dexContainer.append(createPokemonCard(pokedex[i], i));
  }

  function createPagination() {
    const totalPages = Math.ceil(pokedex.length / ITEMS_PER_PAGE);
    const pageButtons = document.createElement('div');
    pageButtons.classList.add('pagination-buttons');
    for (let b = 0; b < totalPages; b++) {
      const pageNum = b + 1;
      const button = document.createElement('button');
      button.classList.add('page-button');
      button.innerText = pageNum;
      button.onclick = () => {
        console.log('page clicked');
        // Empty the pokedex
        dexContainer.replaceChildren();
        // Shows spinner
        spinner.classList.toggle('hide');
        displayPokedex(OFFSET + (limit * pageNum - 1), ITEMS_PER_PAGE);
      };
      pageButtons.append(button);
    }
    app.append(pageButtons);
  }

  if (document.querySelector('.pagination-buttons') == null) createPagination();

  app.append(dexContainer);

  return pokedex;
}

async function displayPokemonModal(pokeIndex) {
  const pokemon = pokedex[pokeIndex];
  const modal = document.querySelector('.poke-modal-overlay');
  modal.classList.toggle('show');
  const modalHeader = document.querySelector('.modal-header');
  const modalBody = document.querySelector('.modal-body');
  const modalooter = document.querySelector('.modal-footer');

  modalHeader.innerHTML = `<h2 class="pokemon-name">#${pokemon.id} - ${pokemon.name}</h2>`;
  modalBody.innerHTML = `<img src="${pokemon.image}" alt="Picture of ${pokemon.name}" class="pokemon-image" loading="lazy">`;
}

app.innerHTML = `
<h1>PoKAdex</h1>
<div class="spinner"></div>
<div class="poke-modal-overlay">
  <div class="poke-modal">
    <header class="modal-header"></header>
    <main class="modal-body"></main>
    <footer class="modal-footer"></footer>
  </div>
</div>
      
`;

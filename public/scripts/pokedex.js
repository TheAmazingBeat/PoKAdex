const app = document.querySelector('#app');
const API_ROOT = `https://pokeapi.co/api/v2/`;
let pd = [];

window.onload = displayPokedex();

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

function createPokemonCard(pokemon) {
  const pokeContainer = document.createElement('a');
  pokeContainer.classList.add('poke-container');

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

async function displayPokedex() {
  const pokedex = await getPokedexData();
  console.table(pokedex);
  const dexContainer = document.createElement('div');
  dexContainer.setAttribute('id', 'dex');
  pokedex.forEach((pokemon) => {
    dexContainer.append(createPokemonCard(pokemon));
  });

  app.append(dexContainer);

  pd = pokedex;
  return pokedex;
}

app.innerHTML = `<h1>PoKAdex</h1>`;

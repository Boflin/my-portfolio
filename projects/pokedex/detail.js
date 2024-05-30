// detail.js

// Function to fetch detailed information about a selected Pokemon from the PokeAPI
async function fetchPokemonDetails(pokemonID) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonID}`);
    if (!response.ok) {
      throw new Error('Failed to fetch Pokemon details');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

// Function to populate the detailed view with fetched data
async function populateDetailView(pokemonID) {
  const pokemonDetails = await fetchPokemonDetails(pokemonID);
  if (!pokemonDetails) {
    console.error('Failed to fetch Pokemon details');
    return;
  }

  // Extract necessary information from pokemonDetails
  const { name, sprites, stats, types } = pokemonDetails;

  // Dynamically populate the HTML elements with the fetched data
  const detailContainer = document.querySelector('.detail-container');
  detailContainer.innerHTML = `
    <h2>${name}</h2>
    <img src="${sprites.front_default}" alt="${name}" />
    <h3>Types:</h3>
    <ul>
      ${types.map(type => `<li>${type.type.name}</li>`).join('')}
    </ul>
    <h3>Stats:</h3>
    <ul>
      ${stats.map(stat => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}
    </ul>
    <!-- Add slideshow or additional information here -->
  `;
}

// Extract Pokemon ID from URL query parameter
const urlParams = new URLSearchParams(window.location.search);
const pokemonID = urlParams.get('id');

// Call populateDetailView function with the extracted Pokemon ID
populateDetailView(pokemonID);

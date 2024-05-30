const MAX_POKEMON = 1025;
const POKEMON_PER_PAGE = 12; // Number of Pokémon to display per page
let currentPage = 1;
let allPokemons = [];

const listWrapper = document.querySelector(".list-wrapper");
const searchInput = document.querySelector("#search-input");
const notFoundMessage = document.querySelector("#not-found-message");
const randomButton = document.querySelector("#random-button");
const prevButton = document.querySelector("#prev-button");
const nextButton = document.querySelector("#next-button");

// Function to fetch Pokémon data by ID
async function fetchPokemonDataById(id) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!response.ok) {
            throw new Error('Pokemon not found');
        }
        const pokemonData = await response.json();
        return pokemonData;
    } catch (error) {
        console.error('Error fetching Pokémon data:', error);
        return null;
    }
}

// Function to fetch multiple Pokémon data
async function fetchMultiplePokemonData(ids) {
    const promises = ids.map(id => fetchPokemonDataById(id));
    return await Promise.all(promises);
}

// Function to display Pokémon data
function displayPokemons(pokemons) {
    listWrapper.innerHTML = "";
    pokemons.forEach(pokemon => {
        const listItem = document.createElement("div");
        listItem.className = "list-item";
        listItem.innerHTML = `
            <div class="number-wrap">
                <p class="caption-fonts">#${pokemon.id}</p>
            </div>
            <div class="img-wrap">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
            </div>
            <div class="name-wrap">
                <p class="body3-fonts">#${pokemon.name}</p>
            </div>
        `;
        listWrapper.appendChild(listItem);
    });
}

// Function to load Pokémon for the current page
async function loadPokemonPage(page) {
    const start = (page - 1) * POKEMON_PER_PAGE + 1;
    const end = start + POKEMON_PER_PAGE - 1;
    const ids = Array.from({ length: POKEMON_PER_PAGE }, (_, i) => start + i);
    const pokemons = await fetchMultiplePokemonData(ids);
    displayPokemons(pokemons);
}

// Event listener for search input
searchInput.addEventListener("input", async () => {
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm) {
        const pokemon = await fetchPokemonDataById(searchTerm);
        if (pokemon) {
            displayPokemons([pokemon]);
            notFoundMessage.style.display = "none";
        } else {
            listWrapper.innerHTML = "";
            notFoundMessage.style.display = "block";
        }
    } else {
        listWrapper.innerHTML = "";
        notFoundMessage.style.display = "block";
    }
});

// Function to select a random Pokémon
async function selectRandomPokemon() {
    const randomId = Math.floor(Math.random() * MAX_POKEMON) + 1;
    const pokemon = await fetchPokemonDataById(randomId);
    if (pokemon) {
        displayPokemons([pokemon]);
        notFoundMessage.style.display = "none";
    } else {
        listWrapper.innerHTML = "";
        notFoundMessage.style.display = "block";
    }
}

// Event listener for random button
randomButton.addEventListener("click", selectRandomPokemon);

// Event listeners for pagination buttons
prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        loadPokemonPage(currentPage);
    }
});

nextButton.addEventListener("click", () => {
    if (currentPage < Math.ceil(MAX_POKEMON / POKEMON_PER_PAGE)) {
        currentPage++;
        loadPokemonPage(currentPage);
    }
});

// Initial load
loadPokemonPage(currentPage);

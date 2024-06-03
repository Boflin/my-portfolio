document.getElementById("pokemonName").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    fetchData();
  }
});

async function fetchData() {
  try {
    const pokemonName = document.getElementById("pokemonName").value.toLowerCase();
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);

    if (!response.ok) {
      throw new Error("Could not fetch resource");
    }

    const data = await response.json();
    const pokemonSprite = data.sprites.front_default;
    const imgElement = document.getElementById("pokemonSprite");
    const tableElement = document.getElementById("pokemonStats");
    const abilitiesElement = document.getElementById("abilities");
    const abilitiesListElement = document.getElementById("abilitiesList");
    const encountersElement = document.getElementById("encounters");
    const encountersListElement = document.getElementById("encountersList");

    imgElement.src = pokemonSprite;
    imgElement.style.display = "block";

    document.getElementById("stat-hp").innerText = data.stats.find(stat => stat.stat.name === 'hp').base_stat;
    document.getElementById("stat-att").innerText = data.stats.find(stat => stat.stat.name === 'attack').base_stat;
    document.getElementById("stat-def").innerText = data.stats.find(stat => stat.stat.name === 'defense').base_stat;
    document.getElementById("stat-spatk").innerText = data.stats.find(stat => stat.stat.name === 'special-attack').base_stat;
    document.getElementById("stat-spdef").innerText = data.stats.find(stat => stat.stat.name === 'special-defense').base_stat;
    document.getElementById("stat-spd").innerText = data.stats.find(stat => stat.stat.name === 'speed').base_stat;

    tableElement.style.display = "table";

    // Clear previous abilities
    abilitiesListElement.innerHTML = '';

    data.abilities.forEach(ability => {
      const listItem = document.createElement('li');
      listItem.textContent = `${ability.ability.name}${ability.is_hidden ? ' (Hidden Ability)' : ''}`;
      abilitiesListElement.appendChild(listItem);
    });

    abilitiesElement.style.display = "block";

    // Fetch encounter data
    const encounterResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}/encounters`);
    if (!encounterResponse.ok) {
      throw new Error("Could not fetch encounter data");
    }
    const encounterData = await encounterResponse.json();

    // Clear previous encounters
    encountersListElement.innerHTML = '';

    encounterData.forEach(encounter => {
      const listItem = document.createElement('li');
      listItem.textContent = encounter.location_area.name.replace(/-/g, ' ');
      encountersListElement.appendChild(listItem);
    });

    encountersElement.style.display = "block";

  } catch (error) {
    console.error(error);
  }
}

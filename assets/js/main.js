const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" onclick="openStats(this)">
            <div class="detail">
                <span class="name">${pokemon.name}</span>
                <span class="number">#${pokemon.number}</span>
            </div>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function convertPokemonToStatus(pokemon) {
    return `
        <div class="top ${pokemon.type}">
            <div class="stats-button">
                <div class="back" onclick="closeStats()">
                    <svg xmlns="http://www.w3.org/2000/svg" height="30" width="30" viewBox="0 0 512 512"><path fill="#ffffff" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 480 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-370.7 0 73.4-73.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-128 128z"/></svg>
                </div>
            </div>
            <div class="detail">
                <span class="name">${pokemon.name}</span>
                <span class="number">#${pokemon.number}</span>
            </div>
            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
            </div>
            <div class="bottom">
                <img src="${pokemon.photo2}" alt="${pokemon.name}" class="pokeImage">
            </div>
        </div>
    `
}

function loadPokemonItens(offset, limit) {
    return new Promise(resolve => {
        pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
            const newHtml = pokemons.map(convertPokemonToLi).join('')
            pokemonList.innerHTML += newHtml
        })
        .then(resolve())
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    loadMoreButton.disabled = true;

    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit).then(() => loadMoreButton.disabled = false);
    }
})




// stats
const statsArea = document.querySelector(".stats")

function openStats(card){
    
    const pokemonID = parseInt(card.querySelector(".number").innerHTML.slice(1))
    let pokemon = {url: `https://pokeapi.co/api/v2/pokemon/${pokemonID}/`}
    statsArea.classList.toggle("stats-active")


    new Promise(resolve => {
        pokeApi.getPokemonDetail(pokemon).then( pokemon => {
            statsArea.innerHTML = convertPokemonToStatus(pokemon)
        })
        .then(resolve())
    })


}
   
function closeStats() { statsArea.classList.toggle("stats-active")}
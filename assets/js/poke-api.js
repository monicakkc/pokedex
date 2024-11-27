
const pokeApi = {}

function convertPokeApiDetailtoPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name
    pokemon.height = pokeDetail.height
    pokemon.weight = pokeDetail.weight

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    const abilities = pokeDetail.abilities.map((abilitySlot) => abilitySlot.ability.name)
    const [ability] = abilities

    pokemon.abilities = abilities
    pokemon.ability = ability

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
            .then((response) => response.json()) //pega a lista dos detalhes e converte a resposta para json
            .then(convertPokeApiDetailtoPokemon)
}

pokeApi.getPokemons = (offset, limit) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    //buscando a lista de pokemons
    return fetch(url)
            .then((response) => response.json()) //primeiro fetch para buscar os dados e transforma em uma promise
            .then((jsonBody) => jsonBody.results) //segundo recebe o body com a lista de pokemons
            .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail)) //mapeia a lista dos pokemons
            .then((detailRequests) => Promise.all(detailRequests)) //espera todas as requisicoes terminarem
            .then((pokemonsDetails) => pokemonsDetails) //devolve a lista com os detalhes dos pokemons
            .catch((error) => console.error(error)) //manipular fracasso na requisicao
            .finally(() => console.log(`Requisição Terminada!`)) //independente do sucesso ou fracasso da req executa
}

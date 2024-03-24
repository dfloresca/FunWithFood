const axios = require('axios');


const { API_HOST, API_KEY } = { 
    API_HOST: process.env.API_HOST,
    API_KEY: process.env.API_KEY
}

const getRecipe = async (recipeUrl) => {
    const options = {
        method: 'GET',
        url: 'https://cookr-recipe-parser.p.rapidapi.com/getRecipe',
        params: {
            source: recipeUrl
        },
        headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': API_HOST
        }
    };

    try {
        const parsedRecipe = await axios.request(options);
        return parsedRecipe;
    } catch (error) {
        return error;
    }
};

module.exports = {
    getRecipe
};
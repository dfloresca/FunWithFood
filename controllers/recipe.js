require('dotenv').config();
const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const session = require('express-session');
const db = require('../models')
const passport = require('../config/ppConfig');
const axios = require('axios');
const methodOverride = require('method-override');

const { API_HOST, API_KEY } = { 
    API_HOST: process.env.API_HOST,
    API_KEY: process.env.API_KEY
}


// Recipe creation route
router.get("/new", isLoggedIn,  async (req, res) => {
    return res.render("recipe/add");
})

router.post('/add/', async (req, res) => {
    console.log('start of route');
    try {
        const { id } = req.user.get();
        const user = await db.user.findOne({ where: { id: id } });
        console.log('the user name', user.name);

        console.log('req.body data', req.body)
        const { recipeName, url, description, signatureDish, cooked } = req.body;
        console.log('adding recipe to this user:', user.name);

        const newRecipe = await user.createRecipe({
            recipeName,
            url,
            description,
            signatureDish,
            cooked
        });

        console.log(newRecipe);
        res.redirect(`view/${recipeName}`);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).render('404', { message: 'Internal Server Error'});
    }
});

// Find Recipe by ID
router.get("/:id", isLoggedIn, async (req, res) => {
    try {
        const selectedRecipe = req.params.id
        const recipe = await db.recipe.findOne({
            where: { id: selectedRecipe }
        });
        return res.render("recipe/view", { recipe });
    } catch (error) {
        return res.status(404).render('404', { message: 'Cannot find recipe'});
    }

})

// delete route
router.get("/:id/confirm_delete", isLoggedIn, async (req, res) => {
    try {
        const selectedRecipe = req.params.id
        const recipe = await db.recipe.findOne({
            where: { id: selectedRecipe }
        });
        return res.render("recipe/delete", { recipe });
    } catch (error) {
        console.log('did not find recipe b/c of >>>', error);
        return res.status(500).render('404', { message: 'Internal Server Error'});
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let numOfRowsDeleted = await db.recipe.destroy({
            where: {
                id: id
            }
        });
        req.flash('recipe has been deleted');
        res.redirect('/profile');
    } catch (error) {
        return res.status(500).render('404', { message: 'Internal Server Error'});
    }
});

// Edit Route
router.get("/:id/edit", isLoggedIn, async (req, res) => {
    try {
        const selectedRecipe = req.params.id
        const recipe = await db.recipe.findOne({
            where: { id: selectedRecipe }
        });
        return res.render("recipe/edit", { recipe });
    } catch (error) {
        console.log('did not find recipe b/c of >>>', error);
        return res.status(500).render('404', { message: 'Internal Server Error'});
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { description, signatureDish, cooked } = req.body;
        const numRowsUpdated = await db.recipe.update({
            description: description,
            cooked: cooked,
            signatureDish: signatureDish
        }, {
            where: {
                id: id
            }
        });
        req.flash('success', 'recipe has been successfully updated');
        res.redirect('/profile');
    } catch (error) {
        console.log('did not update recipe because of ==>', error)
        return res.status(500).render('404', { message: 'Internal Server Error'});
    }
})

// Recipe Parser
router.get('/:id/parsed', isLoggedIn, async (req, res) => {
    console.log("Let's extract the recipe data from a URL");
    try {
        const selectedRecipe = req.params.id
        const recipe = await db.recipe.findOne({
            where: { id: selectedRecipe }
        });

        if (!recipe) {
            return res.status(404).send('Recipe not found');
        }
        const parsedRecipe = {
            method: 'GET',
            url: 'https://cookr-recipe-parser.p.rapidapi.com/getRecipe',
            params: {
                source: `${recipe.url}`
            },
            headers: {
                'X-RapidAPI-Key': API_KEY,
                'X-RapidAPI-Host': API_HOST
            }
        };

        try {
            const response = await axios.request(parsedRecipe);
            console.log('recipe Data', response.data);
            // const { recipeData } = response.data;
            console.log('recipe Data description', response.data.recipe.description);
            console.log('recipe data cookTime', response.data.recipe.recipeInstructions)
            return res.render("recipe/parsed", { recipe, response });
        } catch (error) {
            console.error('Error parsing recipe:', error);
            return res.status(500).render('404', { message: 'Internal Server Error'});
        }
    } catch (error) {
        console.log('There was an error:', error);
        return res.status(500).render('404', { message: 'Internal Server Error'});
    }
});

module.exports = router;
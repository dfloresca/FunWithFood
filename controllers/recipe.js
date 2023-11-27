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

router.get("/add/:userId", (req, res) => {
    async function findOneUser() {
        try {
            const user = await db.user.findOne({
                where: { userId: req.params.userId }
            });
            if (userId === user.id) {
                console.log('current user here >>>');
            }
        } catch (error) {
            console.log('did not find user b/c of >>>', error);
        }
    }
    return res.render("recipe/add");
})

router.get("/view/:recipeName", async (req, res) => {

    try {

        const selectedRecipe = req.params.recipeName
        console.log('selectedRecipe')
        const recipe = await db.recipe.findOne({
            where: { recipeName: selectedRecipe }
        });
        console.log(recipe)
        // if (recipeName === recipe.recipeName) {
        //     console.log('current recipe here >>>');
        // }
        return res.render("recipe/view", { recipe });
    } catch (error) {
        console.log('did not find recipe b/c of >>>', error);
    }

})

router.get("/delete/:recipeName", async (req, res) => {
    console.log('lets delete a recipe')
    try {
        const selectedRecipe = req.params.recipeName
        console.log('selectedRecipe');

        const recipe = await db.recipe.findOne({
            where: { recipeName: selectedRecipe }
        });
        console.log(recipe)
        // if (recipeName === recipe.recipeName) {
        //     console.log('current recipe here >>>');
        // }
        return res.render("recipe/delete", { recipe });
    } catch (error) {
        console.log('did not find recipe b/c of >>>', error);
    }
});

router.get("/edit/:recipeName", async (req, res) => {
    console.log('lets edit a recipe')
    try {
        const selectedRecipe = req.params.recipeName
        console.log('selectedRecipe', selectedRecipe);

        const recipe = await db.recipe.findOne({
            where: { recipeName: selectedRecipe }
        });
        console.log(recipe)
        // if (recipeName === recipe.recipeName) {
        //     console.log('current recipe here >>>');
        // }
        return res.render("recipe/edit", { recipe });
    } catch (error) {
        console.log('did not find recipe b/c of >>>', error);
    }
});

router.get('/parsed/:recipeName', async (req, res) => {
    console.log("Let's extract the recipe data from a URL");
    try {
        const { recipeName } = req.params; // Fix variable name
        const recipe = await db.recipe.findOne({
            where: { recipeName: recipeName }
        });

        if (!recipe) {
            return res.status(404).send('Recipe not found');
        }

        console.log('This is the recipe we are parsing:', recipeName);
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
            return res.status(500).send('Error parsing recipe');
        }
    } catch (error) {
        console.log('There was an error:', error);
        return res.status(500).send('Internal Server Error');
    }
});

// router.get('/parsed/:recipeName', async (req, res) => {
//     console.log("let's extract the recipe data from a url");
//     try {
//         const { recipeName } = req.params
//         const recipe = await db.recipe.findOne({
//             where: { recipeName: recipeName }
//         });
//         console.log('this is the recipe we are parsing==>', recipeName)
//         const parsedRecipe = {
//             method: 'GET',
//             url: 'https://cookr-recipe-parser.p.rapidapi.com/getRecipe',
//             params: {
//                 source: `${recipe.url}`
//             },
//             headers: {
//                 'X-RapidAPI-Key': API_KEY,
//                 'X-RapidAPI-Host': API_HOST
//             }
//         };

//         try {
//             const response = await axios.request(parsedRecipe);
//             console.log(response.data);
//             console.log(parsedRecipe)
//             return res.render("recipe/parsed", { recipe, parsedRecipe })
//         } catch (error) {
//             console.error(error);
//         }


//     } catch (error) {
//         console.log('there was an error', error)
//     }
// })

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
        res.status(500).send('Server Error');
    }
});

router.put('/:recipeName', async (req, res) => {
    console.log('Lets update a recipe');
    try {
        const { id } = req.user.get();
        const user = await db.user.findOne({ where: { id: id } });
        console.log('the user name', user.name);

        const { recipeName } = req.params;
        console.log('the recipe we are updating', recipeName)
        const { description, signatureDish, cooked } = req.body;
        console.log('the parameters we are working with', req.body);
        const numRowsUpdated = await db.recipe.update({
            description: description,
            cooked: cooked,
            signatureDish: signatureDish
        }, {
            where: {
                recipeName: recipeName
            }
        });
        console.log('SUCCESS!!! number of lines updated', numRowsUpdated);
        req.flash('success', 'recipe has been successfully updated');
        res.redirect('/profile');
    } catch (error) {
        console.log('did not update recipe because of ==>', error)
    }
})

router.delete('/:recipeName', async (req, res) => {
    console.log('start of delete route');
    try {
        const { recipeName } = req.params;
        let numOfRowsDeleted = await db.recipe.destroy({
            where: {
                recipeName: recipeName
            }
        });
        console.log('number of rows deleted >>>', numOfRowsDeleted);
        req.flash('recipe has been deleted');
        res.redirect('/profile');
    } catch (error) {
        console.log('did not delete Recipe because of >>>', error);
    }
});




module.exports = router;
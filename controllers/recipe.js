require('dotenv').config();
const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const session = require('express-session');
const db = require('../models')
const cookrApi = require('../lib/services/cookr_api');


// Recipe creation route
router.get("/new", isLoggedIn,  async (req, res) => {
    return res.render("recipe/add");
})


router.post('/add/', async (req, res) => {
    try {
        const { recipeName, url, description, signatureDish, cooked } = req.body;
        const newRecipe = await user.createRecipe({
            recipeName,
            url,
            description,
            signatureDish,
            cooked
        });
        res.redirect(`view/${recipeName}`);
    } catch (error) {
        return res.status(404).render('404', { message: 'Unable to create recipe'});
    }
});


// Find Recipe by ID
router.get("/:id", isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        const recipe = await db.recipe.findOne({
            where: { id: id }
        });
        return res.render("recipe/view", { recipe });
    } catch (error) {
        return res.status(404).render('404', { message: 'Cannot find recipe'});
    }

})


// delete route
router.get("/:id/confirm_delete", isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        const recipe = await db.recipe.findOne({
            where: { id: id }
        });
        return res.render("recipe/delete", { recipe });
    } catch (error) {
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
        const { id } = req.params;
        const recipe = await db.recipe.findOne({
            where: { id: id }
        });
        return res.render("recipe/edit", { recipe });
    } catch (error) {
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
        return res.status(500).render('404', { message: 'Unable to update recipe'});
    }
})


// Recipe Parser
router.get('/:id/parsed', isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        const recipe = await db.recipe.findOne({
            where: { id: id }
        });

        if (!recipe) {
            return res.status(404).send('Recipe not found');
        }
        const parsedRecipe = await cookrApi.getRecipe(recipe.url);
        return res.render("recipe/parsed", { recipe, parsedRecipe });
    } catch (error) {
        return res.status(500).render('404', { message: 'Internal Server Error'});
    }
});


module.exports = router;
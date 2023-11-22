require('dotenv').config();
const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const session = require('express-session');
const db = require('../models')
const passport = require('../config/ppConfig');
const axios = require('axios');

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
        const test = req.params.recipeName
        console.log('test')
        const recipe = await db.recipe.findOne({
            where: { recipeName: test }
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
        const test = req.params.recipeName
        console.log('test')
        const recipe = await db.recipe.findOne({
            where: { recipeName: test }
        });
        console.log(recipe)
        // if (recipeName === recipe.recipeName) {
        //     console.log('current recipe here >>>');
        // }
        return res.render("recipe/delete", { recipe });
    } catch (error) {
        console.log('did not find recipe b/c of >>>', error);
    }
})
// router.post('/add/:id', async (req, res) => {
//     console.log('start of post route')
//     try {
//         const user = await db.user.findOne({ where: { id: req.params } })
//         console.log('lets see the user name', user.name)
//             .then(user => {
//                 const { recipeName, url, description, signatureDish, cooked } = req.body; // goes and us access to whatever key/value inside of the object
//                 console.log('adding recipe to this user:', user.name);
//                 user.createRecipe({
//                     recipeName: recipeName,
//                     url: url,
//                     description: description,
//                     signatureDish: signatureDish,
//                     cooked: cooked
//                 })
//                     .then(newRecipe => {
//                         console.log('here is the new recipe', newRecipe);
//                         res.redirect(`/`)
//                     })
//             })
//     } catch(error) {
//         console.log('there was an error', error.message)
//     }
// });

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



module.exports = router;
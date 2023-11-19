const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const session = require('express-session');
const db = require('../models')
const passport = require('../config/ppConfig');

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
router.get("/view/:recipe_name", async (req, res) => {
    
        try {
            const user = await db.user.findOne({
                where: { recipeName: req.params.recipe_name }
            });
            if (recipeName === recipe.recipe_name) {
                console.log('current recipe here >>>');
            }
        } catch (error) {
            console.log('did not find recipe b/c of >>>', error);
        }
    
    return res.render("recipe/view");
})

router.post('/add/:id', async (req, res) => {
    db.user.findOne({ where: { id: req.params.id } })
        .then(user => {
            const { recipe_name, url, description, signature_dish, cooked } = req.body; // goes and us access to whatever key/value inside of the object
            user.createRecipe({
                recipe_name: recipe_name,
                url: url,
                description: description,
                signature_dish: signature_dish,
                cooked: cooked
            })
                .then(newRecipe => {
                    console.log(newRecipe);
                    res.redirect(`recipe/view/${recipe_name}`)
                })
        })

    // try {
    //     const { recipe_name, url, description, signature_dish, cooked } = req.body; // goes and us access to whatever key/value inside of the object
    //     const { id } = req.user.get()
    //     const newRecipe = await db.recipe.create({
    //         recipe_name: recipe_name,
    //         user_id: id,
    //         url: url,
    //         description: description,
    //         signature_dish: signature_dish,
    //         cooked: cooked
    //     });
    //     console.log('my new recipe >>>', newRecipe);
    //     res.redirect(`recipe/view/${recipe_name}`);
    // } catch (error) {
    //     console.log('new recipe was not created b/c of >>>', error);
    // }

    // async function findOrCreate() {
    //     try {
    //         console.log(req.body);
    //         const { recipe_name, url, description, signature_dish, cooked } = req.body; // goes and us access to whatever key/value inside of the object
    //         const { user_id } = req.user.get()
    //         const recipe = await db.recipe.findOrCreate({
    //             where: {},
    //             defaults: {
    //                 user_id: user_id,
    //                 url: url,
    //                 description: description,
    //                 signature_dish: signature_dish,
    //                 cooked: cooked
    //             },
    //         }).then(([recipe, created]) => {
    //             console.log('all recipes here >>>', recipe);
    //             res.redirect(`/recipe/view/${this.recipe_name}`)
    //         })
    //     } catch (error) {
    //         console.log('did not find all users because of >>>', error);
    //     }
    // }
});



module.exports = router;
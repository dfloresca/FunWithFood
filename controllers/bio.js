const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const session = require('express-session');
const db = require('../models')
const passport = require('../config/ppConfig');

// GET /bio
router.get("/edit/:email", (req, res) => {
    async function findOneUser() {
        try {
            const user = await db.user.findOne({
                where: { email: req.params.email }
            });
            if (email === user.email) {
            console.log('current user here >>>');
            }  
        } catch (error) {
            console.log('did not find user b/c of >>>', error);
        }
    }
    return res.render("bio/edit");
})

// router.put("/edit/:email", (req, res) => {
//     async function updateUser() {
//         try {
//             const numRowsUpdated = await db.user.update({
//                 name: 'Brain Taco'
//             }, {
//                 where: {
//                     email: 'brainsmith@gmail.com'
//                 }
//             });
//             console.log('number of users updated', numRowsUpdated);
//         } catch (error) {
//             console.log('did not update user(s) because of >>>', error);
//         }
//     }
// })

module.exports = router;
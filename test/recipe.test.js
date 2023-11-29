const expect = require('chai').expect;
const request = require('supertest');
const app = require('../server');
const recipe = require('../controllers/recipe')
const db = require('../models');


before(function (done) {
    db.sequelize.sync({ force: true }).then(function () {
        done();
    });
});

describe('Recipe Controller', function () {
    describe('GET /recipe/add/:userId', function () {
        it('should return a 200 response', function (done) {
            request(app).get('/recipe/add/1').expect(200, done);
        });
    });

    // describe('POST /recipe/add/', function () {
    //     it('should redirect to /view/:recipeName on success', function (done) {
    //         request(app)
    //             .post('/recipe/add/')
    //             .set('Content-Type', 'application/x-www-form-urlencoded')
    //             .send({
    // userId: 1,
    // recipeName: 'CranberrySauce',
    // url: 'https://nomnompaleo.com/post/66981815680/paleo-cran-cherry-sauce',
    // description: 'Delicious homeMade Cranberry Sauce',
    // signatureDish: true,
    // cooked: true
    //             })
    //             .expect('Location', '/recipe/view/CranberrySauce')
    //             .expect(302, done);
    //     });
    // });
    describe('Creating a recipe', function () {
        it('should create successfully', function (done) {
            db.recipe.create({
                userId: 1,
                recipeName: 'CranberrySauce',
                url: 'https://nomnompaleo.com/post/66981815680/paleo-cran-cherry-sauce',
                description: 'Delicious homeMade Cranberry Sauce',
                signatureDish: true,
                cooked: true
            }).then(function () {
                done();
            }).catch(function (error) {
                done(error);
            });
        });
    });


    describe('GET /recipe/view/:recipeName', function () {
        it('should return a 200 response', function (done) {
            request(app).get('/recipe/view/CranberrySauce').expect(200, done);
        });
    });

    describe('GET /recipe/edit/:recipeName', function () {
        it('should return a 200 response', function (done) {
            request(app).get('/recipe/edit/CranberrySauce').expect(200, done);
        });
    });

    describe('GET /recipe/parsed/:recipeName', function () {
        it('should return a 200 response', function (done) {
            request(app).get('/recipe/parsed/CranberrySauce').expect(200, done);
        });
    });

    describe('Updating a recipe', function () {
        it('should update successfully', function (done) {
            db.recipe.update({
                description: 'A delicious dish; the cinnamon sticks add a nice spiciness',
            }, {
                where: { id: 1 }
            }).then(function () {
                return db.recipe.findByPk(1);
            }).then(function (updatedRecipe) {
                if (updatedRecipe.description === 'A delicious dish; the cinnamon sticks add a nice spiciness') {
                    done();
                } else {
                    done(new Error('Recipe was not updated successfully'));
                }
            }).catch(function (error) {
                done(error);
            });
        });
    });


    describe('GET /recipe/delete/:recipeName', function () {
        it('should return a 200 response', function (done) {
            request(app).get('/recipe/delete/CranberrySauce').expect(200, done);
        });
    });

    describe('Deleting a recipe', function () {
        it('should delete successfully', function (done) {
            db.recipe.destroy({
                where: {
                    recipeName: 'CranberrySauce'
                }
            }).then(function () {
                done();
            }).catch(function (error) {
                done(error);
            });
        });

    })
});
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../server');
const recipe = require('../controllers/recipe')
const db = require('../models');
const agent = request.agent(app);


before(function (done) {
    db.sequelize.sync({ force: true }).then(function () {
        done();
    });
});

describe('GET /profile', function () {
    it('should redirect to /auth/login if not logged in', function (done) {
        request(app).get('/profile')
            .expect('Location', '/auth/login')
            .expect(302, done);
    });

    it('should return a 200 response if logged in', function (done) {
        agent.post('/auth/signup')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .send({
                email: 'my@user.co',
                name: 'Steve Peters',
                password: 'password'
            })
            .expect(302)
            .expect('Location', '/')
            .end(function (error, res) {
                if (error) {
                    done(error);
                } else {
                    agent.get('/profile')
                        .expect(200, done);
                }
            });
    });
});

describe('Recipe Controller', function () {
    describe('GET /recipe/add/:userId', function () {
        it('should return a 302 response', function (done) {
            request(app).get('/recipe/add/1').expect(302, done);
        });
    });
    describe('POST /recipe/add/', function () {
        it('should redirect to /view/:recipeName on success', function (done) {
            agent
                .post('/recipe/add/')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({
                    userId: 1,
                    recipeName: 'CranberrySauce',
                    url: 'https://nomnompaleo.com/post/66981815680/paleo-cran-cherry-sauce',
                    description: 'Delicious homeMade Cranberry Sauce',
                    signatureDish: true,
                    cooked: true
                })
                .expect('Location', '/recipe/view/CranberrySauce')
                .expect(302, done);
        });
    });

    describe('GET /recipe/view/:recipeName', function () {
        it('should return a 302 response', function (done) {
            request(app).get('/recipe/view/CranberrySauce').expect(302, done);
        });
    });
    describe('GET /recipe/delete/:recipeName', function () {
        it('should return a 302 response', function (done) {
            request(app).get('/recipe/delete/CranberrySauce').expect(302, done);
        });
    });
    describe("DELETE /recipe/:recipeName", function () {
        it("should redirect to /profile", function (done) {
            request(app).delete("/recipe/CranberrySauce").expect("Location", "/profile").expect(302, done);
        });
    });

    describe('GET /recipe/edit/:recipeName', function () {
        it('should return a 302 response', function (done) {
            request(app).get('/recipe/edit/CranberrySauce').expect(302, done);
        });
    });
    describe('GET /recipe/parsed/:recipeName', function () {
        it('should return a 302 response', function (done) {
            request(app).get('/recipe/parsed/CranberrySauce').expect(302, done);
        });
    });
})

require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('./config/ppConfig');
const isLoggedIn = require('./middleware/isLoggedIn');
const db = require('./models');
const methodOverride = require('method-override');


// environment variables
SECRET_SESSION = process.env.SECRET_SESSION;

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);
app.use(methodOverride('_method'));


app.use(flash());            // flash middleware

app.use(session({
  secret: SECRET_SESSION,    // What we actually will be giving the user on our site as a session cookie
  resave: false,             // Save the session even if it's modified, make this false
  saveUninitialized: true    // If we have a new session, we save it, therefore making that true
}));

// add passport
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

app.get('/', (req, res) => {
  res.redirect('profile');
})

app.use('/auth', require('./controllers/auth'));
app.use('/recipe', require('./controllers/recipe'));

// Add this below /auth controllers
app.get('/profile', isLoggedIn, async (req, res) => {
  try {
    const { id, name, email } = req.user.get();
    const userRecipes = await db.recipe.findAll({
      where: {
        userId: id
      }
    })
    res.render('profile', { id, name, email, userRecipes });
  } catch (error) {
    res.status(500).send('error occurred');
  }
});

app.use((req, res, next) => {
  res.status(404).render('404', { message: 'Nothing to cook here unfortunately' });
});

app.get('/404', (req, res) => {
  res.send('404 Not Found').render('404', { message: 'Nothing to cook here unfortunately' });
});


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${PORT} 🎧`);
});

module.exports = server;

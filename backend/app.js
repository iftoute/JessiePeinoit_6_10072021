// import du framework express
const express = require('express');

//import de body-parser pour analyser les requêtes
const bodyParser = require('body-parser');

// import de mongoose qui définit le schema des objets
const mongoose = require('mongoose');

// import de path qui permet d'accéder au chemin du système de fichier
const path = require('path');

// import de helmet pour la protection des en-têtes HTTP
const helmet = require('helmet');

// import de dotenv pour cacher les données
const dotenv = require('dotenv').config(); 

// import des routers sauces et user
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

// Connexion à MongoDB
mongoose.connect(`${process.env.MONGOOSE_CONNECT}`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// création de l'application express
const app = express();

// middleware CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// transforme le corps de la requête en objet json
app.use(bodyParser.json());

// permet de configurer les en-têtes HTTP de manière sécurisée
app.use(helmet()); 

// permet d'accéder à la route pour les images
app.use('/images', express.static(path.join(__dirname, 'images')));

// permet d'acc"der aux routes pour les sauces
app.use('/api/sauces', saucesRoutes);

// permet d'acc"der aux routes pour les utilisateurs
app.use('/api/auth', userRoutes);

// export de l'application
module.exports = app;
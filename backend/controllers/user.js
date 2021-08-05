// LOGIQUE DES ROUTES D'AUTHENTIFICATION \\

const bcrypt = require('bcrypt');

// import dde jsonwebtoken pour créer des tokens et les vérifier
const jwt = require('jsonwebtoken');

// import du modèle de données pour un utilisateur
const User = require('../models/User');

const passwordValidator = require('password-validator');

// création du schéma de validation du mot de passe
const schemaPassword = new passwordValidator();

// schéma du mot de passe utilisateur
schemaPassword
.is().min(8)                                    // Minimum 8 caractères
.is().max(20)                                   // Maximum 20 caractères
.has().uppercase()                              // Doit avoir une majuscule
.has().lowercase()                              // Doit avoir une minuscule
.has().digits(2)                                // Doit avoir au moins 2 chiffres
.has().symbols(1)                               // Doit avoir nu caractère spécial
.has().not().spaces();                          // Ne doit pas inclure d'espace

// création d'un nouvel utilisateur
exports.signup = (req, res, next) => {
  // Si le mot de passe est conforme, il sera hashé pour être enregistré dans la base de données
  if (schemaPassword.validate(req.body.password)) {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
  } else {
      throw 'Le mot de passe doit contenir entre 8 et 20 caractères dont au moins une majuscule, une minusucle, deux chiffres et un caractère spécial';
  }
};

// connexion d'un utilisateur déjà inscrit
exports.login = (req, res, next) => {
    // recherche le user dans la base de donnée qui correspond à l'adresse mail de la requête
    User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      // si le user est trouvé, le mote de passe entré par l'utilisateur est comparé avec celui enregistré dans la base de données
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
              )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
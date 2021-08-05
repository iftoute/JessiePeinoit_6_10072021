const express = require('express');

// création du router
const router = express.Router();

// import du controller user
const userCtrl = require('../controllers/user');

// route post pour créer un nouveau compte utilisateur
router.post('/signup', userCtrl.signup);

// Route post pour se connecter à un compte utilisateur
router.post('/login', userCtrl.login);

// export du router
module.exports = router;
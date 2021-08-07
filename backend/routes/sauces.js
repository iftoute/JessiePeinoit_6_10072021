// import d'express
const express = require('express');

// création du router
const router = express.Router();

// import du middeleware d'authentification
const auth = require('../middleware/auth');

// import du middleware multer
const multer = require('../middleware/multer-config');

// import du controller sauces
const saucesCtrl = require('../controllers/sauces');

// route post pour créer une sauce
router.post('/', auth, multer, saucesCtrl.createSauce);

// route post pour liker ou disliker une sauce
router.post('/:id/like', auth, saucesCtrl.likeSauce);

// route pour afficher toutes les sauces
router.get('/', auth, saucesCtrl.getAllSauces);

// route pour afficher une sauce
router.get('/:id', auth, saucesCtrl.getOneSauce);

// route pour modifier une sauce
router.put('/:id', auth, multer, saucesCtrl.modifySauce);

// route pour supprimer une sauce
router.delete('/:id', auth, saucesCtrl.deleteSauce);

// export du router
module.exports = router;


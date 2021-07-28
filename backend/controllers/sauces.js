// LOGIQUE DES REQUÊTES [C.R.U.D] \\
//*********************************\\

const Sauce = require('../models/Sauce');
const fs = require('fs');

// POST \\
//******\\
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes : 0,
    dislikes : 0,
    usersLiked : [],
    usersDisliked : [],
    });
    sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée' }))
    .catch(error => res.status(400).json({ error}));
  };

  
exports.likeSauce = (req, res, next) => {   
  Sauce.findOne({_id: req.params.id})
  .then(sauce => { 
    switch (req.body.like) {
      
      case 1 : // le user like la sauce
        if (!sauce.usersLiked.includes(req.body.userId)) {  //on vérifie si le user n'a pas déjà liké la sauce
          Sauce.updateOne({_id: req.params.id},
            // on incremente le like et on push le userId dans la table usersLiked 
            {$inc: {likes: 1}, 
            $push: {usersLiked: req.body.userId}, _id: req.params.id})
          .then(() => res.status(201).json({ message: 'Like ajouté' }))
          .catch(error => res.status(400).json({error}));
        } 
          break;

      case -1 : // le user dislike la sauce 
        if (!sauce.usersDisliked.includes(req.body.userId)) {  //on vérifie si le user n'a pas déjà Disliké la sauce
          Sauce.updateOne({_id: req.params.id}, 
            // on incremente le Dislike et on push le userId dans la table usersDisLiked
            {$inc: {dislikes: 1}, 
            $push: {usersDisliked: req.body.userId}, _id: req.params.id})
          .then(() => res.status(201).json({message: 'DisLike ajouté'}))
          .catch(error => res.status(400).json({error}));
        }
          break;
       
      case 0 : // le user a déjà réagi
        if (sauce.usersLiked.includes(req.body.userId)) {  //on vérifie si le user n'a pas déjà liké la sauce
          Sauce.updateOne({_id: req.params.id}, 
          // on retire le like et le usersId de la table usersLiked
            {$inc: {likes: -1}, 
            $pull: {usersLiked: req.body.userId},_id: req.params.id})
          .then(()=> res.status(201).json({message: 'like annulé'}))
          .catch(error => res.status(400).json({error}));
        } else if (sauce.usersDisliked.includes(req.body.userId)){ //on vérifie si le user n'a pas déjà Disliké la sauce
          Sauce.updateOne({_id: req.params.id},
            // on retire le dislike et le usersId de la table usersDisliked
            {$inc: {Dislikes: -1}, 
            $pull: {usersDisliked: req.body.userId},_id: req.params.id})
          .then(()=> res.status(201).json({message: 'Dislike annulé'}))
          .catch(error => res.status(400).json({error}));
        } 
          break;
   
      default:
        throw("impossible, reéssayer plus tard !")  // on envoie l'exeption
      }
    })
    .catch(error => res.status(400).json({ error }));
  }


// PUT \\
//******\\
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
  {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
      .catch(error => res.status(400).json({ error }));
  };

// DELETE  \\
//**********\\
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// GET \\
//******\\
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
  .then(sauces => res.status(200).json(sauces))
  .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};


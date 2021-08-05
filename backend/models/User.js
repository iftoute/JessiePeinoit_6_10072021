// import de mongoose
const mongoose = require('mongoose');

// import du plugin validateur unique qui permet de ne pas avoir plusieurs utilisateurs avec la même adresse mail
const uniqueValidator = require('mongoose-unique-validator');

// modèle de données pour un utilisateur
const userSchema = mongoose.Schema({
    email : {type : String, required : true, unique: true},
    password : {type : String, required : true}
});

// application du plugin au modèle de données utilisateur
userSchema.plugin(uniqueValidator);

// export du modèle utilisateur
module.exports = mongoose.model('User', userSchema);
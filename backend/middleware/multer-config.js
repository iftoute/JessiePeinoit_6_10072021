// import de multer
const multer = require('multer');

// définition des extensions des fichiers images
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// configuration de multer pour gérer les fichiers entrants dans les requêtes HTTP
const storage = multer.diskStorage({
  // permet de stocker les images dans le dossier images
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  // permet de générer un nouveau nom de fichier image
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

// export du middleware multer
module.exports = multer({storage: storage}).single('image');
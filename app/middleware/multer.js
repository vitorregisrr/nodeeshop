const multer = require('multer'),
    { validationResul } = require('express-validator/check');
    fs = require('fs');

module.exports = (multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './app/public/images');
        },

        filename: (req, file, cb) => {
            cb(null, Date.now().toString() + '-' + file.originalname);

        }
    }),

    fileFilter: (req, file, cb) => {
        const acceptedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
        let accepted = false;
        acceptedTypes.forEach(t => {
            if (file.mimetype === t) {
                cb(null, true);
                accepted = true;
            }
        });

        if (!accepted) {
            cb(null, false);
        }
    }
}));
const multer = require('multer');
const { validationResult } = require('express-validator/check');

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
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(hasErrors);
            cb(null, false);
        }
        const acceptedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
        let accepted = false;
        acceptedTypes.forEach(t => {
            if (file.mimetype === t) {
                cb(null, true);
                accepted = true;
            }
        });

        if( !accepted ){
            cb(null, false);
        }
    }
}));

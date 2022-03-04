const multer = require('multer');


const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'uploads/images/')     
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}.${file.originalname.split('.')[1]}`)
    }
});

const validateFileType = (file, cb) => {
    const validMimetypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg', 'image/webp', 'image/bmp'];

    const isValidMimetype = validMimetypes.includes(file.mimetype);

    if (!isValidMimetype) {
        return cb(new Error('FILE_TYPE_NOT_ALLOWED'));
    }
    return cb(null, true);
}

const uploadImage = (req, res, next) => {
    const upload = multer({
        storage: storage,
        limits: {
            fileSize: 1000000,
            files: 1
        },
        fileFilter: (req, file, cb) => {
            validateFileType(file, cb);
        },
    }).single('urlImagen');

    upload(req, res, (err) => {
        console.log(err);
        if(err){
            if (err.message === 'FILE_TYPE_NOT_ALLOWED') {
                return res.status(422).json({
                    message: err.message,
                });
            } 
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(413).json({
                    message: err.code,
                });
            }
        }
        next();
    });
};

module.exports = {uploadImage};
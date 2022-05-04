const multer = require('multer');

const isTestEnv = process.env.NODE_ENV === 'test';

const moduleStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, isTestEnv ? 'uploads/tmp' : 'uploads/modules/images/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}.${file.originalname.split('.')[1]}`)
    }
});

const userStorage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, isTestEnv ? 'uploads/tmp' : 'uploads/users/images/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}.${file.originalname.split('.')[1]}`)
    }
});

const indicatorStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, isTestEnv ? 'uploads/tmp' : 'uploads/indicadores/images/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}.${file.originalname.split('.')[1]}`)
    }
})

const validateFileType = (file, cb) => {
    const validMimetypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg', 'image/webp', 'image/bmp'];

    const isValidMimetype = validMimetypes.includes(file.mimetype);

    if (!isValidMimetype) {
        return cb(new Error('FILE_TYPE_NOT_ALLOWED'));
    }
    return cb(null, true);
}

const uploadImage = (route) => (req, res, next) => {
    const upload = multer({
        storage:
            route === 'modulos'
                ? moduleStorage
                :
                route === 'indicadores'
                    ? indicatorStorage
                    :
                    userStorage,
        limits: {
            fileSize: 1000000,
            files: 1
        },
        fileFilter: (req, file, cb) => {
            validateFileType(file, cb);
        },
    }).single('urlImagen');

    upload(req, res, (err) => {
        if (err) {
            if (err.message === 'FILE_TYPE_NOT_ALLOWED') {
                return res.status(422).send(err.message);
            }
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(413).send(err.code);
            }
        }
        next();
    });
}


module.exports = { uploadImage };
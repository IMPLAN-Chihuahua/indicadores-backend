const multer = require('multer');


const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'uploads/images/')     
    },
    filename: (req, file, cb) => {
        cb(null, `${req.body.temaIndicador}.${file.originalname.split('.')[1]}`)
    }
});

const validateFileType = (file, cb) => {
    const validMimetypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg', 'image/webp', 'image/bmp'];

    const isValidMimetype = validMimetypes.includes(file.mimetype);

    if (isValidMimetype) {
        return cb(null, true);
    }else {
       return cb(new Error('Invalid mime type'));
    }
}


const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000
    },
    fileFilter: (req, file, cb) => {
        validateFileType(file, cb);
    },
}).single('urlImagen');


module.exports = {upload};
//upload.single('urlImagen'),

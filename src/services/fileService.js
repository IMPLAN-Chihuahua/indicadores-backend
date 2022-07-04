require('dotenv').config();
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const logger = require('../config/logger');

aws.config.update({
  secretAccessKey: process.env.S3_ACCESS_SECRET,
  accessKeyId: process.env.S3_ACCESS_KEY,
  region: 'us-east-2'
});
const s3 = new aws.S3();

const isProductionEnvironment = process.env.NODE_ENV === 'production';

const DESTINATIONS = {
  MODULOS: 'modulos',
  INDICADORES: 'indicadores',
  USUARIOS: 'usuarios'
}

const generateFileName = (file) => {
  return `${Date.now()}.${file.originalname.split('.')[1]}`;
};

const getDestination = (type) => {
  return true ? `uploads/${type}/` : 'uploads/tmp'
};

const moduleStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, getDestination(DESTINATIONS.MODULOS))
  },
  filename: (req, file, cb) => {
    cb(null, generateFileName(file))
  }
});

const userStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, getDestination(DESTINATIONS.USUARIOS))
  },
  filename: (req, file, cb) => {
    cb(null, generateFileName(file))
  }
});

const indicatorStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, getDestination(DESTINATIONS.INDICADORES))
  },
  filename: (req, file, cb) => {
    cb(null, generateFileName(file))
  }
});

const validateFileType = (file, cb) => {
  const validMIMETypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg', 'image/webp', 'image/bmp'];
  const isValidMimetype = validMIMETypes.includes(file.mimetype);
  if (!isValidMimetype) {
    return cb(new Error('FILE_TYPE_NOT_ALLOWED'));
  }
  return cb(null, true);
};

const getStorage = (route) => {
  if (isProductionEnvironment) {
    return multerS3()
  }
  switch (route) {
    case DESTINATIONS.MODULOS:
      return moduleStorage;
    case DESTINATIONS.INDICADORES:
      return indicatorStorage;
    case DESTINATIONS.USUARIOS:
      return userStorage;
    default:
      throw new Error('Invalid route')
  }
};


const upload = (destination) => {
  return multer({
    storage: multerS3({
      s3,
      bucket: 'indicadores-bucket-chihuahua',
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null, getDestination(destination) + generateFileName(file))
      }
    }),
    limits: {
      fileSize: 1024 * 1024 * 5,
      files: 1
    },
    fileFilter: (req, file, cb) => {
      validateFileType(file, cb);
    },
  }).single('urlImagen');
};

module.exports = { upload, DESTINATIONS }
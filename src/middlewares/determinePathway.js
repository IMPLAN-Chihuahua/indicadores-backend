const FRONT_PATH = 'front';
const SITE_PATH = 'site';
const FILE_PATH = 'file';

const determinePathway = (route) => (req, res, next) => {
  switch (route) {
    case FRONT_PATH:
      req.pathway = FRONT_PATH;
      next();
      break;
    case SITE_PATH:
      req.pathway = SITE_PATH;
      next();
      break;
    case FILE_PATH:
      req.pathway = FILE_PATH;
      next();
      break;
    default:
      throw new Error('Invalid pathway');
  }
}

module.exports = {
  determinePathway,
  FRONT_PATH,
  SITE_PATH,
  FILE_PATH
}
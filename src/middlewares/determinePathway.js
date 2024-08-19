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
};

const determineModel = (req, res, next) => {
  const model = req.baseUrl.split('/').slice(-1)[0];
  switch (model) {
    case 'indicadores':
      req.model = 'indicador';
      next();
      break;
    case 'usuarios':
      req.model = 'usuario';
      next();
      break;
    case 'temas':
      req.model = 'Tema';
      next();
      break;
    case 'dimensiones':
      req.model = 'dimension';
      next();
      break;
    default:
      return res.status(403).send('Este módulo no tiene petición general de información.');

  }
}


module.exports = {
  determinePathway,
  FRONT_PATH,
  SITE_PATH,
  FILE_PATH,
  determineModel,

}
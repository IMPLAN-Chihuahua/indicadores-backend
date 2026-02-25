require('dotenv').config();
const { S3Client } = require('@aws-sdk/client-s3')
const multer = require('multer');
const multerS3 = require('multer-s3');
const { Parser } = require("json2csv");
const Excel = require("exceljs");
const fs = require("fs");

const chromium = require('@sparticuz/chromium');
const puppeteerCore = require('puppeteer-core');
const puppeteerLocal = require("puppeteer");

const { numberWithCommas, returnUnit, returnFuente } = require("../utils/stringFormat");
const handlebars = require("handlebars");
const { footer } = require("../utils/footerImage");
const logger = require('../config/logger');

const MAX_IMAGE_SIZE = 1_048_576; // 1MB
const VALID_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/jpg',
  'image/gif', 'image/svg', 'image/webp', 'image/bmp'];

const s3 = new S3Client({
  credentials: {
    secretAccessKey: process.env.S3_ACCESS_SECRET,
    accessKeyId: process.env.S3_ACCESS_KEY,
  },
  region: process.env.S3_REGION
});

const DESTINATIONS = {
  TEMASS: 'temas', INDICADORES: 'indicadores', USUARIOS: 'usuarios', MAPAS: 'mapas', OBJETIVOS: 'objetivos',
}

const getUniqueName = (file) => `${Date.now().toString()}.${file.originalname.split('.')[1]}`;
const getPath = (type) => type ? `uploads/${type}/images/` : 'uploads/tmp';

const validateFileType = (file, cb) => {
  const isValidMimetype = VALID_IMAGE_MIME_TYPES.includes(file.mimetype);
  if (!isValidMimetype) return cb(new Error('FILE_TYPE_NOT_ALLOWED'));
  return cb(null, true);
};

const getDiskStorage = (destination) => {
  return multer.diskStorage({
    destination: (req, file, cb) => { cb(null, getPath(destination)) },
    filename: (req, file, cb) => { cb(null, getUniqueName(file)) }
  });
}

const getStorage = (destination) => {
  if (process.env.NODE_ENV === 'production') {
    return multerS3({
      s3,
      bucket: process.env.S3_INDICADORES_BUCKET,
      metadata: function (_, file, cb) { cb(null, { fieldName: file.fieldname }); },
      key: function (_, file, cb) {
        const fullpath = getPath(destination) + getUniqueName(file);
        logger.info(`Uploading file to S3 ${fullpath}`)
        cb(null, fullpath)
      }
    })
  } else {
    return getDiskStorage(destination)
  }
};

const upload = (destination) => {
  return multer({
    storage: getStorage(destination),
    limits: { fileSize: MAX_IMAGE_SIZE, files: 1 },
    fileFilter: (req, file, cb) => { validateFileType(file, cb); },
  }).single('urlImagen');
};

const generateCSV = (data) => {
  const json2csv = new Parser();
  return json2csv.parse(data);
};

const generateXLSX = (indicador) => {
  // Mantengo tu logica de Excel igual...
  let baseFile = "./src/templates/indicador.xlsx";
  let workBook = new Excel.Workbook();
  const fields = ['nombre', 'Tema', 'tendenciaActual', 'ultimoValorDisponible', 'medida', 'anioUltimoValorDisponible', 'cobertura', 'ecuacion', 'variables', 'historicos']
  return workBook.xlsx.readFile(baseFile).then(async () => {
    let workSheet = workBook.getWorksheet();
    let col = 1; let row = workSheet.getRow(2);
    for (const field of fields) {
      let initialRow = 2; let value = indicador[field];
      if (field === 'temas') { value = indicador[field][0]?.temaIndicador || 'NA'; }
      else if (field === 'medida') { value = indicador.unidadMedida; }
      else if (field === 'cobertura') { value = indicador.cobertura.tipo; }
      else if (field === 'ecuacion') {
        const formula = indicador?.formula?.dataValues;
        row.getCell(col++).value = formula?.ecuacion || 'NA';
        row.getCell(col++).value = formula?.descripcion || 'NA'; continue;
      } else if (field === 'variables') {
        const variables = indicador?.formula?.dataValues?.variables || [{}];
        for (const v of variables) {
          let innerRow = workSheet.getRow(initialRow++); let innerCol = col;
          innerRow.getCell(innerCol++).value = v?.nombre || 'NA';
          innerRow.getCell(innerCol++).value = v?.descripcion || 'NA';
          innerRow.getCell(innerCol++).value = v?.dato || 'NA'; innerRow.commit()
        } col += 3; continue;
      } else if (field === 'historicos') {
        const historicos = indicador?.historicos || [{}];
        for (const h of historicos) {
          let innerRow = workSheet.getRow(initialRow++); let innerCol = col;
          innerRow.getCell(innerCol++).value = h?.valor || 'NA';
          innerRow.getCell(innerCol++).value = h?.anio || 'NA';
          innerRow.getCell(innerCol++).value = h?.fuente || 'NA'; innerRow.commit()
        } col += 3; continue;
      }
      row.getCell(col).value = value || 'NA'; col++;
    }
    return await workBook.xlsx.writeBuffer();
  }).catch(err => { logger.error(err); throw err; });
};

const generatePDF = async (indicador) => {
  let browser;
  try {
    // 1. Ya NO procesamos nada externo. Todo el código de QuickChart se eliminó.

    if (process.env.NODE_ENV === 'production') {
      browser = await puppeteerCore.launch({
        args: chromium.args, defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(), headless: chromium.headless, ignoreHTTPSErrors: true,
      });
    } else {
      browser = await puppeteerLocal.launch({
        headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
      });
    }

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(30000); // Con 30s basta y sobra
    await page.setDefaultTimeout(30000);
    await page.setViewport({ width: 800, height: 800, deviceScaleFactor: 3 });

    // 2. Compilar HTML
    const templateHtml = fs.readFileSync("./src/templates/indicador.html", "utf8");

    // Registro de helpers (AÑADIMOS EL LIMPIADOR DE FÓRMULAS)
    handlebars.registerHelper('cleanFormula', (str) => {
      if (!str) return '';
      return str.replace(/\$\$/g, '').trim();
    });

    handlebars.registerHelper('isAscending', (str) => str === 'Ascendente');
    handlebars.registerHelper('notApplies', (str) => str === 'No aplica');
    handlebars.registerHelper('numberWithCommas', numberWithCommas);
    handlebars.registerHelper('toString', (num) => num?.toString());
    handlebars.registerHelper('containsNA', (str) => str?.includes("NA") ? "NA" : str);
    handlebars.registerHelper('valueIsNull', (str) => str === null);
    handlebars.registerHelper('hasItems', (arr) => arr.length > 0);
    handlebars.registerHelper('hasFormula', (formula) => typeof formula !== 'undefined' && formula !== null);
    handlebars.registerHelper('calculateTopPx', (objetivo) => {
      const top = (parseInt(objetivo.id) - 1) * 35;
      return `<div class="tematica__id" style="top: ${top}px; background-color: ${objetivo.color};">O${objetivo.id}</div>`;
    });
    handlebars.registerHelper('isFormula', (formula) => formula.isFormula == 'SI');
    handlebars.registerHelper('hasValue', (value) => (value.trim().length === 0));
    handlebars.registerHelper('returnDato', (unidadMedida) => returnUnit(unidadMedida));
    handlebars.registerHelper('returnFuente', (fuente) => returnFuente(fuente));

    const template = handlebars.compile(templateHtml);

    // Cargamos logo local
    let logoBase64 = "";
    try {
      const logoBuffer = fs.readFileSync("./src/templates/small-logo.png");
      logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
    } catch (err) { console.error("No se encontró logo local", err); }

    const html = template({ ...indicador, logoBase64 }, { allowProtoPropertiesByDefault: true });

    // 3. Inyectamos usando DOMCONTENTLOADED (Rapidísimo, no espera a red)
    await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 30000 });

    const date = new Date();
    const [month, day, year] = [date.getMonth() + 1, date.getDate(), date.getFullYear()];

    // 4. Generar PDF
    const pdfBuffer = await page.pdf({
      format: "letter", displayHeaderFooter: true, printBackground: true, headerTemplate: '',
      footerTemplate: `
      <div style="width: 100%; font-size: 7px; padding: 5px; position: relative;">
          <div style="position: absolute; left: 10px; bottom: 0; font-size: 8px; color: gray;">Generado el ${month}/${day}/${year}</div>
          <div style="text-align: center; margin-top: 220px;">${footer}</div>
          <div style="position: absolute; right: 10px; bottom: 0; font-size: 8px; color: gray;">Página <span class="pageNumber"></span> de <span class="totalPages"></span></div>
      </div>`,
      margin: { bottom: '70px' },
    });

    await browser.close();
    return pdfBuffer;

  } catch (error) {
    console.error('Error en generatePDF:', error);
    if (browser) await browser.close().catch(e => console.error(e));
    throw new Error(`Error generando PDF: ${error.message}`);
  }
};

module.exports = { upload, DESTINATIONS, generateCSV, generateXLSX, generatePDF }
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
const VALID_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg', 'image/webp', 'image/bmp'];

const s3 = new S3Client({
  credentials: { secretAccessKey: process.env.S3_ACCESS_SECRET, accessKeyId: process.env.S3_ACCESS_KEY },
  region: process.env.S3_REGION
});

const DESTINATIONS = { TEMASS: 'temas', INDICADORES: 'indicadores', USUARIOS: 'usuarios', MAPAS: 'mapas', OBJETIVOS: 'objetivos' }

let cachedLogoBase64 = "";
try {
  const logoBuffer = fs.readFileSync("./src/templates/small-logo.png");
  cachedLogoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
} catch (err) {
  logger.error("No se encontró logo local", err);
}

handlebars.registerHelper('cleanFormula', (str) => str ? str.replace(/\$\$/g, '').trim() : '');
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
handlebars.registerHelper('isAscending', (str) => str && str.toString().toUpperCase() === 'ASCENDENTE');
handlebars.registerHelper('isDescending', (str) => str && str.toString().toUpperCase() === 'DESCENDENTE');
handlebars.registerHelper('notApplies', (str) => !str || str.toString().toUpperCase() === 'NO APLICA' || str.toString().toUpperCase() === 'NA');

const templateHtml = fs.readFileSync("./src/templates/indicador.html", "utf8");
const compiledTemplate = handlebars.compile(templateHtml);

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

const generateXLSX = async (indicador) => {
  try {
    const workBook = new Excel.Workbook();
    workBook.creator = 'IMPLAN Chihuahua';
    workBook.created = new Date();

    const sheet = workBook.addWorksheet('Ficha Técnica', {
      views: [{ showGridLines: false }]
    });

    sheet.getColumn('A').width = 25;
    sheet.getColumn('B').width = 20;
    sheet.getColumn('C').width = 20;
    sheet.getColumn('D').width = 20;
    sheet.getColumn('E').width = 30;

    const titleStyle = {
      font: { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFFFFF' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1A202C' } },
      alignment: { vertical: 'middle', horizontal: 'center' }
    };

    const sectionStyle = {
      font: { name: 'Arial', size: 12, bold: true, color: { argb: 'FFFFFFFF' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2D3748' } },
      alignment: { vertical: 'middle', horizontal: 'left', indent: 1 }
    };

    const labelStyle = {
      font: { name: 'Arial', size: 11, bold: true, color: { argb: 'FF1A202C' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7FAFC' } },
      alignment: { vertical: 'top', horizontal: 'right', wrapText: true },
      border: { bottom: { style: 'thin', color: { argb: 'FFCBD5E0' } } }
    };

    const valueStyle = {
      font: { name: 'Arial', size: 11, color: { argb: 'FF2D3748' } },
      alignment: { vertical: 'top', horizontal: 'left', wrapText: true },
      border: { bottom: { style: 'thin', color: { argb: 'FFCBD5E0' } } }
    };

    const tableHeaderStyle = {
      font: { name: 'Arial', size: 11, bold: true, color: { argb: 'FF1A202C' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } },
      alignment: { vertical: 'middle', horizontal: 'center' },
      border: { bottom: { style: 'medium', color: { argb: 'FF2D3748' } } }
    };

    const addKeyValue = (rowNum, label, value, mergeCols) => {
      const row = sheet.getRow(rowNum);
      row.getCell('A').value = label; row.getCell('A').style = labelStyle;
      row.getCell('B').value = value || 'NA'; row.getCell('B').style = valueStyle;
      if (mergeCols) {
        sheet.mergeCells(`B${rowNum}:E${rowNum}`);
        for (let i = 3; i <= 5; i++) row.getCell(i).style = valueStyle;
      }
    };

    sheet.mergeCells('A1:E2');
    const titleCell = sheet.getCell('A1');
    titleCell.value = 'FICHA TÉCNICA DEL INDICADOR';
    titleCell.style = titleStyle;

    sheet.mergeCells('A4:E4');
    const sec1 = sheet.getCell('A4');
    sec1.value = 'INFORMACIÓN GENERAL';
    sec1.style = sectionStyle;

    const tema = indicador.temas?.[0]?.temaIndicador || 'NA';
    const ods = indicador.ods?.titulo || 'NA';
    const cobertura = indicador.cobertura?.tipo || 'NA';
    const objetivo = indicador.objetivos?.[0]?.titulo || 'NA';

    addKeyValue(5, 'Nombre del Indicador:', indicador.nombre, true);
    addKeyValue(6, 'Tema de Interés:', tema, true);
    addKeyValue(7, 'Objetivo PDU2040:', objetivo, true);
    addKeyValue(8, 'ODS:', ods, true);
    addKeyValue(9, 'Cobertura Geográfica:', cobertura, true);
    addKeyValue(10, 'Unidad de Medida:', indicador.unidadMedida, true);
    addKeyValue(11, 'Tendencia Actual:', indicador.tendenciaActual, true);
    addKeyValue(12, 'Explicación rápida:', indicador.elif, true);

    const r13 = sheet.getRow(13);
    r13.getCell('A').value = 'Último Valor Disponible:'; r13.getCell('A').style = labelStyle;
    r13.getCell('B').value = `${indicador.ultimoValorDisponible || 'NA'} ${indicador.adornment || ''}`; r13.getCell('B').style = { ...valueStyle, font: { bold: true, color: { argb: 'FF1A202C' } } };
    r13.getCell('C').value = 'Año de Referencia:'; r13.getCell('C').style = labelStyle;
    r13.getCell('D').value = indicador.anioUltimoValorDisponible || 'NA'; r13.getCell('D').style = valueStyle;
    r13.getCell('E').style = valueStyle;
    sheet.mergeCells('D13:E13');

    let currentRow = 15;

    const formulaData = indicador.formula?.dataValues || indicador.formula || null;
    if (formulaData && Object.keys(formulaData).length > 0) {
      sheet.mergeCells(`A${currentRow}:E${currentRow}`);
      sheet.getCell(`A${currentRow}`).value = 'FÓRMULA DE CÁLCULO / ORIGEN';
      sheet.getCell(`A${currentRow}`).style = sectionStyle;
      currentRow++;

      addKeyValue(currentRow++, 'Método de cálculo:', formulaData.ecuacion, true);
      addKeyValue(currentRow++, 'Descripción:', formulaData.descripcion, true);

      const variables = formulaData.variables || [];
      if (variables.length > 0) {
        currentRow++;
        const vh = sheet.getRow(currentRow);
        vh.getCell('A').value = 'Variable'; vh.getCell('A').style = tableHeaderStyle;
        vh.getCell('B').value = 'Descripción'; vh.getCell('B').style = tableHeaderStyle;
        sheet.mergeCells(`B${currentRow}:D${currentRow}`);
        vh.getCell('C').style = tableHeaderStyle; vh.getCell('D').style = tableHeaderStyle;
        vh.getCell('E').value = 'Valor'; vh.getCell('E').style = tableHeaderStyle;
        currentRow++;

        for (const v of variables) {
          const vr = sheet.getRow(currentRow);
          vr.getCell('A').value = v.nombre; vr.getCell('A').style = valueStyle;
          vr.getCell('B').value = v.descripcion; vr.getCell('B').style = valueStyle;
          sheet.mergeCells(`B${currentRow}:D${currentRow}`);
          vr.getCell('C').style = valueStyle; vr.getCell('D').style = valueStyle;
          vr.getCell('E').value = v.dato || 'NA'; vr.getCell('E').style = valueStyle;
          currentRow++;
        }
      }
    }

    const historicos = indicador.historicos || [];
    if (historicos.length > 0) {
      currentRow++;
      sheet.mergeCells(`A${currentRow}:E${currentRow}`);
      sheet.getCell(`A${currentRow}`).value = 'REGISTRO HISTÓRICO';
      sheet.getCell(`A${currentRow}`).style = sectionStyle;
      currentRow++;

      const hh = sheet.getRow(currentRow);
      hh.getCell('A').value = 'Año'; hh.getCell('A').style = tableHeaderStyle;
      hh.getCell('B').value = 'Valor'; hh.getCell('B').style = tableHeaderStyle;
      hh.getCell('C').value = 'Fuente'; hh.getCell('C').style = tableHeaderStyle;
      sheet.mergeCells(`C${currentRow}:E${currentRow}`);
      hh.getCell('D').style = tableHeaderStyle; hh.getCell('E').style = tableHeaderStyle;
      currentRow++;

      for (const h of historicos) {
        const hr = sheet.getRow(currentRow);
        hr.getCell('A').value = h.anio; hr.getCell('A').style = valueStyle;
        hr.getCell('B').value = h.valor; hr.getCell('B').style = valueStyle;
        hr.getCell('C').value = h.fuente; hr.getCell('C').style = valueStyle;
        sheet.mergeCells(`C${currentRow}:E${currentRow}`);
        hr.getCell('D').style = valueStyle; hr.getCell('E').style = valueStyle;
        currentRow++;
      }
    }

    return await workBook.xlsx.writeBuffer();

  } catch (err) {
    logger.error("Error generando Excel:", err);
    throw err;
  }
};

const generatePDF = async (indicador) => {
  let browser;
  try {
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
    await page.setDefaultNavigationTimeout(30000);
    await page.setDefaultTimeout(30000);
    await page.setViewport({ width: 800, height: 800, deviceScaleFactor: 1 });

    const html = compiledTemplate({ ...indicador, logoBase64: cachedLogoBase64 }, { allowProtoPropertiesByDefault: true });

    await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 30000 });

    const date = new Date();
    const [month, day, year] = [date.getMonth() + 1, date.getDate(), date.getFullYear()];

    const pdfBuffer = await page.pdf({
      format: "letter", displayHeaderFooter: true, printBackground: true, headerTemplate: '',
      footerTemplate: `
      <div style="width: 100%; font-size: 7px; padding: 5px; position: relative;">
          <div style="position: absolute; left: 10px; bottom: 0; font-size: 8px; color: gray;">Generado el ${month}/${day}/${year}</div>
          <div style="text-align: center; margin-top: 220px;">${footer}</div>
          <div style="position: absolute; right: 10px; bottom: 0; font-size: 8px; color: gray;">Página <span class="pageNumber"></span> de <span class="totalPages"></span></div>
      </div>`,
      margin: { top: '80px', bottom: '70px' },
    });

    await browser.close();
    return pdfBuffer;

  } catch (error) {
    logger.error('Error en generatePDF:', error);
    if (browser) await browser.close().catch(e => logger.error(e));
    throw new Error(`Error generando PDF: ${error.message}`);
  }
};

module.exports = { upload, DESTINATIONS, generateCSV, generateXLSX, generatePDF }
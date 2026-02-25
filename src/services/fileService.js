require('dotenv').config();
const { S3Client } = require('@aws-sdk/client-s3')
const multer = require('multer');
const multerS3 = require('multer-s3');
const { Parser } = require("json2csv");
const Excel = require("exceljs");
const fs = require("fs");

// IMPORTACIONES CORREGIDAS PARA PUPPETEER
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
  TEMASS: 'temas',
  INDICADORES: 'indicadores',
  USUARIOS: 'usuarios',
  MAPAS: 'mapas',
  OBJETIVOS: 'objetivos',
}

const getUniqueName = (file) => `${Date.now().toString()}.${file.originalname.split('.')[1]}`;

const getPath = (type) => type ? `uploads/${type}/images/` : 'uploads/tmp';

const validateFileType = (file, cb) => {
  const isValidMimetype = VALID_IMAGE_MIME_TYPES.includes(file.mimetype);
  if (!isValidMimetype) {
    return cb(new Error('FILE_TYPE_NOT_ALLOWED'));
  }
  return cb(null, true);
};

const getDiskStorage = (destination) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, getPath(destination))
    },
    filename: (req, file, cb) => {
      cb(null, getUniqueName(file))
    }
  });
}

const getStorage = (destination) => {
  if (process.env.NODE_ENV === 'production') {
    return multerS3({
      s3,
      bucket: process.env.S3_INDICADORES_BUCKET,
      metadata: function (_, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
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
    storage: getStorage(destination), // Corrección: Usar getStorage en vez de getDiskStorage directo
    limits: {
      fileSize: MAX_IMAGE_SIZE,
      files: 1
    },
    fileFilter: (req, file, cb) => {
      validateFileType(file, cb);
    },
  }).single('urlImagen');
};

const generateCSV = (data) => {
  const json2csv = new Parser();
  const csv = json2csv.parse(data);
  return csv;
};

const generateXLSX = (indicador) => {
  let baseFile = "./src/templates/indicador.xlsx";
  let workBook = new Excel.Workbook();
  const fields = ['nombre', 'Tema', 'tendenciaActual', 'ultimoValorDisponible',
    'medida', 'anioUltimoValorDisponible', 'cobertura', 'ecuacion', 'variables', 'historicos']
  return workBook.xlsx
    .readFile(baseFile)
    .then(async () => {
      let workSheet = workBook.getWorksheet();
      let col = 1;
      let row = workSheet.getRow(2);
      for (const field of fields) {
        let initialRow = 2;
        let value = indicador[field];
        if (field === 'temas') {
          value = indicador[field][0]?.temaIndicador || 'NA';
        } else if (field === 'medida') {
          value = indicador.unidadMedida;
        } else if (field === 'cobertura') {
          value = indicador.cobertura.tipo;
        } else if (field === 'ecuacion') {
          const formula = indicador?.formula?.dataValues;
          row.getCell(col++).value = formula?.ecuacion || 'NA';
          row.getCell(col++).value = formula?.descripcion || 'NA';
          continue;
        } else if (field === 'variables') {
          const variables = indicador?.formula?.dataValues?.variables || [{}];
          for (const v of variables) {
            let innerRow = workSheet.getRow(initialRow++);
            let innerCol = col;
            innerRow.getCell(innerCol++).value = v?.nombre || 'NA';
            innerRow.getCell(innerCol++).value = v?.descripcion || 'NA';
            innerRow.getCell(innerCol++).value = v?.dato || 'NA';
            innerRow.commit()
          }
          col += 3;
          continue;
        } else if (field === 'historicos') {
          const historicos = indicador?.historicos || [{}];
          for (const h of historicos) {
            let innerRow = workSheet.getRow(initialRow++);
            let innerCol = col;
            innerRow.getCell(innerCol++).value = h?.valor || 'NA';
            innerRow.getCell(innerCol++).value = h?.anio || 'NA';
            innerRow.getCell(innerCol++).value = h?.fuente || 'NA';
            innerRow.commit()
          }
          col += 3;
          continue;
        }
        row.getCell(col).value = value || 'NA';
        col++;
      }
      return await workBook.xlsx.writeBuffer();
    })
    .catch(err => {
      logger.error(err)
      throw err;
    });
};

const generatePDF = async (indicador) => {
  let browser;

  try {
    // 1. Preparar la imagen de la gráfica en Base64 ANTES de abrir el navegador
    let chartImageBase64 = null;
    if (indicador.historicos && indicador.historicos.length > 0) {
      const historicosSorted = [...indicador.historicos].sort((a, b) => a.anio - b.anio);
      const years = historicosSorted.map(h => h.anio);
      const values = historicosSorted.map(h => h.valor);

      years.push(indicador.anioUltimoValorDisponible);
      values.push(indicador.ultimoValorDisponible);

      const chartConfig = {
        type: "bar",
        data: {
          labels: years,
          datasets: [{
            label: 'Valores históricos',
            data: values,
            backgroundColor: ['#D12D6A', '#C62C6B', '#A6296C', '#9C286D', '#91276E', '#662270'].reverse(),
          }],
        },
        options: {
          scales: {
            yAxes: [{ ticks: { beginAtZero: true } }]
          }
        }
      };

      const chartUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}&w=800&h=400&devicePixelRatio=2`;

      try {
        // Descargamos la imagen usando el fetch nativo de Node y la convertimos a Base64
        const response = await fetch(chartUrl);
        if (response.ok) { // <- Validamos que QuickChart respondió bien
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          chartImageBase64 = `data:image/png;base64,${buffer.toString('base64')}`;
        } else {
          console.error("QuickChart falló con status:", response.status);
        }
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        chartImageBase64 = `data:image/png;base64,${buffer.toString('base64')}`;
      } catch (err) {
        console.error("Error al descargar la gráfica de QuickChart:", err);
      }
    }

    const getLatexBase64 = async (latex) => {
      try {
        if (!latex) return null;
        // Limpiamos los $$ por si el usuario los guarda en la base de datos
        const cleanLatex = latex.replace(/\$\$/g, '').trim();
        const url = `https://quickchart.io/latex?c=${encodeURIComponent(cleanLatex)}&b=white&color=black&f=20px`;
        const res = await fetch(url);
        if (!res.ok) return null;
        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return `data:image/png;base64,${buffer.toString('base64')}`;
      } catch (err) {
        console.error("Error obteniendo imagen LaTeX:", err);
        return null;
      }
    };

    if (indicador.formula) {
      indicador.formula.ecuacionBase64 = await getLatexBase64(indicador.formula.ecuacion);
      if (indicador.formula.variables && indicador.formula.variables.length > 0) {
        for (let v of indicador.formula.variables) {
          v.nombreBase64 = await getLatexBase64(v.nombre);
        }
      }
    }

    // 2. Configurar el navegador dependiendo del entorno
    if (process.env.NODE_ENV === 'production') {
      browser = await puppeteerCore.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
      });
    } else {
      browser = await puppeteerLocal.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu'
        ],
      });
    }

    const page = await browser.newPage();

    // // await page.setRequestInterception(true);
    // page.on('request', (req) => {
    //   const isDataUrl = req.url().startsWith('data:');
    //   if (req.isInterceptResolutionHandled()) return;
    //   if (isDataUrl) {
    //     req.continue(); // Permitimos imagenes Base64 (nuestra gráfica)
    //   } else {
    //     req.abort(); // Bloqueamos todo lo externo
    //   }
    // });

    await page.setDefaultNavigationTimeout(60000);
    await page.setDefaultTimeout(60000);
    await page.setViewport({ width: 800, height: 800, deviceScaleFactor: 3 });

    // 3. Compilar HTML con Handlebars
    const templateHtml = fs.readFileSync("./src/templates/indicador.html", "utf8");

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
      return `
      <style>
        .tematica__id {
          width: 60px;
          height: 30px;
          background: ${objetivo.color};
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
          font-size: 12px;
          position: absolute;
          top: ${top}px;
        }
      </style>
      <div class="tematica__id">
        objetivo ${objetivo.id}
      </div>   
      `;
    });
    handlebars.registerHelper('isFormula', (formula) => formula.isFormula == 'SI');
    handlebars.registerHelper('hasValue', (value) => (value.trim().length === 0));
    handlebars.registerHelper('returnDato', (unidadMedida) => returnUnit(unidadMedida));
    handlebars.registerHelper('returnFuente', (fuente) => returnFuente(fuente));

    const template = handlebars.compile(templateHtml);
    let logoBase64 = "";
    try {
      const logoBuffer = fs.readFileSync("./src/templates/small-logo.png");
      logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
    } catch (err) {
      console.error("No se encontró el logo local", err);
    }
    // Inyectamos chartImageBase64 a la plantilla
    const html = template({ ...indicador, chartImageBase64, logoBase64 }, { allowProtoPropertiesByDefault: true });

    // 4. Inyectar HTML al navegador usando solo 'load' para evitar bloqueos de red
    await page.setContent(html, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36WAIT_UNTIL=load");

    const date = new Date();
    const [month, day, year] = [date.getMonth() + 1, date.getDate(), date.getFullYear()];

    // 5. Generar PDF
    const pdfBuffer = await page.pdf({
      format: "letter",
      displayHeaderFooter: true,
      printBackground: true,
      headerTemplate: '',
      footerTemplate: `
    <div style="width: 100%; font-size: 7px; padding: 5px; position: relative;">
        <div style="position: absolute; left: 10px; bottom: 0; font-size: 8px; color: gray;">
          Generado el ${month}/${day}/${year}
        </div>
        <div style="text-align: center; margin-top: 220px;">
          ${footer}
        </div>
        <div style="position: absolute; right: 10px; bottom: 0; font-size: 8px; color: gray;">
          Página <span class="pageNumber"></span> de <span class="totalPages"></span>
        </div>
    </div>`,
      margin: { bottom: '70px' },
    });

    await browser.close();
    return pdfBuffer;

  } catch (error) {
    console.error('Error en generatePDF:', error);
    if (browser) {
      await browser.close().catch(closeError => {
        console.error('Error cerrando browser:', closeError);
      });
    }
    throw new Error(`Error generando PDF: ${error.message}`);
  }
};

module.exports = {
  upload,
  DESTINATIONS,
  generateCSV,
  generateXLSX,
  generatePDF,
}
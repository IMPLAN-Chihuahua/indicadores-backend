const { Parser } = require("json2csv");
const Excel = require("exceljs");
const fs = require("fs");
const puppeteer = require("puppeteer");
const { numberWithCommas } = require("../utils/stringFormat");
const handlebars = require("handlebars");

const generateCSV = (data) => {
  const json2csv = new Parser();
  const csv = json2csv.parse(data);
  return csv;
};

const UNIDAD_ID = 2;
const COBERTURA_ID = 3;

const getFromCatalogos = (catalogos = [], id) => {
  return catalogos.find(catalogo => catalogo?.dataValues?.idCatalogo === id)
}

const generateXLSX = (indicador) => {
  let baseFile = "./src/templates/indicador.xlsx";
  let workBook = new Excel.Workbook();
  const fields = ['nombre', 'modulo', 'tendenciaActual', 'ultimoValorDisponible',
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
        if (field === 'modulo') {
          value = indicador[field].dataValues.temaIndicador;
        } else if (field === 'medida') {
          value = getFromCatalogos(indicador['catalogos'], UNIDAD_ID).dataValues.nombre;
        } else if (field === 'cobertura') {
          value = getFromCatalogos(indicador['catalogos'], COBERTURA_ID).dataValues.nombre;
        } else if (field === 'ecuacion') {
          const formula = indicador?.formula?.dataValues;
          row.getCell(col++).value = formula?.ecuacion || 'NA';
          row.getCell(col++).value = formula?.descripcion || 'NA';
          continue;
        } else if (field === 'variables') {
          const variables = indicador?.formula?.dataValues.variables || [{}];
          for (const v of variables) {
            let innerRow = workSheet.getRow(initialRow++);
            let innerCol = col;
            innerRow.getCell(innerCol++).value = v?.nombre || 'NA';
            innerRow.getCell(innerCol++).value = v?.nombreAtributo || 'NA';
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
          col +=3;
          continue;
        }
        row.getCell(col).value = value || 'NA';
        col++;
      }
      return await workBook.xlsx.writeBuffer();;
    })
    .catch(err => {
      throw err;
    });
};

const generatePDF = async (data) => {
  let indicador = data;
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: '/usr/bin/chromium-browser'
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 800, deviceScaleFactor: 3 });
  const templateHtml = fs.readFileSync("./src/templates/indicador.html", "utf8");
  handlebars.registerHelper('isAscending', (str) => str === 'ASCENDENTE');
  handlebars.registerHelper('numberWithCommas', numberWithCommas);
  handlebars.registerHelper('isOds', (int) => int === 1);
  handlebars.registerHelper('isCobertura', (int) => int === 3);
  handlebars.registerHelper('isUnidad', (int) => int === 2);
  handlebars.registerHelper('toString', (int) => int?.toString());
  handlebars.registerHelper('containsNA', (str) => str?.includes("NA") ? "NA" : str);
  handlebars.registerHelper('valueIsNull', (str) => str === null);
  handlebars.registerHelper('hasHistoricos', (historicos) => historicos.length > 0);

  const template = handlebars.compile(templateHtml);

  const html = template(indicador, { allowProtoPropertiesByDefault: true });
  await page.setContent(html, {
    waitUntil: "networkidle0",
  });

  if (indicador.historicos.length > 0) {
    const years = indicador?.historicos.map((elem) => elem.anio);
    const values = indicador?.historicos.map((elem) => elem.valor);
    years.push(indicador.anioUltimoValorDisponible)
    values.push(indicador.ultimoValorDisponible);

    await page.evaluate(
      (years, values) => {
        const ctx = document.getElementById("myChart").getContext("2d");
        new Chart(ctx, {
          type: "bar",
          data: {
            labels: years,
            datasets: [
              {
                label: 'Valores históricos',
                data: values,
                backgroundColor: "#204c5a",
                barPercentage: 0.8,
              },
            ],
          },
          options: {
            animation: {
              duration: 0,
            },
          },
        });
      },
      years,
      values,
    ).catch((err) => {
      throw err;
    });
  }

  page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36WAIT_UNTIL=load"
  );

  const pdf = await page.pdf({
    format: 'A3',
    displayHeaderFooter: true,
    printBackground: true,
    headerTemplate: '',
    footerTemplate: `
    <div style="width: 100%; font-size: 10px;
        padding: 5px 5px 0; position: relative;">
        <div style="text-align: center">página <span class="pageNumber"></span> de <span class="totalPages"></span></div>
    </div>`,
    margin: { bottom: '70px' },
  });

  await browser.close();
  return pdf;
};

module.exports = {
  generateCSV,
  generateXLSX,
  generatePDF,
};

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

const UNIDAD_MEDIDA_ID = 2;
const COBERTURA_GEOGRAFICA_ID = 3;
const getCatalogo = (catalogos, id) => {
  return catalogos?.find(catalogo => catalogo?.dataValues.idCatalogo == id);
}

const generateXLSX = (indicador) => {
  let baseFile = "./src/templates/indicador.xlsx";
  let wb = new Excel.Workbook();
  return wb.xlsx
    .readFile(baseFile)
    .then(async () => {
      let initialRow = 2;
      let ws = wb.getWorksheet(1);
      let row = ws.getRow(initialRow);
      let i = 1;
      for (const key of Object.keys(indicador)) {
        row.getCell(i).value = key;
        i++;
        row.commit();
      }
      return await wb.xlsx.writeBuffer();;
    })
    .catch(err => {
      throw err;
    });
};

const generatePDF = async (data) => {
  let indicador = data;
  const browser = await puppeteer.launch({
    headless: true,
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

    await page.evaluate(
      (years, values, unidadMedida) => {
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
      indicador.unidadMedida
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

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

const generateXLSX = (data) => {
  const indicador = data;
  const indicadorInfo = [
    indicador.nombre,
    indicador.modulo,
    indicador.tendenciaActual,
    indicador.tendenciaDeseada,
    indicador.ultimoValorDisponible,
    indicador.unidadMedida,
    indicador.anioUltimoValorDisponible,
    indicador.coberturaGeografica,
    indicador.formula?.ecuacion ?? "NA",
    indicador.formula?.descripcion ?? "NA",
    indicador.formula?.Variables ?? "NA",
    indicador.Historicos ?? "NA",
  ];
  
  let baseFile = "./src/templates/boop.xlsx";
  let wb = new Excel.Workbook();
  return wb.xlsx
    .readFile(baseFile)
    .then(async () => {
      let initialRow = 2;
      let ws = wb.getWorksheet(1);
      let row = ws.getRow(initialRow);
      for (let i = 0; i < indicadorInfo.length; i++) {
        initialRow = 2;
        let actualCell = i + 1;
        if (typeof indicadorInfo[i] === "object") {
          indicadorInfo[i].map((item, index) => {
            if (item.dataValues.hasOwnProperty("unidadMedida")) {
              [item.dataValues].map((singularItem, index) => {
                let row = ws.getRow(initialRow);
                row.getCell(actualCell).value = singularItem.nombre ?? "NA";
                row.getCell(actualCell + 1).value =
                  singularItem.nombreAtributo ?? "NA";
                row.getCell(actualCell + 2).value = singularItem.dato ?? "NA";
                row.commit();
              });
              initialRow = initialRow + 1;
            } else if (item.dataValues.hasOwnProperty("anio")) {
              [item.dataValues].map((singularItem, index) => {
                let row = ws.getRow(initialRow);
                row.getCell(actualCell + 2).value = singularItem.valor ?? "NA";
                row.getCell(actualCell + 3).value = singularItem.anio ?? "NA";
                row.getCell(actualCell + 4).value = singularItem.fuente ?? "NA";
                row.commit();
              });
              initialRow = initialRow + 1;
            }
          });
        } else {
          row.getCell(actualCell).value = indicadorInfo[i];
          row.commit();
        }
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
  const templateHtml = fs.readFileSync("./src/templates/test.html", "utf8");
  handlebars.registerHelper('isAscending', function (str) {
    return str === 'ASCENDENTE';
  });
  handlebars.registerHelper('numberWithCommas', numberWithCommas);
  const template = handlebars.compile(templateHtml);
  
  const html = template(indicador, { allowProtoPropertiesByDefault: true });
  await page.setContent(html, {
    waitUntil: "networkidle0",
  });
  const years = indicador.Historicos.map((elem) => elem.anio);
  const values = indicador.Historicos.map((elem) => elem.valor);

  await page.evaluate(
    (years, values, unidadMedida) => {
      const ctx = document.getElementById("myChart").getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: years,
          datasets: [
            {
              label: unidadMedida,
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
    console.log(err);
    throw err;
  });
  
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

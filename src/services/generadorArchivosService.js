const { Parser } = require("json2csv");
const Excel = require('exceljs');
const fs = require('fs');
const puppeteer = require('puppeteer');
const { numberWithCommas } = require("../utils/stringFormat");
const handlebars = require('handlebars');

const generateCSV = (data) => {
  data = data.dataValues;
  const json2csv = new Parser();
  const csv = json2csv.parse(data);
  return csv;
};

const generateJSON = (data) => (data)

const generateXLSX = (res, data) => {
  const indicador = data.dataValues;
  Object.keys(indicador).forEach(function (key) {
    if (indicador[key] === null || indicador[key] === undefined || indicador[key] === '') {
      indicador[key] = "NA";
    }
  });


  const indicadorInfo = [indicador.nombre, indicador.Modulo.temaIndicador, indicador.tendenciaActual, indicador.tendenciaDeseada, indicador.ultimoValorDisponible, indicador.Unidad, indicador.anioUltimoValorDisponible, indicador.CoberturaGeografica.nombre, indicador.Formula.ecuacion ?? 'NA', indicador.Formula.descripcion ?? 'NA', indicador.Formula.Variables ?? 'NA', indicador.Historicos ?? 'NA'];

  let baseFile = './src/templates/boop.xlsx';
  let wb = new Excel.Workbook();
  wb.xlsx.readFile(baseFile)
    .then(async () => {
      let initialRow = 2;
      let ws = wb.getWorksheet(1);
      let row = ws.getRow(initialRow);

      for (let i = 0; i < indicadorInfo.length; i++) {
        initialRow = 2;
        let actualCell = (i + 1);
        if (typeof indicadorInfo[i] === 'object') {
          indicadorInfo[i].map((item, index) => {
            if (item.dataValues.hasOwnProperty('UnidadMedida')) {
              [item.dataValues].map((singularItem, index) => {
                let row = ws.getRow(initialRow);
                row.getCell(actualCell).value = singularItem.nombre ?? 'NA';
                row.getCell(actualCell + 1).value = singularItem.nombreAtributo ?? 'NA';
                row.getCell(actualCell + 2).value = singularItem.dato ?? 'NA';
                row.commit();
              })
              initialRow = initialRow + 1;
            } else if (item.dataValues.hasOwnProperty('anio')) {
              [item.dataValues].map((singularItem, index) => {
                let row = ws.getRow(initialRow);
                row.getCell(actualCell + 2).value = singularItem.valor ?? 'NA';
                row.getCell(actualCell + 3).value = singularItem.anio ?? 'NA';
                row.getCell(actualCell + 4).value = singularItem.fuente ?? 'NA';
                row.commit();
              })
              initialRow = initialRow + 1;
            }
          })
        } else {
          row.getCell(actualCell).value = indicadorInfo[i];
          row.commit();
        }
      }
      await wb.xlsx.write(res);
      res.end()
    })
    .catch(err => {
      console.log(err);
      res.status(500);
    });
}

const generatePDF = async (res, data) => {
  let indicador = data.dataValues;
  const browser = await puppeteer.launch({
    headless: true
  });

  const page = await browser.newPage();
  const templateHtml = fs.readFileSync('./src/templates/test.html', 'utf8');
  const template = handlebars.compile(templateHtml)
  const html = template(indicador, { allowProtoPropertiesByDefault: true });

  await page.setContent(html, {
    waitUntil: 'networkidle2'
  });

  const years = indicador.Historicos.map(elem => elem.anio);
  const values = indicador.Historicos.map(elem => elem.valor);

  await page.evaluate((years, values) => {
    const ctx = document.getElementById('myChart');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: years,
        datasets: [{
          label: '# of Votes',
          data: values,
          backgroundColor: 'salmon',
          barPercentage: 0.8,
        }]
      }
    });
  }, years, values)

  page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36WAIT_UNTIL=load")

  const seggs = await page.pdf({
    format: 'A3',
    displayHeaderFooter: true,
    printBackground: true,
    headerTemplate: `<p>o.o</p>`,
    footerTemplate: `
    <div style="width: 100%; font-size: 10px;
        padding: 5px 5px 0; position: relative;">
        <div style="text-align: center">página <span class="pageNumber"></span>/<span class="totalPages"></span></div>
    </div>`,
    margin: { bottom: '70px' },
  });

  await browser.close();
  res.header('Content-disposition', 'attachment');
  res.header('Content-Type', 'application/pdf');
  res.send(seggs);
}

module.exports = {
  generateCSV,
  generateJSON,
  generateXLSX,
  generatePDF
}
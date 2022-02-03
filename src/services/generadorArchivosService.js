const { Parser } = require("json2csv");
const Excel = require('exceljs');
const pdf = require('html-pdf');	
const fs = require('fs');
const puppeteer = require('puppeteer');

const generateCSV = (data) => {
    data = data.dataValues;
    const json2csv = new Parser ();
    const csv = json2csv.parse(data);
    return csv;
};

const generateJSON = (data) => {
    return data;
}

const generateXLSX =  (res, data) => {
    const indicador = data.dataValues;

    const definitionRows = [3, 4, 5, 6, 8, 9, 11]
    const indicadorInfo = [indicador.nombre, indicador.Unidad, indicador.CoberturaGeografica.nombre, indicador.Modulo.temaIndicador, indicador.tendenciaActual, indicador.urlImagen, 'test'];

    let baseFile = './src/templates/boop.xlsx';
    let wb = new Excel.Workbook();
    wb.xlsx.readFile(baseFile)

    .then (async () => {
        let ws = wb.getWorksheet(1);
        
        for (let i = 0; i < definitionRows.length; i++) {
            let row = ws.getRow(definitionRows[i]);

            row.getCell(3).value = indicadorInfo[i];    
            row.commit();
        }

        res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        await wb.xlsx.write(res);
        res.status(200);
        res.end();
        })

    .catch(err => {
        console.log(err);
        res.status(500);
    });
}

const generatePDF = async (res, data) => {

  const browser = await puppeteer.launch({
    headless: true
  })

  const page = await browser.newPage()

  const html = fs.readFileSync('./src/templates/test.html', 'utf8')
  await page.setContent(html, {
    waitUntil: 'networkidle2'
  })

  page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36WAIT_UNTIL=load")

  const seggs = await page.pdf({
    format: 'A3',
  })
  // close the browser
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
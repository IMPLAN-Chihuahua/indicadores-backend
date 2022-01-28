const { Indicador } = require("../models");
const { Parser } = require("json2csv");
const Excel = require('exceljs');

const generateCSV = (res, data) => {
    data = data.dataValues;
    const json2csv = new Parser ();
    const csv = json2csv.parse(data);
    res.header('Content-Type', 'text/csv');
    res.attachment('Boop.csv');
    console.log(csv);
    return res.send(csv);
};

const generateJSON = (res, data) => {
    res.header('Content-Type', 'application/json');
    res.attachment('Boop.json');
    return res.send(data);
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

const excelito = (qtyOfVariables, qtyOfHistoricos) => {
    const definitionRows = [3, 4, 5, 6, 8, 9, 11]
    let variableRowIndexStarter = definitionRows.slice(-1).pop+2
    let variablesRow = []
    let historicosRow = []
    for (let i = 0; i < qtyOfVariables; i++) {
        variablesRow.push(variableRowIndexStarter + i)
    }
    let historicoRowIndexStarter = variablesRow.slice(-1).pop+2
    for (let i = 0; i < qtyOfHistoricos; i++) {
        historicosRow.push(historicoRowIndexStarter + 1)
    }
    
}
module.exports = {
    generateCSV,
    generateJSON,
    generateXLSX
}
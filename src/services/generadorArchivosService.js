const { Indicador } = require("../models");
const { Parser } = require("json2csv");

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

module.exports = {
    generateCSV,
    generateJSON,
}
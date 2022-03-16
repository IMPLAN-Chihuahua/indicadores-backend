
const determinePathway = (route) => (req, res, next) => {
    switch (route) {
        case 'application': req.pathway = 'application'; next(); break;
        case 'site': req.pathway = 'site'; next();break;
        case 'file': req.pathway = 'file'; next(); break;
    }
}

module.exports = {
    determinePathway,
}
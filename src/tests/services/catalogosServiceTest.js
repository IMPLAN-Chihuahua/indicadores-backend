/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
const chai = require('chai');
const sinon = require('sinon');

const { expect } = chai;
const { CatalogoDetail, Catalogo, CatalogoDetailIndicador, } = require('../../models');

const CatalogosService = require('../../services/catalogosService');
const { server } = require('../../../app');
const { someCatalogos, someCatalogosDetails, someCatalogosFromIndicador } = require('../../utils/factories');

describe('Catalogos service', function () {
    const catalogos = someCatalogos(1);
    const catalogosWithDetails = [someCatalogosDetails(1, 1), someCatalogosDetails(2, 1), someCatalogosDetails(3, 1)];
    const catalogosFromIndicador = someCatalogosFromIndicador(1);

    this.afterEach(function () {
        sinon.restore();
    });

    this.afterAll(function () {
        server.close();
    });

    it('Should return a list of catalogues', function () {
        const findAndCountAllFake = sinon.fake.resolves({
            count: catalogos.length, rows: catalogos,
        });
        sinon.replace(Catalogo, 'findAndCountAll', findAndCountAllFake);
        return CatalogosService.getCatalogos()
            .then(res => {
                expect(res.total).to.equal(catalogos.length);
                expect(res.catalogos).to.deep.equal(catalogos);
            }
            );
    });

    it('Should return a list of specific catalog item', function () {
        const findAndCountAllFake = sinon.fake.resolves({
            count: catalogosWithDetails.length, rows: catalogosWithDetails,
        });
        sinon.replace(CatalogoDetail, 'findAndCountAll', findAndCountAllFake);
        return CatalogosService.getCatalogosDetails(1)
            .then(res => {
                expect(res.total).to.equal(catalogosWithDetails.length);
                expect(res.catalogos).to.deep.equal(catalogosWithDetails);
            }
            );
    });

    it('Should return a list of catalogues from an indicator', function () {
        const findAllFake = sinon.fake.resolves(catalogosFromIndicador);
        sinon.replace(CatalogoDetailIndicador, 'findAll', findAllFake);
        return CatalogosService.getCatalogosFromIndicador(1)
            .then(res => {
                expect(res).to.deep.equal(catalogosFromIndicador);
                expect(res).to.be.an('array');
                expect(res).to.not.be.empty;
            }
            );
    });

});
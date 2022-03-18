/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
const chai = require('chai');
const sinon = require('sinon');

const { expect } = chai;
const { CatalogoDetail } = require('../../models');

const CatalogosService = require('../../services/catalogosService');
const { server } = require('../../../app');
const { anOds, anUnidadMedida, aCoberturaGeografica } = require('../../utils/factories');

describe('Catalogos service', function () {

    const setOfOds = [anOds(1), anOds(2), anOds(3)];
    const setOfUnidades = [anUnidadMedida(1), anUnidadMedida(2), anUnidadMedida(3)];
    const setOfCoberturas = [aCoberturaGeografica(1), aCoberturaGeografica(2), aCoberturaGeografica(3)];

    this.afterEach(function () {
        sinon.restore();
    });

    this.afterAll(function () {
        server.close();
    });

    describe('ODS', function () {
        describe('Read operations', function () {
            it('Returns a list of ODS and the total number of them', function () {
                const findAndCountAllFake = sinon.fake.resolves({
                    rows: setOfOds,
                    count: setOfOds.length
                });
                sinon.replace(CatalogoDetail, 'findAndCountAll', findAndCountAllFake);
                return CatalogosService.getOds()
                    .then(res => {
                        expect(findAndCountAllFake.calledOnce).to.be.true;
                        expect(res.ods).to.be.an('array').that.is.not.empty;
                        expect(res.total).to.equal(setOfOds.length);
                    })
            });

            it('Returns a singular ODS by its ID', function () {
                const findOneFake = sinon.fake.resolves({ ...anOds(1) });
                sinon.replace(CatalogoDetail, 'findOne', findOneFake);
                return CatalogosService.getOdsById(1)
                    .then(res => {
                        expect(findOneFake.args[0][0].where.id).to.be.equal(1);
                        expect(findOneFake.calledOnce).to.be.true;
                        expect(res).to.not.be.null;
                    });
            });

            it('Rejects the returning of a list of ODS', function () {
                const findAndCountAllFake = sinon.fake.rejects(new Error());
                sinon.replace(CatalogoDetail, 'findAndCountAll', findAndCountAllFake);
                return CatalogosService.getOds()
                    .then(res => {
                        expect(res).to.be.null;
                    })
                    .catch(err => {
                        expect(findAndCountAllFake.calledOnce).to.be.true;
                        expect(err).to.not.be.null;
                    });
            })
        });

        describe('Update operations', function () {
            it('Updates an ODS', function () {
                const updateFake = sinon.fake.resolves(anOds(10));
                sinon.replace(CatalogoDetail, 'update', updateFake);
                return CatalogosService.updateOds(1, { nombre: 'Nuevo nombre' })
                    .then(res => {
                        expect(updateFake.calledOnce).to.be.true;
                        expect(res).to.not.be.null;
                    });
            });

            it('Should not update an non-existent ODS', function () {
                const updateFake = sinon.fake.resolves(anOds(10));
                sinon.replace(CatalogoDetail, 'update', updateFake);
                return CatalogosService.updateOds(1, { nombre: 'Nuevo nombre' })
                    .then(res => {
                        expect(updateFake.calledOnce).to.be.true;
                        expect(res).to.not.be.null;
                    });
            });
        });

        describe('Delete operations', function () {
            it('Deletes an ODS', function () {
                const destroyFake = sinon.fake.resolves(1);
                sinon.replace(CatalogoDetail, 'destroy', destroyFake);
                return CatalogosService.deleteOds(1)
                    .then(res => {
                        expect(destroyFake.calledOnce).to.be.true;
                        expect(res).to.be.true;
                    });
            });

            it('Should not delete an ODS (because of non-existence)', function () {
                const destroyFake = sinon.fake.resolves(0);
                sinon.replace(CatalogoDetail, 'destroy', destroyFake);
                return CatalogosService.deleteOds(1)
                    .then(res => {
                        expect(destroyFake.calledOnce).to.be.true;
                        expect(res).to.be.false;
                    });
            });
        });

        describe('Create operations', function () {
            it('Creates an ODS', function () {
                const createFake = sinon.fake.resolves(anOds(10));
                sinon.replace(CatalogoDetail, 'create', createFake);
                return CatalogosService.createOds({ nombre: 'Nuevo nombre' })
                    .then(res => {
                        expect(createFake.calledOnce).to.be.true;
                        expect(res).to.not.be.null;
                    });
            });

            it('Rejects the creation of an ODS', function () {
                const createFake = sinon.fake.rejects(new Error());
                sinon.replace(CatalogoDetail, 'create', createFake);
                return CatalogosService.createOds({ nombre: 'Nuevo nombre' })
                    .then(res => {
                        expect(createFake.calledOnce).to.be.true;
                        expect(res).to.be.null;
                    })
                    .catch(err => {
                        expect(err).to.not.be.null;
                    });
            });
        });
    });

    describe('UnidadMedidas', function () {
        describe('Read operations', function () {
            it('Returns a list of Unidades and the total number of them', function () {
                const findAndCountAllFake = sinon.fake.resolves({
                    rows: setOfUnidades,
                    count: setOfUnidades.length
                });
                sinon.replace(CatalogoDetail, 'findAndCountAll', findAndCountAllFake);
                return CatalogosService.getUnidades()
                    .then(res => {
                        expect(findAndCountAllFake.calledOnce).to.be.true;
                        expect(res.unidades).to.be.an('array').that.is.not.empty;
                        expect(res.total).to.equal(setOfUnidades.length);
                    })
            });

            it('Returns a singular Unidad by its ID', function () {
                const findOneFake = sinon.fake.resolves({ ...anUnidadMedida(1) });
                sinon.replace(CatalogoDetail, 'findOne', findOneFake);
                return CatalogosService.getUnidadMedidaById(1)
                    .then(res => {
                        expect(findOneFake.args[0][0].where.id).to.be.equal(1);
                        expect(findOneFake.calledOnce).to.be.true;
                        expect(res).to.not.be.null;
                    });
            });

            it('Rejects the returning of a list of Unidades', function () {
                const findAndCountAllFake = sinon.fake.rejects(new Error());
                sinon.replace(CatalogoDetail, 'findAndCountAll', findAndCountAllFake);
                return CatalogosService.getUnidades()
                    .then(res => {
                        expect(res).to.be.null;
                    })
                    .catch(err => {
                        expect(findAndCountAllFake.calledOnce).to.be.true;
                        expect(err).to.not.be.null;
                    });
            })
        });

        describe('Update operations', function () {
            it('Updates an Unidad', function () {
                const updateFake = sinon.fake.resolves(anUnidadMedida(10));
                sinon.replace(CatalogoDetail, 'update', updateFake);
                return CatalogosService.updateUnidadMedida(1, { nombre: 'Nuevo nombre' })
                    .then(res => {
                        expect(updateFake.calledOnce).to.be.true;
                        expect(res).to.not.be.null;
                    });
            });

            it('Should not update an non-existent Unidad', function () {
                const updateFake = sinon.fake.resolves(anUnidadMedida(10));
                sinon.replace(CatalogoDetail, 'update', updateFake);
                return CatalogosService.updateUnidadMedida(1, { nombre: 'Nuevo nombre' })
                    .then(res => {
                        expect(updateFake.calledOnce).to.be.true;
                        expect(res).to.not.be.null;
                    });
            });
        });

        describe('Delete operations', function () {
            it('Deletes an Unidad', function () {
                const destroyFake = sinon.fake.resolves(1);
                sinon.replace(CatalogoDetail, 'destroy', destroyFake);
                return CatalogosService.deleteUnidadMedida(1)
                    .then(res => {
                        expect(destroyFake.calledOnce).to.be.true;
                        expect(res).to.be.true;
                    });
            });

            it('Should not delete an Unidad (because of non-existence)', function () {
                const destroyFake = sinon.fake.resolves(0);
                sinon.replace(CatalogoDetail, 'destroy', destroyFake);
                return CatalogosService.deleteOds(1)
                    .then(res => {
                        expect(destroyFake.calledOnce).to.be.true;
                        expect(res).to.be.false;
                    });
            });
        });

        describe('Create operations', function () {
            it('Creates an Unidad', function () {
                const createFake = sinon.fake.resolves(anUnidadMedida(10));
                sinon.replace(CatalogoDetail, 'create', createFake);
                return CatalogosService.createUnidadMedida({ nombre: 'Nuevo nombre' })
                    .then(res => {
                        expect(createFake.calledOnce).to.be.true;
                        expect(res).to.not.be.null;
                    });
            });

            it('Rejects the creation of an Unidad', function () {
                const createFake = sinon.fake.rejects(new Error());
                sinon.replace(CatalogoDetail, 'create', createFake);
                return CatalogosService.createUnidadMedida({ nombre: 'Nuevo nombre' })
                    .then(res => {
                        expect(createFake.calledOnce).to.be.true;
                        expect(res).to.be.null;
                    })
                    .catch(err => {
                        expect(err).to.not.be.null;
                    });
            });
        });
    });

    describe('CoberturaGeografica', function () {
        describe('Read operations', function () {
            it('Returns a list of Coberturas and the total number of them', function () {
                const findAndCountAllFake = sinon.fake.resolves({
                    rows: setOfCoberturas,
                    count: setOfCoberturas.length
                });
                sinon.replace(CatalogoDetail, 'findAndCountAll', findAndCountAllFake);
                return CatalogosService.getCoberturas()
                    .then(res => {
                        expect(findAndCountAllFake.calledOnce).to.be.true;
                        expect(res.coberturas).to.be.an('array').that.is.not.empty;
                        expect(res.total).to.equal(setOfCoberturas.length);
                    })
            });

            it('Returns a singular Cobertura by its ID', function () {
                const findOneFake = sinon.fake.resolves({ ...aCoberturaGeografica(1) });
                sinon.replace(CatalogoDetail, 'findOne', findOneFake);
                return CatalogosService.getCoberturaById(1)
                    .then(res => {
                        expect(findOneFake.args[0][0].where.id).to.be.equal(1);
                        expect(findOneFake.calledOnce).to.be.true;
                        expect(res).to.not.be.null;
                    });
            });

            it('Rejects the returning of a list of Coberturas', function () {
                const findAndCountAllFake = sinon.fake.rejects(new Error());
                sinon.replace(CatalogoDetail, 'findAndCountAll', findAndCountAllFake);
                return CatalogosService.getCoberturas()
                    .then(res => {
                        expect(res).to.be.null;
                    })
                    .catch(err => {
                        expect(findAndCountAllFake.calledOnce).to.be.true;
                        expect(err).to.not.be.null;
                    });
            })
        });

        describe('Update operations', function () {
            it('Updates a Cobertura', function () {
                const updateFake = sinon.fake.resolves(aCoberturaGeografica(10));
                sinon.replace(CatalogoDetail, 'update', updateFake);
                return CatalogosService.updateCobertura(1, { nombre: 'Nuevo nombre' })
                    .then(res => {
                        expect(updateFake.calledOnce).to.be.true;
                        expect(res).to.not.be.null;
                    });
            });

            it('Should not update an non-existent Cobertura', function () {
                const updateFake = sinon.fake.resolves(anUnidadMedida(10));
                sinon.replace(CatalogoDetail, 'update', updateFake);
                return CatalogosService.updateCobertura(1, { nombre: 'Nuevo nombre' })
                    .then(res => {
                        expect(updateFake.calledOnce).to.be.true;
                        expect(res).to.not.be.null;
                    });
            });
        });

        describe('Delete operations', function () {
            it('Deletes an Unidad', function () {
                const destroyFake = sinon.fake.resolves(1);
                sinon.replace(CatalogoDetail, 'destroy', destroyFake);
                return CatalogosService.deleteCobertura(1)
                    .then(res => {
                        expect(destroyFake.calledOnce).to.be.true;
                        expect(res).to.be.true;
                    });
            });

            it('Should not delete an Cobertura (because of non-existence)', function () {
                const destroyFake = sinon.fake.resolves(0);
                sinon.replace(CatalogoDetail, 'destroy', destroyFake);
                return CatalogosService.deleteCobertura(1)
                    .then(res => {
                        expect(destroyFake.calledOnce).to.be.true;
                        expect(res).to.be.false;
                    });
            });
        });

        describe('Create operations', function () {
            it('Creates a Cobertura', function () {
                const createFake = sinon.fake.resolves(aCoberturaGeografica(10));
                sinon.replace(CatalogoDetail, 'create', createFake);
                return CatalogosService.createCobertura({ nombre: 'Nuevo nombre' })
                    .then(res => {
                        expect(createFake.calledOnce).to.be.true;
                        expect(res).to.not.be.null;
                    });
            });

            it('Rejects the creation of a Cobertura', function () {
                const createFake = sinon.fake.rejects(new Error());
                sinon.replace(CatalogoDetail, 'create', createFake);
                return CatalogosService.createCobertura({ nombre: 'Nuevo nombre' })
                    .then(res => {
                        expect(createFake.calledOnce).to.be.true;
                        expect(res).to.be.null;
                    })
                    .catch(err => {
                        expect(err).to.not.be.null;
                    });
            });
        });
    });

});
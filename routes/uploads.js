const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarArchivosSubir } = require('../middlewares');
const { cargarArchivo, actualizarImagen } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers/db-validators');


const router = Router();

router.post('/',validarArchivosSubir, cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivosSubir,
    check('id', 'Debe de ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], actualizarImagen);

module.exports = router;
import express from 'express';
const router = express.Router();

import {
    getAllAviao,
    getAviaoByNserie,
    postAviao,
    postPeca,
    postManutencao,
    getAllTecnicos,
    getTecnicoById,
    getManutencoesFuturas,
    postTecnico
} from '../services/api.js'

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('technician/index');
});

router.get('/notifi', function (req, res, next) {
    res.render('technician/notifi');
});

export default router
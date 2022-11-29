import express from 'express';
const router = express.Router();

import {
    getAllAviao,
    getAviaoByNserie,
    postAviao,
    postPeca,
    postManutencao,
    getAllTecnicos,
    getManutencoesFuturas,
    postTecnico,
    getManutencoes,
    postNotificacao,
    getNotificacoes,
    getSearch,
    getManutencaoById
} from '../services/api.js'

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('manager/index');
});

router.get('/notifi', async function (req, res, next) {
    const nots = await getNotificacoes();

    res.render('manager/notifi', {
        notificacoes: nots.constructor === Array ? nots : 0
    });
});

router.get('/notifi/create', async function (req, res, next) {
    var avioes = await getManutencoes()

    console.log(avioes)

    res.render('manager/notifiCreate', {
        avioes: avioes
    });
});

router.post('/notifi/create', async function (req, res, next) {
    const not = {
        "notificacao": req.body.desc,
        "obs": req.body.prior
    }

    const notSaida = await postNotificacao(req.body.man, JSON.stringify(not));
    console.log(notSaida);
    res.redirect('/manager/notifi');
});

// ######################################################################
// Dados do Avião

router.get('/dadosMantIni', async function (req, res, next) {
    var avioes = await getAllAviao();

    if (req.query.added == 1 && req.query.peca == 1) {
        res.render('manager/dadosMantIni', {
            peca: true,
            added: true,
            avioes: avioes.constructor === Array ? avioes : 0
        })
    } else if (req.query.added == 1) {
        res.render('manager/dadosMantIni', {
            peca: false,
            added: true,
            avioes: avioes.constructor === Array ? avioes : 0
        })
    } else {
        res.render('manager/dadosMantIni', {
            peca: false,
            added: false,
            avioes: avioes.constructor === Array ? avioes : 0
        })
    }
});

router.post('/dadosMantIni/aviao', async function (req, res, next) {
    const aviaoEntrada = {
        "nserie": req.body.numserie,
        "fabricante": req.body.fab,
        "tamanho_asa": req.body.tamasa,
        "tamanho_total": req.body.tamtotal,
        "velocidade": req.body.vel,
        "quantidade_assentos": req.body.qntassentos,
        "modelo": req.body.mod,
        "observacoes": req.body.obs,
    }

    const aviaoSaida = await postAviao(JSON.stringify(aviaoEntrada));
    console.log(aviaoSaida);
    res.redirect('/manager/dadosMantIni?added=1');
})

router.post('/dadosMantIni/peca', async (req, res) => {
    const pecaEntrada = {
        "nserie": parseInt(req.body.numserie),
        "fabricante": req.body.fab,
        "horas_uso_peca": parseFloat(req.body.usopeca),
        "fornecedor": req.body.forn,
        "lote": parseInt(req.body.lote),
        "valor": parseFloat(req.body.val),
        "tempoValidade": parseInt(req.body.troca),
        "active": false,
        "descricao": req.body.des
    }
    console.log(pecaEntrada)
    const pecaSaida = await postPeca(JSON.stringify(pecaEntrada), req.body.aviao);
    console.log(pecaSaida);
    //res.send(pecaSaida)
    res.redirect('/manager/dadosMantIni?added=1&peca=1');
})

// ######################################################################
// Planejar Manutenções

router.get('/planMan', async (req, res) => {
    var added = 0;
    if (req.query.added == 1) added = 1;


    if (req.query.aviao) {
        var aviao = await getAviaoByNserie(req.query.aviao);
        var avioes = await getAllAviao();
        var tecnicos = await getAllTecnicos();
        var future = await getManutencoesFuturas(aviao.id)

        console.log(future.constructor === Array)

        res.render('manager/planMan', {
            avioes: avioes.constructor === Array ? avioes : 0,
            aviao: aviao,
            tecnicos: tecnicos.constructor == Array ? tecnicos : 0,
            future: future.constructor === Array ? future : 0,
            added: added
        })
    } else {
        var avioes = await getAllAviao();
        var tecnicos = await getAllTecnicos();


        res.render('manager/planMan', {
            avioes: avioes.constructor === Array ? avioes : 0,
            tecnicos: tecnicos.constructor == Array ? tecnicos : 0,
            aviao: 0,
            future: 0,
            added: added
        })
    }
});

router.post('/planMan/search', async (req, res) => {
    res.redirect(`/manager/planMan?aviao=${req.body.aviao}`)
})

router.post('/planMan/manutencao', async (req, res) => {
    let preId = req.body.tec.split(" ")
    preId = preId.reverse()
    preId = preId[0].slice(0, -1)


    //var aviao = await getAviaoByNserie(req.body.aviao);

    //var tecId = getTecnicoById(parseInt(preId))

    const manutencaoEntrada = {
        "motivoManutencao": req.body.mot,
        "numeroManutencao": parseInt(req.body.num),
        "data": req.body.data,
        "observacoes": req.body.obs,
        "avioes": parseInt(req.body.aviao),
        "frequencia": req.body.freq,
        "tecnico": parseInt(preId)
    }

    const manutencaoSaida = await postManutencao(JSON.stringify(manutencaoEntrada));
    console.log(manutencaoSaida);
    //res.send(manutencaoSaida)
    res.redirect('/manager/planMan?added=1');
})

// ######################################################################
// Dados de Uso

router.get('/dadosUso', async (req, res) => {
    if (req.query.aviao) {
        var aviao = await getAviaoByNserie(req.query.aviao);
        var avioes = await getAllAviao();

        res.render('manager/dadosUso', {
            avioes: avioes.constructor === Array ? avioes : 0,
            aviao: aviao,
        })
    } else {
        var avioes = await getAllAviao();

        res.render('manager/dadosUso', {
            avioes: avioes.constructor === Array ? avioes : 0,
            aviao: 0,
        })
    }
});

router.post('/dadosUso/search', async (req, res) => {
    res.redirect(`/manager/dadosUso?aviao=${req.body.aviao}`)
});

// ######################################################################
// Manter Tecnico

router.get('/addTecnico', async (req, res) => {
    if (req.query.added == 1) res.render('manager/addTecnico', {
        added: 1
    })
    else res.render('manager/addTecnico', {
        added: 0
    })
});

router.post('/addTecnico/tecnico', async (req, res) => {
    const tecnico = {
        "nome": req.body.nome,
        "dataNasc": req.body.dataNasc,
        "cpf": req.body.cpf,
        "telefone": req.body.telefone,
        "endereco": req.body.endereco,
        "setor": req.body.setor,
        "especializacao": req.body.especializacao,
    }

    const tecnicoSaida = await postTecnico(JSON.stringify(tecnico));
    if (tecnicoSaida.id != undefined) res.redirect('/manager/addTecnico?added=1')
    else res.redirect('/manager/addTecnico?error=1')
});

// ######################################################################
// Ajuda

router.get('/ajuda', async (req, res) => {
    res.render('manager/ajuda')
});

// ######################################################################
// Relatorio

router.get('/relMan', async (req, res) => {

    if (req.query.search) {
        const manutencoes = await getManutencoes();
        const avioes = await getAllAviao();
        const search = await getSearch(req.query.search);

        console.log(search)

        res.render('manager/relMan', {
            avioes: avioes.constructor === Array ? avioes : 0,
            manutencoes: manutencoes.constructor === Array ? manutencoes : 0,
            search: search.constructor === Array ? search : 0
        })
    } else {
        const manutencoes = await getManutencoes();
        const avioes = await getAllAviao();

        res.render('manager/relMan', {
            avioes: avioes.constructor === Array ? avioes : 0,
            manutencoes: manutencoes.constructor === Array ? manutencoes : 0,
            search: 0
        })
    }


});

router.post('/relMan/buscar', async (req, res) => {
    const searchParams = {
        date: req.body.data.constructor === String ? req.body.data : " ",
        motivo: req.body.mot.constructor === String ? req.body.mot : " ",
        aviaoId: req.body.aviao.constructor === String ? req.body.aviao : " ",
        numMan: req.body.numman.constructor === String ? req.body.numMan : " "
    }

    res.redirect(`/manager/relMan?search=${JSON.stringify(searchParams)}`)

});

router.post('/relManII', async (req, res) => {
   res.redirect(`/manager/relManII?id=${req.body.id}`);
});

router.get('/relManII', async (req, res) => {
    const man = await getManutencaoById(req.query.id);
    

    res.render('manager/relManII', {
        manutencao: man
    })
});



export default router;
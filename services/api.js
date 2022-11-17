import fetch from 'node-fetch';

export function getAllAviao() {
    const url = 'http://localhost:8080/aviao/';

    const options = {
        method: 'GET'
    };

    return fetch(url, options)
        .then(res => res.json())
        .then(json => json)
        .catch(err => 'error:' + err);

}

export function getAviaoByNserie(nserie) {
    let url = `http://localhost:8080/aviao/nserie/${nserie}`;

    let options = {
        method: 'GET',
    };

    return fetch(url, options)
        .then(res => res.json())
        .then(json => json)
        .catch(err => 'error:' + err);
}

export function postAviao(aviao) {
    let url = 'http://localhost:8080/aviao/';

    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: aviao
    };

    return fetch(url, options)
        .then(res => res.json())
        .then(json => json)
        .catch(err => 'error:' + err);
}

export function getAllTecnicos() {
    let url = 'http://localhost:8080/tecnico/';

    let options = {
        method: 'GET',
    };

    return fetch(url, options)
        .then(res => res.json())
        .then(json => json)
        .catch(err => 'error:' + err);
}

export async function postPeca(peca, aviaoId) {
    var pecaJson = JSON.parse(peca);
    var aviao = await getAviaoByNserie(aviaoId)
    console.log(aviao)
    let url = `http://localhost:8080/aviao/${aviao.id}/peca`;

    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: peca
    };

    var pecaSaved = await fetch(url, options)
        .then(res => res.json())
        .then(json => json)
        .catch(err => 'error:' + err);

    console.log(pecaJson);

    url = `http://localhost:8080/aviao/${aviao.id}/peca/${pecaSaved.id}/init`;

    var initBody = {
        tempoValidade: pecaJson.tempoValidade
    }

    options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(initBody)
    };

    return fetch(url, options)
        .then(res => res.json())
        .then(json => json)
        .catch(err => 'error:' + err);
}

export async function postManutencao(manutencao) {

    let url = 'http://localhost:8080/manutencao/';

    let options = {
        method: 'POST',
        body: manutencao,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    return fetch(url, options)
        .then(res => res.json())
        .then(json => json)
        .catch(err => 'error:' + err);
}

export async function getTecnicoById(id) {
    let url = `http://localhost:8080/tecnico/${id}`

    let options = {
        method: 'GET',
    };

    return fetch(url, options)
        .then(res => res.json())
        .then(json => json)
        .catch(err => 'error:' + err);

}

export async function getManutencoesFuturas(idAviao) {
    let url = 'http://localhost:8080/manutencao/manutencoesFuturas';

    let options = {
      method: 'GET',
    };
    
    var manutencoes = fetch(url, options)
        .then(res => res.json())
        .then(json => json)
        .catch(err => 'error:' + err);

    if (manutencoes.avioes != undefined){
        manutencoes.map((value, index) => {
            value.avioes[0].id == idAviao ? console.log("ID Avião = " + idAviao + "; ID Avião Manutenção = " + value.avioes[0].id) : manutencoes.splice(index, 1)
        })
        return manutencoes    
    }else{
        return manutencoes    
    }
} 
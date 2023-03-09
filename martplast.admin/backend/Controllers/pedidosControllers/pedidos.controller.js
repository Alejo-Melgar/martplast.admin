const {selectAll} = require('../../containers/general.container')

const getPedidos = async (req, res) => {
    if (req.session.logged && req.session.logged === true) {
        selectAll('PEDIDOS').then(function(table){
            res.json(table) 
        })
    }
}

const getDetails = async (req, res) => {
    selectAll('DETALLES_PEDIDO').then(function(table){
        res.json(table) 
    })
}

module.exports = { getPedidos, getDetails }
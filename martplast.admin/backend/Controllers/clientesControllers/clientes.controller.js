const { selectAll, selectByField } = require('../../containers/general.container')

const getClientes = async (req, res) => {
    console.log("INTENTO DE GET CLIENTES");
    if (req.session.logged && req.session.logged === true) {
        selectAll('CLIENTES').then(function(table){
            res.json(table)
        })
    }
}

const getPhoneNumbers = async (req, res) => {
    selectByField('CLIENTES', 'Telefono').then(function(table){
        res.json(table)
    })
}

module.exports = { getClientes, getPhoneNumbers }
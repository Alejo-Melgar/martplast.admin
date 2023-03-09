const {selectAll} = require('../../containers/general.container')

const getProductos = async (req, res) => {
    if (req.session.logged && req.session.logged === true) {
        selectAll('PRODUCTOS').then(function(table){
            res.json(table)
        })
    }
}

module.exports = { getProductos }
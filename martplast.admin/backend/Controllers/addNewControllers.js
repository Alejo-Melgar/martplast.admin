const {addNewRecord} = require('../containers/general.container')

const addNew = async (req, res) => {
    const addInfo = req.body
    console.log('addInfo', addInfo)
    addNewRecord(addInfo).then((added) => {
        console.log('added', added)
        if (!added) {
            res.json({status: 'error',message: 'No hay suficiente stock'})
        } else {
            res.json({status: 'success', message: 'Elemento cargado'})
        }
    })
}

module.exports = { addNew }
const { editById } = require('../containers/general.container')

const editByIdController = async (req, res) => {
    const { tablename, idField, pk, objRef } = req.body
    editById(tablename, idField, pk, objRef).then(function(desc){
        res.json(desc)
    })
}

module.exports = { editByIdController }
const { deleteById } = require('../containers/general.container')

const deleteByIdController = async (req, res) => {
    const {tablename, idField, id} = req.body
    deleteById(tablename, idField, id).then(
        selectAll(tablename).then(function(table){
            res.json(table)
        })  
    )
}

module.exports = { deleteByIdController }
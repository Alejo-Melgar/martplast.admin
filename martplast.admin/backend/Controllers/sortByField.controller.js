const { sortByField } = require('../containers/general.container')

const sortByFieldController = async (req, res) => {
    const {table, field, condition} = req.body
    const result = await sortByField(table, field, condition)
    res.json(result)
}

module.exports = { sortByFieldController }
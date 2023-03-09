const { searchBy } = require('../containers/general.container')

const searchController = async (req, res) => {
    const {table, field, searchString} = req.body
    const result = await searchBy(table, field, searchString)
    res.json(result)
}

module.exports = { searchController }
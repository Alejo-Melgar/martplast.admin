const { Router } = require('express')
const { getClientes, getPhoneNumbers } = require("../Controllers/clientesControllers/clientes.controller")
const { searchController } = require("../Controllers/search.controller")
const { addNew } = require("../Controllers/addNewControllers")
const { deleteByIdController } = require("../Controllers/deleteById.controller")
const { sortByFieldController } = require("../Controllers/sortByField.controller")
const { editByIdController } = require("../Controllers/editById.controller")
const clientesRouter = Router()

clientesRouter.get('', getClientes)
clientesRouter.get('/phones', getPhoneNumbers)
clientesRouter.post('', searchController)
clientesRouter.post('/sort', sortByFieldController)
clientesRouter.post('/add', addNew)
clientesRouter.post('/edit', editByIdController)
clientesRouter.post('/delete', deleteByIdController)

module.exports = clientesRouter;
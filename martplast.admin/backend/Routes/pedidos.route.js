const { Router } = require('express')
const { getPedidos, getDetails } = require("../Controllers/pedidosControllers/pedidos.controller")
const { addNew } = require("../Controllers/addNewControllers")
const { searchController } = require("../Controllers/search.controller")
const { deleteByIdController } = require("../Controllers/deleteById.controller")
const { sortByFieldController } = require("../Controllers/sortByField.controller")
const { editByIdController } = require("../Controllers/editById.controller")
const pedidosRouter = Router()

pedidosRouter.get('', getPedidos)
pedidosRouter.post('', searchController)
pedidosRouter.get('/detalles-pedido', getDetails)
pedidosRouter.post('/sort', sortByFieldController)
pedidosRouter.post('/add', addNew)
pedidosRouter.post('/edit', editByIdController)
pedidosRouter.post('/delete', deleteByIdController)

module.exports = pedidosRouter; 
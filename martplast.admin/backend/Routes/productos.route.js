const { Router } = require('express')
const { getProductos } = require("../Controllers/productosControllers/productos.controller")
const { addNew } = require("../Controllers/addNewControllers")
const { searchController } = require("../Controllers/search.controller")
const { deleteByIdController } = require("../Controllers/deleteById.controller")
const { sortByFieldController } = require("../Controllers/sortByField.controller")
const { editByIdController } = require("../Controllers/editById.controller")
const productosRouter = Router()

productosRouter.get('', getProductos)
productosRouter.post('', searchController)
productosRouter.post('/sort', sortByFieldController)
productosRouter.post('/add', addNew)
productosRouter.post('/edit', editByIdController)
productosRouter.post('/delete', deleteByIdController)

module.exports = productosRouter;
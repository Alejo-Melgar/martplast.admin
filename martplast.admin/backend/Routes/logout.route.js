const { Router } = require('express')
const { logOutController } = require("../Controllers/logOutControllers/logout.controller")
const logOutSystemRouter = Router()

logOutSystemRouter.get('', logOutController)

module.exports = logOutSystemRouter
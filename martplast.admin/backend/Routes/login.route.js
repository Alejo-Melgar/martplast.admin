const { Router } = require('express')
const { getLogInController, postLogInController } = require("../Controllers/logInControllers/logIn.controller")
const logSystemRouter = Router()

logSystemRouter.get('', getLogInController)
logSystemRouter.post('', postLogInController)

module.exports = logSystemRouter
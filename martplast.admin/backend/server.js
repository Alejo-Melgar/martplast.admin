//Dependencies
const express = require('express')
const cookieParser = require("cookie-parser")
var bodyParser = require('body-parser')
const session = require('express-session')
const cors = require('cors')
//Building app
const app = express()
const PORT = process.env.PORT || 5451
//Middlewares
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various S>
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  credentials: true
}
app.use(cors(corsOptions))
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
//app.use(express.static(__dirname + '/public'))
//app.use(express.static('/usr/share/nginx/html'))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({
    secret: "admin",
    saveUninitialized: true,
    resave: false
}))
//app.use("*", (req, res) => {
//    res.sendFile(path.join('/usr/share/nginx/html', "build", "index.html"));
//})
//app.use(express.urlencoded({extended: true}))
//Routes
const loginRouter = require('./Routes/login.route.js')
const logoutRouter = require('./Routes/logout.route.js')
const productosRouter = require('./Routes/productos.route.js')
const clientesRouter = require('./Routes/clientes.route.js')
const pedidosRouter = require('./Routes/pedidos.route.js')
app.use('/api/health', (req, res) => {
	res.send('OK')
	console.log('OK')
})
app.use('/api/login', loginRouter)
app.use('/api/logout', logoutRouter)
app.use('/api/productos', productosRouter)
app.use('/api/clientes', clientesRouter)
app.use('/api/pedidos', pedidosRouter)
//---------------------------------
//Listening
app.listen(PORT, (err) => { 
	if (err) {
		console.log('Backend error: ', err)
	} else {
		console.log(`Server running on port ${PORT}`)
	}
})
const bcrypt = require('bcrypt')
const { searchByExactValue } = require('../../containers/general.container')

const getLogInController = async (req, res) => {
    if (req.session.logged == true) {
        res.json({ logged: true, user: req.session.user })
    } else {
        res.json({ logged: false })
    }
}

const postLogInController = async (req, res) => {
    if (req.session.logged) {
        console.log('NOTIFICACION: USTED YA ESTÁ LOGUEADO')
        res.redirect('/')
    } else {
        const { username, password } = req.body
        searchByExactValue('USUARIOS', 'Username', username)
        .then(async (cuenta) => {
            cuenta = cuenta[0]
            if (cuenta) {
                const compare = await bcrypt.compare(password, cuenta.Password)
                if (compare) {
                    req.session.logged = true
                    req.session.user = username
                    res.redirect('/')
                } else {
                    console.log('Contraseña incorrecta')
                    res.json({ logged: false, status: 'error', message: 'Contraseña incorrecta' })
                }
            } else {
                console.log('Usuario no existente')
                res.json({ logged: false, status: 'error', message: 'Usuario no existente' })
            }
        })
        .catch((err) => {
            console.log(err)
        })
    }
}

module.exports = { getLogInController, postLogInController }
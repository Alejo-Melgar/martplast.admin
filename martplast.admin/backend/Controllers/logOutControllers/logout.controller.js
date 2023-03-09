const logOutController = (req, res) => {
    req.session.destroy(err => {
        if (!err) {
            console.log('Logged out')
        } else {
            console.log(err)
        }
    })
}

module.exports = { logOutController }
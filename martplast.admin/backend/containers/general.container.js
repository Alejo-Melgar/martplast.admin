const database = require("../DBconnection")

selectAll = (tablename) => {
    try {
        let command = `SELECT * FROM ${tablename}`
        
        if (tablename === 'PEDIDOS') {
            command = `SELECT * FROM ${tablename} ORDER BY NumeroDePedido DESC;`
        }
    
        return new Promise(function(resolve, reject){
            database.query(
                command, 
                function(err, rows, fields){                                              
                    if(rows === undefined){
                        reject(err);
                    }else{
                        const table = {
                            fields: fields,
                            rows: rows
                        }
                        resolve(table);
                    }
                }
        )})      
    } catch (error) {
        console.log(error)
    }
}

selectByField = (tablename, field) => {
    try {
        const command = `SELECT ${field} FROM ${tablename}`
    
        return new Promise(function(resolve, reject){
            database.query(
                command, 
                function(err, rows){                                              
                    if(rows === undefined){
                        reject(err);
                    }else{
                        resolve(rows);
                    }
                }
        )})        
    } catch (error) {
        console.log(error)
    }
}

searchBy = async (tablename, campo, valor) => {
    try {
        let command = `SELECT * FROM ${tablename} WHERE ${campo} LIKE "%${valor}%"`

        if  (tablename == 'PEDIDOS' && campo == 'Fecha') {
            command = `SELECT * FROM ${tablename} WHERE ${campo} LIKE "%${valor}" ORDER BY NumeroDePedido DESC;`
        }
        
        if (valor === undefined || valor === '' || valor === null || valor === 'undefined' || valor === 'null' || valor === ' ') {
            command = `SELECT * FROM ${tablename}`
        }
    
        return new Promise(function(resolve, reject){
            database.query(
                command, 
                function(err, results) {                                            
                    if(results === undefined){
                        reject(err);
                    } else{
                        resolve(results)
                    }
                }
        )})        
    } catch (error) {
        console.log(error)
    }
}

searchByExactValue = async (tablename, campo, valor) => {
    try {
        const command = `SELECT * FROM ${tablename} WHERE ${campo} = "${valor}"`
        return new Promise(function(resolve, reject){
            database.query(
                command, 
                function(err, results) {                                            
                    if(results === undefined){
                        reject(err);
                    } else{
                        resolve(results)
                    }
                }
        )})        
    } catch (error) {
        console.log(error)
    }
}


addNewRecord = async (addInfo) => {
    let added = true
    try {
        const {tablename, objRef} = addInfo
        const values = Object.values(objRef)
        const valuesWithQuotes = values.map(value => `"${value}"`)
        const command = `INSERT INTO ${tablename} VALUES (0, ${valuesWithQuotes});`

        if (tablename === 'PEDIDOS') {
            console.log(objRef.Pedido)

            const insertedId = await new Promise(function(resolve, reject){
                database.query(
                    command,
                    function(err, results) {
                        if(results === undefined){
                            reject(err);
                        } else{
                            resolve(results.insertId)
                        }
                    }
                )
            })

            objRef.Pedido.map(async (prod) => {
                const commandAddDetails = `INSERT INTO DETALLES_PEDIDO VALUES (${insertedId}, ${prod.id}, ${prod.Cantidad})`

                const hayStock = await calcularSiHayStock(prod.id, prod.Cantidad)

                console.log('hayStock: ', hayStock)

                await new Promise (function(resolve, reject){
                    if (hayStock) {
                        database.query(
                            commandAddDetails,
                            function(err, results) {
                                if(results === undefined){
                                    reject(err);
                                } else{
                                    resolve(results)
                                }
                            }
                        )
                        console.log('SALIO BIEN: ', added)
                        restarStock(prod.id, prod.Cantidad)
                    } else {
                        //NO STOCK
                        added = false
                        console.log('added no stock: ', added)
                    }
                })
            })
            
            console.log('GENERAL: ', added)
            return added
        } else {
            await new Promise(function(resolve, reject){
                database.query(
                    command,
                    function(err, results) {
                        if(results === undefined){
                            reject(err);
                        } else{
                            resolve(results)
                        }
                    }
                )
            })
            return added
        }
    } catch (error) {
        console.log('CATCH ERROR: ', error)
        added = false
    }
}

editById = async (tablename, idField, id_pedido, objRef) => {
    try {
        let prevValues
        if (tablename === 'PEDIDOS') {
            const commandPrevValues = `SELECT * FROM DETALLES_PEDIDO WHERE NumeroPedido = ${id_pedido}`
            prevValues = await new Promise(function(resolve, reject){
                    database.query(
                        commandPrevValues,
                        function(err, results) {
                            if(results === undefined){
                                reject(err);
                            } else{
                                resolve(results)
                            }
                        }
                    )
                })
        }
        const values = Object.values(objRef)
        const valuesWithQuotes = values.map(value => `"${value}"`)
        const command = `UPDATE ${tablename} SET ${idField} = ${id_pedido}, ${Object.keys(objRef).map((key, index) => `${key} = ${valuesWithQuotes[index]}`)} WHERE ${idField} = ${id_pedido};`
        
        
        if (tablename === 'PEDIDOS') {
            await new Promise(function(resolve, reject){
                database.query(
                    command,
                    function(err, results) {
                        if(results === undefined){
                            reject(err);
                        } else{
                            objRef.Pedido.map(async (prod) => {
                                const commandUpdateDetails = `UPDATE DETALLES_PEDIDO SET Cantidad = ${prod.Cantidad} WHERE NumeroPedido = ${id_pedido} AND Producto = ${prod.id}`
                                
                                const hayStock = await calcularSiHayStock(prod.id, prod.Cantidad)
                                if (hayStock) {
                                    console.log('hay stock')
                                    database.query(
                                        commandUpdateDetails,
                                        function(err, results) {
                                            if(results === undefined){
                                                reject(err);
                                            } else{
                                                prevValues.map((prevValue) => {
                                                    if (prevValue.Producto == prod.id) {
                                                        if (prevValue.Cantidad > prod.Cantidad) {
                                                            const Cantidad = prevValue.Cantidad - prod.Cantidad
                                                            sumarStock(prod.id, Cantidad)
                                                        } else {
                                                            const Cantidad = prod.Cantidad - prevValue.Cantidad
                                                            restarStock(prod.id, Cantidad)
                                                        }
                                                    }
                                                })

                                                // if not found in prevValues, then it's a new product
                                                if (!prevValues.find((prevValue) => prevValue.producto == prod.id)) {
                                                    const commandNewDetails = `INSERT INTO DETALLES_PEDIDO VALUES (${id_pedido}, ${prod.id}, ${prod.Cantidad})`
                                                    database.query(
                                                        commandNewDetails,
                                                        function(err, results) {
                                                            if(results === undefined){
                                                                reject(err);
                                                            } else{
                                                                restarStock(prod.id, prod.Cantidad)
                                                                resolve(results)
                                                            }
                                                        }
                                                    )
                                                }

                                                resolve(results)
                                            }
                                        }
                                    )
                                } else {
                                    console.log('No hay stock suficiente')
                                }
                            })
                        }
                        resolve(results)
                    }
                )}
            )   
        } else {
            await new Promise(function(resolve, reject){
                database.query(
                    command,
                    function(err, results) {
                        if(results === undefined){
                            reject(err);
                        } else{
                            resolve(results)
                        }
                    }
            )})        
        }

        
    } catch (error) {
        console.log(error)
    }
}

deleteById = async (tablename, campo, id) => {
    if (tablename === 'CLIENTES') {
        //buscar en los DETALLES_PEDIDO por todos los que tenga el producto y retorarn un array con todos los NumeroPedido que lo tengan
        let arrayNumeroPedido = []
        const command1 = `SELECT NumeroDePedido FROM PEDIDOS WHERE NumeroDeCliente = "${id}"`
        try {
            arrayNumeroPedido = await new Promise(function(resolve, reject){
                database.query(
                    command1,
                    function(err, results) {
                        if(results === undefined){
                            reject(err);
                        } else{
                            resolve(results)
                        }
                    }
                )
            })
        } catch (error) {
            console.log(error)
        }
        
        //recorrer el array de NumeroPedido y eliminar los DETALLES_PEDIDO que hagan referencia a ese NumeroPedido
        arrayNumeroPedido.map(async (NumeroPedido) => {
            const command2 = `DELETE FROM DETALLES_PEDIDO WHERE NumeroPedido = ${NumeroPedido.NumeroDePedido}`
            try {
                await new Promise(function(resolve, reject){
                    database.query(
                        command2,
                        function(err, results) {
                            if(results === undefined){
                                reject(err);
                            } else{
                                resolve(results)
                            }
                        }
                    )
                })
            } catch (error) {
                console.log(error)
            }
        })

        //recorrer la tabla de pedidos y eliminar los pedidos que hagan referencia al numero de cliente con id {id}
        const command3 = `DELETE FROM PEDIDOS WHERE NumeroDeCliente = ${id}`
        try {
            await new Promise(function(resolve, reject){
                    database.query(
                        command3,
                        function(err, results) {
                            if(results === undefined){
                                reject(err);
                            } else{
                                resolve(results)
                            }
                        }
                    )
                })
        } catch (error) {
            console.log(error)
        }    
    }

    if (tablename === 'PRODUCTOS') {
        //buscar en los DETALLES_PEDIDO por todos los que tenga el producto y retorarn un array con todos los NumeroPedido que lo tengan
        let arrayNumeroPedido = []
        const command = `SELECT NumeroPedido FROM DETALLES_PEDIDO WHERE Producto = "${id}"`
        try {
            arrayNumeroPedido = await new Promise(function(resolve, reject){
                database.query(
                    command,
                    function(err, results) {
                        if(results === undefined){
                            reject(err);
                        } else{
                            resolve(results)
                        }
                    }
                )
            })
        } catch (error) {
            console.log(error)
        }

        //recorrer el array de NumeroPedido y eliminarlos de la tabla DETALLES_PEDIDO
        arrayNumeroPedido.map(async (NumeroPedido) => {
            const command2 = `DELETE FROM DETALLES_PEDIDO WHERE NumeroPedido = "${NumeroPedido.NumeroPedido}"`  
            const command3 = `DELETE FROM PEDIDOS WHERE NumeroDePedido = "${NumeroPedido.NumeroPedido}"` 
            try {
                await new Promise(function(resolve, reject){
                    database.query(
                        command2,
                        function(err, results) {
                            if(results === undefined){
                                reject(err);
                            } else{
                                resolve(results)
                            }
                        }
                    )
                })

                await new Promise(function(resolve, reject){
                    database.query(
                        command3,
                        function(err, results) {
                            if(results === undefined){
                                reject(err);
                            } else{
                                resolve(results)
                            }
                        }
                    )
                })
            } catch (error) {
                console.log(error)
            }
        })
    }

    if (tablename === 'PEDIDOS') {
        const command = `SELECT * FROM DETALLES_PEDIDO WHERE NumeroPedido = "${id}"`
        try {
            await new Promise(function(resolve, reject){
                database.query(
                    command,
                    function(err, results) {
                        if(results === undefined){
                            reject(err);
                        } else{
                            results.map((prod) => {
                                sumarStock(prod.Producto, prod.Cantidad)
                            })
                            resolve(results)
                        }
                    }
                )
            })            
        } catch (error) {
            console.log(error)
        }

        const command2 = `DELETE FROM DETALLES_PEDIDO WHERE NumeroPedido = "${id}"`
        try {
            await new Promise(function(resolve, reject){
                database.query(
                    command2,
                    function(err, results) {
                        if(results === undefined){
                            reject(err);
                        } else{
                            resolve(results)
                        }
                    }
                )
            })
        } catch (error) {
            console.log(error)            
        }
    }
    const command = `DELETE FROM ${tablename} WHERE ${campo} = "${id}"`

    try {
        return new Promise(function(resolve, reject){
            database.query(
                command, 
                function(err, results) {                                            
                    if (results === undefined) {
                        reject(err);
                    } else {
                        resolve(results)
                    }
                }
        )})
    } catch (error) {
        console.log(error)        
    }
}

filterByField = async (tablename, campo, valor) => {
    const command = `SELECT * FROM ${tablename} WHERE ${campo} = "${valor}"`
    try {
        return new Promise(function(resolve, reject) {
            database.query(
                command, 
                function(err, results) {                                            
                    if(results === undefined){
                        reject(err);
                    } else{
                        resolve(results)
                    }
                }
            )
        })        
    } catch (error) {
        console.log(error)
    }
}

sortByField = (tablename, campo, direccion) => { // direccion ASC o DESC
    const command = `SELECT * FROM ${tablename} ORDER BY ${campo} ${direccion}`
    try {
        return new Promise(function(resolve, reject){
            database.query(
                command, 
                function(err, results) {                                            
                    if(results === undefined){
                        reject(err);
                    } else{
                        resolve(results)
                    }
                }
        )})        
    } catch (error) {
        console.log(error)
    }
}

restarStock = async (id, Cantidad) => {
    const command = `UPDATE productos SET Stock = Stock - ${Cantidad} WHERE NumeroDeProducto = "${id}"`
    try {
        return new Promise(function(resolve, reject){
            database.query(
                command,
                function(err, results) {
                    if(results === undefined){
                        reject(err);
                    } else{
                        resolve(results)
                    }
                }
        )})
    } catch (error) {
        console.log(error)
    }
}

sumarStock = async (id, Cantidad) => {
    const command = `UPDATE PRODUCTOS SET Stock = Stock + ${Cantidad} WHERE NumeroDeProducto = "${id}"`
    try {
        return new Promise(function(resolve, reject){
            database.query(
                command,
                function(err, results) {
                    if(results === undefined){
                        reject(err);
                    } else{
                        resolve(results)
                    }
                }
        )})
    } catch (error) {
        console.log(error)
    }
}

calcularSiHayStock = async (id, Cantidad) => {
    const command = `SELECT Stock FROM PRODUCTOS WHERE NumeroDeProducto = "${id}"`
    try {
        return new Promise(function(resolve, reject){
            database.query(
                command,
                function(err, results) {
                    if(results === undefined){
                        reject(err);
                    } else{
                        if (results[0].Stock >= Cantidad) {
                            resolve(true)
                        } else {
                            resolve(false)
                        }
                    }
                }
        )})
    } catch (error) {
        console.log(error)
    }
}

module.exports = { selectAll, restarStock, calcularSiHayStock, sumarStock, selectByField,  searchBy, searchByExactValue, addNewRecord, editById, deleteById, filterByField, sortByField }
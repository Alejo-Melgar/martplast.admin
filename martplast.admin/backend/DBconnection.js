const mysql = require('mysql');

const database = mysql.createConnection({
  host: "179.43.112.171",
  user: "root",
  port: "5450",
  password: "Martin123!",
  database: "martplast"
})

database.connect(function(err) {
  if (err) {
    console.error("Database error: " + err.stack);
    return
  }
  console.log("Connected!")
})


module.exports = database
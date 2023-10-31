
const mysql = require("mysql2");
require("dotenv").config();

var connection = mysql.createConnection({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    authPlugins: function ({ pluginName }, cb) {
        if (pluginName === 'mysql_native_password') {
          // Use the 'mysql_native_password' authentication method
          return cb(null);
        }
        // Handle other authentication methods here if needed
      }
});

connection.connect((error) =>{
    if(!error){
        console.log(`Was able to connect @ PORT: `, process.env.DB_PORT )
    }
    else{
        console.log(error)
    }
});

module.exports = connection
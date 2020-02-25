var bodyParser = require("body-parser");
var express = require("express");
var cors = require("cors");
var mysql = require("mysql");
var Xapi = require("./node_modules/xmysql/lib/xapi.js");
var morgan = require("morgan");
const colors = require('colors');
var app = express();

// /**************** START : setup express ****************/
app.use(morgan("tiny"));
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
// /**************** END : setup express ****************/

app.use(function(req, res, next) {
  // You can add authentication here
  console.log("Received request for: " + req.url);
  next();
});

var xmysqlConfig = {
  host: process.env.XMYSQL_DATABASE_HOST,
  port: process.env.XMYSQL_DATABASE_PORT,
  database: process.env.XMYSQL_DATABASE_NAME,
  user: process.env.XMYSQL_DATABASE_USER,
  password: process.env.XMYSQL_DATABASE_PASSWORD,
  apiPrefix: "/",
  ignoreTables: [],
  storageFolder: __dirname
};

var apiPort = process.env.XMYSQL_API_PORT || 3000;

var mysqlPool = mysql.createPool(xmysqlConfig);
var xapi = new Xapi(xmysqlConfig, mysqlPool, app);
xapi.init(function(err, results) {
  app.listen(apiPort);
  console.log(
    "          API's base URL        :    " +
      "localhost:" +
      apiPort
  );
  console.log("                                                            ");
  console.log(
    " - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - "
  );
});

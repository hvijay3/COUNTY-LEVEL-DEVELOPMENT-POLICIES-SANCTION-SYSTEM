/*jslint node: true, indent: 2 */
'use strict';
let Promise,oracledb,SimpleOracleDB;
Promise = require("bluebird"); //favourite promise library
oracledb = require('oracledb');
SimpleOracleDB = require('simple-oracledb');
SimpleOracleDB.extend(oracledb);
oracledb.Promise = Promise;//setting promise library tobluebird
oracledb.outFormat = oracledb.OBJECT;
oracledb.maxRows = 100000;


// Get Oracle Connection only 1 connection 
var connection = oracledb.getConnection(
  {
    // user          : "hv0",
    // password      : "Spide123!",
    user          : "harika",
    password      : "Oracleme893!",
    connectString : "oracle.cise.ufl.edu:1521/orcl",
  });

function respond(req, res, next) {
  
   connection.then(function(conn) {
    let options={};
    let query='';
    let type = req.params.type;

    if(type =='simple')
    {
    let N = parseInt(req.params.N);
    let selectrange = req.params.selectrange; 
    
    query = "select * from TABLE(povertyanalysis.poverty_employment(:top,:N,:selectrange))"
    options={
        N : N,
        selectrange: selectrange,
        top : 'top'
    }
    } 
    else if(type =='complex')
    {
    let Nc = parseInt(req.params.Nc);
    let criteriac = req.params.criteriac; 
    let operationc = req.params.operationc;

    query1 =  "select * from TABLE(povertyanalysis1.poverty_employmentP(:operationc,:criteriac,:Nc))"
    options = {
        operationc : operationc,
        criteriac: criteriac,
        Nc: Nc
      }
    }
  return conn.execute(query, options).then(function(result) {
          let output=result.rows;
          console.log(output);
          res.send(output);
        })
      }).catch(function(err) {
    console.error(err);
  });
      
}
 

module.exports = function (server) {
server.get('/poverty', respond);

};
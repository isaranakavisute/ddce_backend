const express = require('express');
const router = express.Router();
router.post('/', async function(req, res, next) 
{
console.log(
"username=",
req.body.usr,
",",
"password=",
req.body.pwd,
",",
"access=",
req.body.access
);

//connect to mysql database
const db = require('../db');
const config = require('../config');
const helper = require('../helper');
//var sql = "delete from user where usr='"+req.body.usr+"' and pwd='"+req.body.pwd+"' and access='"+req.body.access+"'";
var sql = "delete from user where user_id="+req.body.id;
console.log(sql);
await db.query(sql);
sql = "select * from user where user_id="+req.body.id;
console.log(sql);
const rows = await db.query(sql);
console.log(rows);
console.log(rows.length)
if (rows.length==0)
  {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write
    (
        JSON.stringify
        (
             {

                "status":true, 
                "deletion":
                 {
                  "result": "pass"
                 }

             }
        )
    );
    res.end();
  }
else
  {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write
    (
        JSON.stringify
        (
            {

                "status":true, 
                "deletion":
                 {
                  "result": "fail"
                 }

             }

        )
    );
    res.end();
  }

});
module.exports = router;

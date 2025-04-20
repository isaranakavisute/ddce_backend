const express = require('express');
const router = express.Router();
router.post('/', async function(req, res, next) 
{
console.log(
"id=",
req.body.id,
);

//connect to mysql database
const db = require('../db');
const config = require('../config');
const helper = require('../helper');
var sql = "select * from user where user_id=" + req.body.id ;
console.log(sql);
await db.query(sql);
const rows = await db.query(sql);
console.log(rows);
console.log(rows.length)
if (rows.length)
  {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write
    (
        JSON.stringify
        (
             {

                "status":true, 
                "user_search":
                 {
                  "user_id": req.body.id,
                  "search_result": "found",
                  "result": rows
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
                "user_search":
                {
                 "user_id": req.body.id,
                 "search_result": "not found",
                 "result": rows
                }
             }

        )
    );
    res.end();
  }

});
module.exports = router;

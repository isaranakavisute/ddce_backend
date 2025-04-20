const express = require('express');
const router = express.Router();
router.post('/', async function(req, res, next)
{
 console.log("username=",req.body.username,",password=",req.body.password);

 //connect to mysql database
 const db = require('../db');
 const config = require('../config');
 const helper = require('../helper');
 sql = "select * from user where email='" + req.body.usr + "' and password='" + req.body.pwd + "' and access_type='" + req.body.access  + "'";
 console.log(sql);
 var results = await db.query(sql);
 console.log(results);
 console.log(results.length);
 if (results.length)
 {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.write
  (
   JSON.stringify
    (
     {
      "status":true,
      "login":
       {
        "username": req.body.usr,
        "password": req.body.pwd,
        "access": req.body.access,
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
      "login":
      {
       "username": req.body.usr,
       "password": req.body.pwd,
       "access": req.body.access,
       "result": "fail"
      }
     }
    )
   );
   res.end();
}

});
module.exports = router;

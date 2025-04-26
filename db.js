const mysql = require('mysql2/promise');
const config = require('./config');

//var connection = null;

//async function start()
//{
// connection = await mysql.createPool(config.db);
//}

const connection = mysql.createPool(config.db);

async function query(sql, params) {
  //const connection = await mysql.createPool(config.db);
  const [results, ] = await connection.execute(sql, params);
  //connection.end();
  return results;
}

async function end() {
  //const connection = await mysql.createPool(config.db);
  //const [results, ] = await connection.execute(sql, params);
  await connection.end();
  return results;
}

module.exports = {
  query
}

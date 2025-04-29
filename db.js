const mysql = require('mysql2/promise');
const config = require('./config');


const connection = mysql.createPool(config.db);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function query(sql, params) {

 let myconnection;
 let myresults;

 try {
    // Getting a connection from the pool
    myconnection = await connection.getConnection();
    const [results, ] = await myconnection.execute(sql);
    myresults = results;
  } catch (error) {
    console.error('Error executing query:', error);
  } finally {
    await sleep(2000);

    // Don't forget to release the connection when finished!
    if (myconnection) myconnection.release();
  }


  return myresults;

}



module.exports = {
  query
}

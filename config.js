const config = {
    db: {
      host: "localhost",
      user: "isara",
      password: "1234",
      database: "mydb",
      connectTimeout: 60000,
      port: 3307,    //3306
      connectionLimit:  1000,
      timezone: 'Asia/Bangkok'
    },
    listPerPage: 10,
  };
  module.exports = config;

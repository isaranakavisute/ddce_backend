const config = {
    db: {
      host: "localhost",
      user: "isara",
      password: "1234",
      database: "mydb",
      connectTimeout: 60000,
      port: 3307,    //3306
      connectionLimit:  5000,
      timezone: "+07:00"
    },
    listPerPage: 10,
  };
  module.exports = config;

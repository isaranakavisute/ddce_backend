const config = {
    db: {
      host: "localhost",
      user: "isara",
      password: "1234",
      //database: "mydb",
      //tsubakimoto ...
      //database: "tsubakimoto",
      database: "akt1",
      //connectTimeout: 60000,
      port: 3306,    //3307
      connectionLimit:  3,
      timezone: "+07:00",
      waitForConnections: true,
      maxIdle: 3, // max idle connections, the default value is the same as `connectionLimit`
      idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0



    },
    listPerPage: 10,
  };
  module.exports = config;

const dotenv = require("dotenv");
dotenv.config();
(Cloudant = require("@cloudant/cloudant")),
  (config = {
    db: {
      username: process.env.CLOUDANT_USER_NAME,
      password: process.env.CLOUDANT_PASSWORD,
      host: process.env.CLOUDANT_HOST,
      port: process.env.CLOUDANT_PORT,
      url: process.env.CLOUDANT_URL,
      dbname: process.env.CLOUDANT_DB_NAME,
    },
  });

let createDataBase = function (cloudant, dbName) {
  cloudant.db
    .create(dbName)
    .then((data) => {
      console.log(
        "<" + dbName + "> " + "Database created successfully in Cloudant"
      );
    })
    .catch((err) => {
      console.error("Error creating the database <" + dbName + ">: " + err);
    });
};

exports.cloudantMod = () => {
  let username = config.db.username;
  let password = config.db.password;
  let url = config.db.url;
  let cloudant = Cloudant({
    url: url,
    username: username,
    password: password,
    maxAttempt: 5,
    plugins: {
      retry: {
        retryErrors: true,
        retryDelayMultiplier: 2,
        retryStatusCodes: [429],
      },
    },
  });

  createDataBase(cloudant, config.db.dbname);

  let db_name = cloudant.db.use(config.db.dbname);

  if (db_name) {
    return db_name;
  }
};

exports.config = config;

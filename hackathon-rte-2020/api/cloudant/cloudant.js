const Cloudant = require("@cloudant/cloudant");
const uuidv1 = require("uuid/v1");
const config = require("../../config/cloudant").config;

const cloudant = Cloudant({
  url: config.db.url,
  username: config.db.username,
  password: config.db.password,
  maxAttempt: 5,
  plugins: {
    retry: {
      retryErrors: true,
      retryDelayMultiplier: 2,
      retryStatusCodes: [429],
    },
  },
});
const db = cloudant.db.use(config.db.dbname);

module.exports = {
  query(type, query) {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(await db.partitionedFind(type, query));
      } catch (error) {
        reject(error);
      }
    });
  },
  bulkAdd(array) {
    return new Promise(async (resolve, reject) => {
      try {
        db.bulk({ docs: array })
          .then((body) => {
            resolve(body);
          })
          .catch((error) => {
            reject(error);
          });
      } catch (error) {
        reject(error);
      }
    });
  },
  findDocument(type, query) {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(await db.partitionedFind(type, query));
      } catch (error) {
        reject(error);
      }
    });
  },
  insertDocument(type, doc) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!doc._id) {
          let id = type.toLowerCase() + ":" + uuidv1();
          doc._id = id;
        }
        resolve(await db.insert(doc));
      } catch (error) {
        reject(error);
      }
    });
  },

  updateFile(doc) {
    return new Promise(async (resolve, reject) => {
      try {
        resolve(await db.insert(doc));
      } catch (error) {
        reject(error);
      }
    });
  },
};

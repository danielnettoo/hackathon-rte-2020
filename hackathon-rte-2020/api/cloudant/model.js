const rp = require("request-promise"),
  config = require("../../config/cloudant").config,
  cloudantDB = config.db.dbname,
  urlDB = config.db.url,
  nameDB = require("../../config/cloudant/index.js").cloudantMod(),
  optionFind = (id) => {
    return { method: "GET", uri: urlDB + "/" + cloudantDB + "/" + id };
  },
  optionQuery = (query) => {
    return {
      method: "POST",
      uri: urlDB + "/" + cloudantDB + "/_find",
      body: query || { selector: { _id: { $gt: 0 } }, fields: [] },
      json: true,
    };
  },
  // eslint-disable-next-line no-unused-vars
  optionAttach = (id, attach) => {
    return {
      method: "GET",
      encoding: "binary",
      uri: urlDB + "/" + cloudantDB + "/" + id + "/" + attach,
    };
  },
  optionView = (view) => {
    return {
      method: "GET",
      uri: urlDB + "/" + cloudantDB + "/" + "_design/Views/_view/" + view,
    };
  },
  // eslint-disable-next-line no-unused-vars
  optionSearch = (value, index, index2, search, design) => {
    return {
      method: "GET",
      uri: `${urlDB}/${cloudantDB}/_design/${design}/_search/${search}?q=${index}:${value} or ${index2}:${value}&include_docs=true`,
    };
  },
  optionCreate = (doc) => {
    return {
      method: "POST",
      uri: urlDB + "/" + cloudantDB,
      body: doc,
      json: true,
    };
  },
  optionDelete = (id, rev) => {
    return {
      method: "DELETE",
      uri: urlDB + "/" + cloudantDB + "/" + id + "?rev=" + rev,
      dataType: "json",
    };
  },
  promise = (option) => {
    return (resolve, reject) => {
      rp(option)
        .then((success) => resolve(success, 200))
        .catch((error) => reject(error));
    };
  };

module.exports = {
  // /**
  //  * Promise
  //  * Return the docs set on View in cloudant
  //  * @param view {String} - Set the view used in query
  //  * @returns {Array}
  //  */
  // viewDocument(view) {
  //   const option = optionView(view);
  //   const localPromise = promise(option);
  //   return new Promise(localPromise);
  // },
  // /**
  //  * Promise
  //  * Return a specific document from cloudant
  //  * @param id {String} - Document's Id
  //  * @returns {JSON}
  //  *  Document from cloudant
  //  */
  // findDocument(id) {
  //   const option = optionFind(id);
  //   const localPromise = promise(option);
  //   return new Promise(localPromise);
  // },
  // /**
  //  * Promise
  //  * Create a Document in Cloudant
  //  * @param doc {JSON} - Document to be created on cloudant
  //  * @returns {JSON}
  //  *  Return if the document was created or not
  //  */
  // createDocument(doc) {
  //   const option = optionCreate(doc);
  //   const localPromise = promise(option);
  //   return new Promise(localPromise);
  // },
  // /**
  //  * Promise
  //  * Update a Document in Cloudant (PS: The document must have the attr _id and _rev)
  //  * @param doc {JSON} - Document to be created on cloudant
  //  * @returns {JSON}
  //  *  Return if the document was updated or not
  //  */
  // updateDocument(doc) {
  //   if (!doc._id || !doc._rev) return false;
  //   const option = optionCreate(doc);
  //   const localPromise = promise(option);
  //   return new Promise(localPromise);
  // },
  // /**
  //  * Promise
  //  * This function run a query in cloudant
  //  * @param query {String} - Query to cloudant | if undefined or null the function will return all
  //  * @returns {JSON}
  //  *  Return the result of query
  //  */
  // query(query) {
  //   const option = optionQuery(query);
  //   const localPromise = promise(option);
  //   return new Promise(localPromise);
  // },
  // /**
  //  * Promise
  //  * Delete a Document in Cloudant
  //  * @param doc {JSON} - JSON with id and rev of document to be deleted
  //  * @returns {JSON}
  //  *  Return if the document was deleted or not
  //  */
  // deleteDocument(doc) {
  //   const option = optionDelete(doc._id, doc._rev);
  //   const localPromise = promise(option);
  //   return new Promise(localPromise);
  // },
};

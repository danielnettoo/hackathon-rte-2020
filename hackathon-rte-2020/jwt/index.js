const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  verify(token) {
    return new Promise(async (resolve, reject) => {
      jwt.verify(token, process.env.JWT_KEY, (err, authorizedData) => {
        if (err) {
          //If error send Forbidden (403)
          resolve({
            status: false,
            message: "Nao autorizado",
          });
        } else {
          //If token is successfully verified, we can send the autorized data
          resolve({
            status: true,
            message: "Successful log in",
          });
        }
      });
    });
  },

  sign(data) {
    return new Promise(async (resolve, reject) => {
      jwt.sign(
        { data },
        process.env.JWT_KEY,
        { expiresIn: "1y" },
        (err, token) => {
          if (err) {
            console.log(err);
            resolve("ERROR");
          }
          resolve(token);
        }
      );
    });
  },
};

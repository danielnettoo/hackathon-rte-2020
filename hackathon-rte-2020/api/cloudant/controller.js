const model = require("./model.js");

const axios = require("axios");

const { join } = require("path");
const cloudant = require("./cloudant.js");
const { query } = require("./model.js");
const { reset } = require("nodemon");

const jwt = require("../../jwt");

const fs = require("fs");
const VisualRecognitionV3 = require("ibm-watson/visual-recognition/v3");
const { IamAuthenticator } = require("ibm-watson/auth");

const visualRecognition = new VisualRecognitionV3({
  version: "2018-03-19",
  authenticator: new IamAuthenticator({
    apikey: "qeHPQyPQ0jnKxRYOMulLvs-wr7Aee_2LftslQmF4_QP3",
  }),
  url:
    "https://api.us-south.visual-recognition.watson.cloud.ibm.com/instances/988331f4-eae3-47a1-9558-b615207f83f3",
});

// const cron = require('node-cron');

// cron.schedule('* * * * *', () => {
//   console.log('running a task every minute');

//   const queryDocs = {
//     selector: {}
//   };

//   cloudant
//     .query('teste', queryDocs)
//     .then(result => {
//       console.log(result.docs);
//     })
//     .catch(error => {
//       console.log(error);
//     });
// });

(response = (res) => (data) => res.send(data)),
  (err = (res) => (err) => res.send(err));

module.exports = {
  // funçao para mostrar as propostas na tela na pagina de proposal invetory
  async get_user(req, res) {
    let matricula = req.body.matricula;

    const queryDocs = {
      selector: {
        matricula: matricula,
      },
    };
    cloudant
      .query("teste", queryDocs)
      .then((result) => {
        res.send(result.docs[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  },

  async create_user(req, res) {
    let matricula = req.body.matricula;

    let bluepages = await getEmailBluepages(matricula + "631");

    let documento = {
      matricula: matricula,
      nome: bluepages.nome,
      email: bluepages.email,
      manager: bluepages.manager,
      pontos: 0,
      horarios: [
        [0, false],
        [1, false],
        [2, false],
        [3, false],
        [4, false],
        [5, false],
        [6, false],
        [7, false],
        [8, false],
        [9, false],
        [10, false],
        [11, false],
        [12, false],
        [13, false],
        [14, false],
        [15, false],
        [16, false],
        [17, false],
        [18, false],
        [19, false],
        [20, false],
        [21, false],
        [22, false],
        [22, false],
        [23, false],
      ],
    };

    let confirm = await createDocument(documento);

    res.send(confirm);
  },

  async validation_token(req, res) {
    let horario = await getDate();

    let matricula = req.body.matricula;

    let func = await buscar_funcionario(matricula);

    let result = await classifyImage(imagem_path);

    if (result) {
      for (let i = 0; i < func.horarios.length; i++) {
        if (func.horarios[i][0] == horario) {
          func.horarios[i][1] = true;
        }
      }

      await updateNewVersion(func);

      res.send(true);
    } else {
      res.send(false);
    }
  },

  async validation_code(req, res) {
    let jwtResponse = await jwt.verify(req.params.code);

    // let teste = await jwt.sign("isso aqui é um teste para mim");
    // console.log(teste);
    // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiaXNzbyBhcXVpIMOpIHVtIHRlc3RlIHBhcmEgbWltIiwiaWF0IjoxNTk4NDgzODk1LCJleHAiOjE2MzAwNDE0OTV9.r4q_yMM9VdjhJv4osZ3Clvq7mpOimJM8OLOHlqywzBI

    if (jwtResponse.status) {
      let horario = await getDate();

      let matricula = req.body.matricula;

      let func = await buscar_funcionario(matricula);

      for (let i = 0; i < func.horarios.length; i++) {
        if (func.horarios[i][0] == horario) {
          func.horarios[i][1] = true;
        }
      }

      await updateNewVersion(func);

      res.send(true);
    } else {
      return res.status(403).json({
        status: false,
        message: "error",
      });
    }
  },
};

async function createDocument(documento) {
  return new Promise((resolve, reject) => {
    cloudant
      .insertDocument("teste", documento)
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log(error);
        resolve("ERROR");
      });
  });
}

async function getEmailBluepages(id) {
  return new Promise((resolve, reject) => {
    axios
      .get(
        process.env.BLUEPAGES_URL +
          "/BpHttpApisv3/slaphapi?ibmperson/serialnumber=" +
          id +
          "/byjson"
      )
      .then((body) => {
        let firstSearchResult = body.data.search.entry[0];

        let json = {
          ok: true,
          email: "",
          nome: "",
          manager: "jsouza@ibm.com",
        };

        for (let i = 0; i < firstSearchResult.attribute.length; i++) {
          if (firstSearchResult.attribute[i].name == "mail") {
            json.email = firstSearchResult.attribute[i].value[0];
          }

          if (firstSearchResult.attribute[i].name == "cn") {
            json.nome = firstSearchResult.attribute[i].value[0];
          }

          if (firstSearchResult.attribute[i].name == "hrorganizationcode") {
            json.hrorganizationcode = firstSearchResult.attribute[i].value[0];
          }
        }

        resolve(json);
      })
      .catch((error) => {
        resolve("ERROR");
        console.log(error);
      });
  });
}

async function getDate() {
  var d = new Date();

  let hora = d.getHours("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });

  return hora;
}

async function buscar_funcionario(matricula) {
  return new Promise((resolve, reject) => {
    const queryDocs = {
      selector: {
        matricula: matricula,
      },
    };
    cloudant
      .query("teste", queryDocs)
      .then((result) => {
        resolve(result.docs[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  });
}

async function updateNewVersion(doc) {
  return new Promise((resolve, reject) => {
    cloudant
      .updateFile(doc)
      .then((updateResult) => {
        resolve(updateResult);
      })
      .catch((updateError) => {
        console.log(updateError);
        resolve("ERROR");
      });
  });
}

async function classifyImage(imagem) {
  return new Promise((resolve, reject) => {
    const classifyParams = {
      imagesFile: fs.createReadStream(imagem),
      owners: ["IBM", "me"],
      classifier_ids: "c0d4e471-38f6-4d96-9e66-9b233816b7b8",
      threshold: 0.6,
    };

    visualRecognition
      .classify(classifyParams)
      .then((response) => {
        const classifiedImages = response.result;
        console.log(JSON.stringify(classifiedImages, null, 2));

        resolve(true);
      })
      .catch((err) => {
        console.log("error:", err);
        resolve(false);
      });
  });
}

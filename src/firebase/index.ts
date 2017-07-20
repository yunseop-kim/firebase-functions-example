import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
const serviceAccount = require("../simplecrud-f03a0-firebase-adminsdk-5gc9p-04b6db2078.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://simplecrud-f03a0.firebaseio.com"
});

const firebaseDB = admin.database();
const functionsHttps = functions.https;
const functionsDB = functions.database;

export { firebaseDB, functionsHttps, functionsDB };

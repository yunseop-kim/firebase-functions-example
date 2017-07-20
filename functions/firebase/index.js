"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const serviceAccount = require("../simplecrud-f03a0-firebase-adminsdk-5gc9p-04b6db2078.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://simplecrud-f03a0.firebaseio.com"
});
const firebaseDB = admin.database();
exports.firebaseDB = firebaseDB;
const functionsHttps = functions.https;
exports.functionsHttps = functionsHttps;
const functionsDB = functions.database;
exports.functionsDB = functionsDB;
//# sourceMappingURL=index.js.map
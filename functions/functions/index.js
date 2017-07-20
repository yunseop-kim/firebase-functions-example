"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const home_1 = require("./../controllers/home");
const firebase_1 = require("../firebase");
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = firebase_1.functionsHttps.onRequest(home_1.transactionTest);
exports.inputDivided = firebase_1.functionsDB
    .ref("/nodes/full/{pushId}")
    .onWrite(event => {
    const key = event.data.key;
    const { age, career, email, hobby, introduction, job, name } = event.data.val();
    console.log("values", event.data.val());
    const nodeA = { name, age, email };
    const nodeB = { career, job };
    const nodeC = { hobby, introduction };
    return firebase_1.firebaseDB
        .ref("/nodes")
        .child("node_a")
        .child(key)
        .set(nodeA)
        .then(() => {
        console.log("nodeA done");
        firebase_1.firebaseDB
            .ref("/nodes")
            .child("node_b")
            .child(key)
            .set(nodeB)
            .then(() => {
            console.log("nodeB done");
            firebase_1.firebaseDB
                .ref("/nodes")
                .child("node_c")
                .child(key)
                .set(nodeC)
                .then(() => {
                console.log("nodeC done");
            });
        });
    });
});
exports.editDivided = firebase_1.functionsDB
    .ref("/nodes/full/{pushId}")
    .onUpdate(event => {
    const key = event.data.key;
    const { age, career, email, hobby, introduction, job, name } = event.data.val();
    console.log("values", event.data.val());
    const nodeA = { name, age, email };
    const nodeB = { career, job };
    const nodeC = { hobby, introduction };
    return firebase_1.firebaseDB
        .ref("/nodes")
        .child("node_a")
        .child(key)
        .set(nodeA)
        .then(() => {
        console.log("nodeA updated");
        firebase_1.firebaseDB
            .ref("/nodes")
            .child("node_b")
            .child(key)
            .set(nodeB)
            .then(() => {
            console.log("nodeB updated");
            firebase_1.firebaseDB
                .ref("/nodes")
                .child("node_c")
                .child(key)
                .set(nodeC)
                .then(() => {
                console.log("nodeC updated");
            });
        });
    });
});
exports.removeDivided = firebase_1.functionsDB
    .ref("/nodes/full/{pushId}")
    .onDelete(event => {
    const key = event.data.key;
    return firebase_1.firebaseDB
        .ref("/nodes")
        .child("node_a")
        .child(key)
        .remove()
        .then(() => {
        console.log("nodeA removed");
        firebase_1.firebaseDB
            .ref("/nodes")
            .child("node_b")
            .child(key)
            .remove()
            .then(() => {
            console.log("nodeB removed");
            firebase_1.firebaseDB
                .ref("/nodes")
                .child("node_c")
                .child(key)
                .remove()
                .then(() => {
                console.log("nodeC removed");
            });
        });
    });
});
//# sourceMappingURL=index.js.map
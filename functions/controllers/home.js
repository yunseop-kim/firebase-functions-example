"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = require("../firebase");
/**
 * GET /
 * Home page.
 */
exports.showNode = (req, res) => {
    res.status(200).send({ test: "show" });
};
exports.inputNode = (req, res) => {
    const node = req.body;
    firebase_1.firebaseDB.ref("/nodes").child("full").push(node).then(snapshot => {
        res.status(201).send(snapshot.ref);
    });
};
exports.editNode = (req, res) => {
    const hash = req.params.hash;
    const node = req.body;
    firebase_1.firebaseDB
        .ref("/nodes")
        .child("full")
        .child(hash)
        .set(node)
        .then(snapshot => {
        res.status(200).send(snapshot);
    });
};
exports.deleteNode = (req, res) => {
    const hash = req.params.hash;
    firebase_1.firebaseDB.ref("/nodes").child("full").child(hash).remove().then(snapshot => {
        console.log(snapshot);
        res.status(204).send({ test: "delete" });
    });
};
exports.transactionTest = (req, res) => {
    let value = {
        user: req.body.user,
        ip: req.ip
    };
    const transactionRef = firebase_1.firebaseDB.ref("/nodes/transaction");
    const totalRef = transactionRef.child("total");
    totalRef.transaction(total => {
        if (total === null) {
            return 1;
        }
        else if (total < 100) {
            console.log("Current total:", total);
            return total + 1;
        }
        else {
            return;
        }
    }, (error, committed, snapshot) => {
        if (error) {
            console.log("Transaction failed abnormally!", error);
        }
        else if (!committed) {
            console.log("We aborted the transaction (because total was more than 100).");
        }
        else {
            console.log("total increased!");
            value = Object.assign(value, { total: snapshot.val() });
            transactionRef.push(value).then(snapshot => {
                console.log("pushed");
            });
        }
        console.log("User's data: ", snapshot.val());
    });
    res.end();
};
//# sourceMappingURL=home.js.map
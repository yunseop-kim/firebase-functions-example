"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    firebase_1.firebaseDB.ref("/nodes").child("full").child(hash).set(node).then(snapshot => {
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
exports.functionCall = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const test = yield firebase_1.firebaseDB.ref("/nodes/reservation").once("value");
    console.log(test.hasChild("0"));
    res.end();
});
/*
  트랜잭션 메소드에서 콜백으로 받는 value 값은 고정 값이다.
  일반 데이터베이스 트랜잭션과 firebase 트랜잭션의 차이는,
  일반 RDB의 트랜잭션은 트랜잭션이 이루어 지는 동안 그 행위에 침범하지 못하게 보장해 준다는 것.
  예를 들면, 해당 노드 내에 1~10의 데이터가 있는데,
  A라는 사용자는 11을 추가하고, B라는 사용자는 10을 제거한다.
  콜백으로 받는 값은 고정이므로, 둘 다 1~10의 데이터를 가져온다.
  그러나, commit 되는 것은 나중 사용자가 한 내용만이 commit이 되는 것이다.
  a가 의도한 바는 1~11의 값인데, b가 의도한 바는 1~9이다.
  두 사용자중 한명은 의도한 바를 제대로 받지 못하게 되는 문제가 발생하게 되는 것이다.
  고정 값에 대해서만 트랜잭션을 보장하는데, 노드 단위의 트랜잭션에 대해서는 보장받을 수가 없는 것.
*/
exports.transactionTest = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const { from, to, money } = req.body;
    let targetTo, targetFrom;
    const transactionRef = firebase_1.firebaseDB.ref("/nodes/bank");
    const fromRef = transactionRef.child(from);
    const toRef = transactionRef.child(to);
    transactionRef.transaction((currentObj) => {
        // If nodes/bank has never been set, values will be `null`.
        if (currentObj === null) {
            console.log("there are no users.");
            return {
                0: {
                    history: {
                        hash1: {
                            money: 1,
                            sender: 1,
                            receiver: "-",
                            date: 23424245
                        }
                    },
                    total: 10000
                },
                1: {
                    history: {
                        hash1: {
                            money: 1,
                            sender: "-",
                            receiver: 0,
                            date: 23424245
                        }
                    },
                    total: 10000
                }
            };
        }
        if (!currentObj.hasOwnProperty(to)) {
            console.log("there is no target user.");
            return;
        }
        if (!currentObj.hasOwnProperty(from)) {
            console.log("there is no sent user.");
            return;
        }
        targetTo = currentObj[to];
        targetFrom = currentObj[from];
        targetTo.total += money;
        targetFrom.total -= money;
        if (targetFrom.total <= 0) {
            console.log("there is no money");
            return;
        }
        else {
            console.log("success");
            return currentObj;
        }
    }, (error, committed, snapshot) => {
        if (error) {
            console.log("Transaction failed abnormally!", error);
            res.send({
                message: "Transaction failed abnormally! " + error
            });
        }
        else if (!committed) {
            console.log("We aborted the transaction");
            res.send({
                message: "We aborted the transaction"
            });
        }
        else {
            let curDate = new Date().getTime();
            transactionRef.child(to).child("history").push({
                money: money,
                type: "입금",
                content: from,
                date: curDate
            });
            transactionRef.child(from).child("history").push({
                money: money,
                type: "출금",
                content: to,
                date: curDate
            });
            console.log("pushed");
            res.send({
                message: "success"
            });
        }
        // console.log("User's data: ", snapshot.val());
    });
});
//# sourceMappingURL=home.js.map
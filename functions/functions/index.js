"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const home_1 = require("./../controllers/home");
const firebase_1 = require("../firebase");
const removeNode = (rootPath, nodePath, pushId) => {
    return firebase_1.firebaseDB.ref(rootPath).child(nodePath).child(pushId).remove();
};
exports.helloWorld = firebase_1.functionsHttps.onRequest(home_1.transactionTest);
exports.createFunction = firebase_1.functionsDB.ref("/nodes").onWrite(event => {
    const currentData = event.data.val();
    const previousData = event.data.previous;
    // const pushId: string = event.params.pushId;
    console.log("currentData:", currentData);
    console.log("previousData:", previousData.val());
    // if (currentData === null && previousData.exists()) {
    //     // 데이터가 삭제된 경우
    //     return firebaseDB.ref("/nodes/full").child(pushId).update(currentData).then(() => {
    //         console.log("deleted");
    //     });
    // }
    // else {
    //     // 데이터가 생성 혹은 수정된 경우
    //     return firebaseDB.ref("/nodes/full").child(pushId).update(currentData).then(() => {
    //         console.log("updated");
    //     });
    // }
    return;
});
exports.inputDivided = firebase_1.functionsDB.ref("/nodes/full/{pushId}").onCreate(event => {
    const key = event.data.key;
    const { age, career, email, hobby, introduction, job, name } = event.data.val();
    console.log("values", event.data.val());
    const nodeA = { name, age, email };
    const nodeB = { career, job };
    const nodeC = { hobby, introduction };
    return firebase_1.firebaseDB.ref("/nodes").child("node_a").child(key).set(nodeA).then(() => {
        console.log("nodeA done");
        firebase_1.firebaseDB.ref("/nodes").child("node_b").child(key).set(nodeB).then(() => {
            console.log("nodeB done");
            firebase_1.firebaseDB.ref("/nodes").child("node_c").child(key).set(nodeC).then(() => {
                console.log("nodeC done");
            });
        });
    });
});
exports.editDivided = firebase_1.functionsDB.ref("/nodes/full/{pushId}").onUpdate(event => {
    const key = event.data.key;
    const { age, career, email, hobby, introduction, job, name } = event.data.val();
    console.log("values", event.data.val());
    const nodeA = { name, age, email };
    const nodeB = { career, job };
    const nodeC = { hobby, introduction };
    return firebase_1.firebaseDB.ref("/nodes").child("node_a").child(key).set(nodeA).then(() => {
        console.log("nodeA updated");
        firebase_1.firebaseDB.ref("/nodes").child("node_b").child(key).set(nodeB).then(() => {
            console.log("nodeB updated");
            firebase_1.firebaseDB.ref("/nodes").child("node_c").child(key).set(nodeC).then(() => {
                console.log("nodeC updated");
            });
        });
    });
});
exports.removeDivided = firebase_1.functionsDB.ref("/nodes/full/{pushId}").onDelete(event => {
    const key = event.data.key;
    return firebase_1.firebaseDB.ref("/nodes").child("node_a").child(key).remove().then(() => {
        console.log("nodeA removed");
        firebase_1.firebaseDB.ref("/nodes").child("node_b").child(key).remove().then(() => {
            console.log("nodeB removed");
            firebase_1.firebaseDB.ref("/nodes").child("node_c").child(key).remove().then(() => {
                console.log("nodeC removed");
            });
        });
    });
});
//# sourceMappingURL=index.js.map
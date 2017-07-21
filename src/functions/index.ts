import { transactionTest } from "./../controllers/home";
import { firebaseDB, functionsHttps, functionsDB } from "../firebase";
import * as functions from "firebase-functions";
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

interface UserInfo {
    age: number;
    career: string;
    email: string;
    hobby: string;
    introduction: string;
    job: string;
    name: string;
}

const removeNode = (rootPath: string, nodePath: string, pushId: string): Promise<void> => {
    return firebaseDB.ref(rootPath).child(nodePath).child(pushId).remove();
};
export let helloWorld = functionsHttps.onRequest(transactionTest);

export let createFunction = functionsDB.ref("/nodes").onWrite(event => {
    // 입력이 들어오면, a,b,c 에 입력을 나누어 집어넣음.
    // 해야 할 것
    // 1. 새로운 데이터가 들어왔는지 알아야 함.
    // root node가 뭔지도 알아야 함.

    const currentData: UserInfo = event.data.val();
    const previousData: functions.database.DeltaSnapshot = event.data.previous;
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
export let inputDivided = functionsDB.ref("/nodes/full/{pushId}").onCreate(event => {
    const key = event.data.key;
    const { age, career, email, hobby, introduction, job, name } = event.data.val();

    console.log("values", event.data.val());

    const nodeA = { name, age, email };
    const nodeB = { career, job };
    const nodeC = { hobby, introduction };

    return firebaseDB.ref("/nodes").child("node_a").child(key).set(nodeA).then(() => {
        console.log("nodeA done");
        firebaseDB.ref("/nodes").child("node_b").child(key).set(nodeB).then(() => {
            console.log("nodeB done");
            firebaseDB.ref("/nodes").child("node_c").child(key).set(nodeC).then(() => {
                console.log("nodeC done");
              });
          });
      });
  });

export let editDivided = functionsDB.ref("/nodes/full/{pushId}").onUpdate(event => {
    const key = event.data.key;
    const { age, career, email, hobby, introduction, job, name } = event.data.val();

    console.log("values", event.data.val());

    const nodeA = { name, age, email };
    const nodeB = { career, job };
    const nodeC = { hobby, introduction };

    return firebaseDB.ref("/nodes").child("node_a").child(key).set(nodeA).then(() => {
        console.log("nodeA updated");
        firebaseDB.ref("/nodes").child("node_b").child(key).set(nodeB).then(() => {
            console.log("nodeB updated");
            firebaseDB.ref("/nodes").child("node_c").child(key).set(nodeC).then(() => {
                console.log("nodeC updated");
              });
          });
      });
  });

export let removeDivided = functionsDB.ref("/nodes/full/{pushId}").onDelete(event => {
    const key = event.data.key;

    return firebaseDB.ref("/nodes").child("node_a").child(key).remove().then(() => {
        console.log("nodeA removed");
        firebaseDB.ref("/nodes").child("node_b").child(key).remove().then(() => {
            console.log("nodeB removed");
            firebaseDB.ref("/nodes").child("node_c").child(key).remove().then(() => {
                console.log("nodeC removed");
              });
          });
      });
  });

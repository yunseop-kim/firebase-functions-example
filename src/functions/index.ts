import { transactionTest } from "./../controllers/home";
import { firebaseDB, functionsHttps, functionsDB } from "../firebase";
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
export let helloWorld = functionsHttps.onRequest(transactionTest);

export let inputDivided = functionsDB.ref("/nodes/full/{pushId}").onWrite(event => {
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

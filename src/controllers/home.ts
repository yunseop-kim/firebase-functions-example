import { Request, Response } from "express";
import { firebaseDB } from "../firebase";
import * as firebase from "firebase";
/**
 * GET /
 * Home page.
 */
export let showNode = (req: Request, res: Response) => {
  res.status(200).send({ test: "show" });
};
export let inputNode = (req: Request, res: Response) => {
  const node = req.body;
  firebaseDB.ref("/nodes").child("full").push(node).then(snapshot => {
    res.status(201).send(snapshot.ref);
  });
};
export let editNode = (req: Request, res: Response) => {
  const hash = req.params.hash;
  const node = req.body;
  firebaseDB.ref("/nodes").child("full").child(hash).set(node).then(snapshot => {
      res.status(200).send(snapshot);
    });
};

export let deleteNode = (req: Request, res: Response) => {
  const hash = req.params.hash;
  firebaseDB.ref("/nodes").child("full").child(hash).remove().then(snapshot => {
    console.log(snapshot);
    res.status(204).send({ test: "delete" });
  });
};

export let functionCall = async (req: Request, res: Response) => {
  const test: firebase.database.DataSnapshot = await firebaseDB.ref("/nodes/reservation").once("value");
  console.log(test.hasChild("0"));
  res.end();
};

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
export let transactionTest = async (req: Request, res: Response) => {
  const { from, to, money } = req.body;
  let targetTo: any, targetFrom: any;
  const transactionRef: firebase.database.Reference = firebaseDB.ref("/nodes/bank");
  const fromRef: firebase.database.Reference = transactionRef.child(from);
  const toRef: firebase.database.Reference = transactionRef.child(to);

  transactionRef.transaction(
    (currentObj: any) => {
      // If nodes/bank has never been set, values will be `null`.
      if (currentObj === null) {
        console.log("there are no users.");
        return {
          0 : {
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
          1 : {
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

      if ( targetFrom.total <= 0) {
        console.log("there is no money");
        return;
      } else {
        console.log("success");
        return currentObj;
      }
    },
    (error: Error, committed: boolean, snapshot: firebase.database.DataSnapshot) => {
      if (error) {
        console.log("Transaction failed abnormally!", error);
        res.send({
          message: "Transaction failed abnormally! " + error
        });
      } else if (!committed) {
        console.log("We aborted the transaction");
        res.send({
          message: "We aborted the transaction"
        });
      } else {
        let curDate: number = new Date().getTime();

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
    }
  );
};
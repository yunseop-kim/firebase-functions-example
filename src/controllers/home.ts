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

export let transactionTest = (req: Request, res: Response) => {
  const myInput: object = {
    [req.body.startNumber]: {
      endNumber : req.body.endNumber,
      name : req.body.name,
    }
  };

  console.log("myInput:", myInput);

  const transactionRef: firebase.database.Reference = firebaseDB.ref("/nodes/reservation");
  transactionRef.transaction(
    (values: any) => {
      if (values === null) {
        return myInput;
      } else if (!values.hasOwnProperty(req.body.startNumber)) {
        return Object.assign(values, myInput);
      } else {
        return;
      }
    },
    (error: Error, committed: boolean, snapshot: firebase.database.DataSnapshot) => {
      if (error) {
        console.log("Transaction failed abnormally!", error);
        res.send({
          message: "Transaction failed abnormally! " + error
        });
      } else if (!committed) {
        console.log("We aborted the transaction - Duplicate Request!");
        res.send({
          message: "We aborted the transaction - Duplicate Request!"
        });
      } else {
        console.log("pushed");
        res.send({
          message: "success"
        });
      }
      // console.log("User's data: ", snapshot.val());
    }
  );
};

import { Request, Response } from "express";
import { firebaseDB } from "../firebase";

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
  firebaseDB
    .ref("/nodes")
    .child("full")
    .child(hash)
    .set(node)
    .then(snapshot => {
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

export let transactionTest = (req: Request, res: Response) => {
  let value = {
    user: req.body.user,
    ip: req.ip
  };

  const transactionRef = firebaseDB.ref("/nodes/transaction");
  const totalRef = transactionRef.child("total");
  totalRef.transaction(
    total => {
      if (total === null) {
        return 1;
      } else if (total < 100) {
        console.log("Current total:", total);
        return total + 1;
      } else {
        return;
      }
    },
    (error, committed, snapshot) => {
      if (error) {
        console.log("Transaction failed abnormally!", error);
      } else if (!committed) {
        console.log(
          "We aborted the transaction (because total was more than 100)."
        );
      } else {
        console.log("total increased!");
        value = Object.assign(value, { total: snapshot.val() });
        transactionRef.push(value).then(snapshot => {
          console.log("pushed");
        });
      }
      console.log("User's data: ", snapshot.val());
    }
  );
  res.end();
};

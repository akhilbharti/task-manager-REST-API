// CRUD operations
// const mongodb = require("mongodb");
// const mongoclient = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectID;

const { MongoClient, ObjectID } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

// const id = new ObjectID();
// console.log(id.id.length);
// console.log(id.toHexString().length);

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      return console.log("unable to connect");
    }
    const db = client.db(databaseName);

    // db.collection("tasks").findOne(
    //   { _id: new ObjectID("5ce4250897a0192026473145") },
    //   result => {
    //     console.log(result);
    //   }
    // );

    // db.collection("tasks")
    //   .find({ status: false })
    //   .toArray(result => {
    //     console.log(result);
    //   });

    // db.collection("tasks").findOne(
    //   { _id: new ObjectID("5ce4250897a0192026473143") },
    //   (error, result) => {
    //     if (error) {
    //       console.log("not able to fetch");
    //     }
    //     console.log(result);
    //   }
    // );

    // db.collection("tasks")
    //   .find({ status: false })
    //   .toArray((error, result) => {
    //     console.log(result);
    //   });

    // db.collection("users")
    //   .updateOne(
    //     {
    //       _id: new ObjectID("5ce3b411922de443fd87a4f9")
    //     },
    //     {
    //       $inc: {
    //         age: 1
    //       }
    //     }
    //   )
    //   .then(result => {
    //     console.log(result);
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });

    // db.collection("tasks")
    //   .updateMany(
    //     {
    //       status: true
    //     },
    //     {
    //       $set: {
    //         status: false
    //       }
    //     }
    //   )
    //   .then(result => {
    //     console.log(result);
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });

    // db.collection("users")
    //   .deleteMany({
    //     age: 26
    //   })
    //   .then(result => {
    //     console.log(result);
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });

    db.collection("tasks")
      .deleteOne({ description: "naming" })
      .then(res => {
        console.log(res);
      })
      .catch(error => {
        console.log(error);
      });
  }
);

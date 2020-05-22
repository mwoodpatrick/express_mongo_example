// https://zellwk.com/blog/crud-express-mongodb/
// http://mongodb.github.io/node-mongodb-native/3.4/quick-start/quick-start/
const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

// Connection URL
const url = "mongodb://localhost:27017";

// Database Name
const dbName = "myproject";

const insertDocuments = function (db, callback) {
  // Get the documents collection
  const collection = db.collection("documents");
  // Insert some documents
  collection.insertMany([{ a: 1 }, { a: 2 }, { a: 3 }], function (err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
};

const listDocuments = function (db, callback) {
  const collection = db.collection("documents");

  collection.find({}).toArray(function (err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs);
    callback(docs);
  });
};
// Create a new MongoClient
const client = new MongoClient(url, { useUnifiedTopology: true });

// Use connect method to connect to the Server
client.connect(function (err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  insertDocuments(db, function () {
    listDocuments(db, function () {
      client.close();
    });
  });
});

app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/quotes", (req, res) => {
  console.log(req.body);
});

app.listen(3000, function () {
  console.log("listening on 3000");
});

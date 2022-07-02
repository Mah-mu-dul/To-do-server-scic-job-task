const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jiysy.mongodb.net/?retryWrites=true&w=majority`;
app.get("/", (req, res) => {
  res.send("server is alive, everything is cool");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const todolist = client.db("todo-pip").collection("todos");

    // get tasks according to email
    app.get("/todos/:email", async (req, res) => {
      const e = req.params.email;
      const query = { email: e,status:"incomplete" };
      const cursor = todolist.find(query);
      const todos = await cursor.toArray();
      res.send(todos);
    });
    // get complete tasks according to email and status
    app.get("/complete/:email", async (req, res) => {
      const e = req.params.email;
      const query = { email: e, status: "done" };
      const cursor = todolist.find(query);
      const todos = await cursor.toArray();
      res.send(todos);
    });
    // get  all tasks 
    app.get("/todos", async (req, res) => {
      const e = req.params.email;
      const query = {} ;
      const cursor = todolist.find(query);
      const todos = await cursor.toArray();
      res.send(todos);
    });
    // post a task
    app.post("/todos", async (req, res) => {
      const task = req.body;
      const result = await todolist.insertOne(task);
      res.send(result);
    });

    // update complete status
 app.put("/done/:id", async (req, res) => {
   const id = req.params.id;
   const updatedItem = req.body;
   console.log(updatedItem);
   const filter = { _id: ObjectId(id) };
   const options = { upsert: true };
   const updatedDoc = {
     $set: {
       status: updatedItem.status,
     },
   };
   const result = await todolist.updateOne(filter, updatedDoc, options)
   res.send({ result });
 });
  } finally {
  }
}
run().catch(console.dir);
app.listen(port, () => {
  console.log(`no problem`);
});

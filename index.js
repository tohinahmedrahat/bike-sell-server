const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

const uri = `mongodb+srv://${process.env.USER_ID}:${process.env.USER_PASSWORD}@cluster0.mk9rehn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
      const category = client.db("bikeCollection").collection("category");
      const bikes = client.db("bikeCollection").collection("bikes")
      const user = client.db("bikeCollection").collection("user")
      // get all tour
      app.get("/category", async(req,res) => {
        const query = {}
        const cursor = category.find(query)
        const result = await cursor.toArray()
        res.send(result)
      })
    
    app.get("/category/:name",async(req,res) =>{
        const name = req.params.name
        const query = {name:name}
        const result = await bikes.find(query)
        res.send(result)
    })
    // get review with service name
    app.get("/user",async(req,res)=>{
      const emails = req.query.email;
      const query = {emali:emails}
      const result =await user.findOne(query)
      res.send(result)
    })
      app.post("/user", async(req,res) => {
        const users = req.body
          const result = await user.insertOne(users)
          res.send(result)
      })
      
      // get review with email 
      app.get("/",async(req,res)=>{
        const email = req.query.email;
        const query = {userEmail:email}
        const cursor = review.find(query)
        const result = await cursor.toArray()
        res.send(result)
      })
      // delete review from user 
      app.delete("/user/:id",async(req,res)=>{
        const id = req.params.id;
        console.log(id)
        const query = {_id:ObjectId(id)}
        const result = await review.deleteOne(query)
        res.send(result)
      })
      
    // update review 
    app.put('/user/:id', async (req, res) => {
      const _id = req.params.id;
      const data = req.body;
      const query = { _id: ObjectId(_id) };
      const options = { upsert: true };
      const updateDoc = {
          $set: {
            role:data
          }
      };
      const result = await review.updateOne(query, updateDoc, options);
      res.send(result)
      // console.log(data)
  })

}
     finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
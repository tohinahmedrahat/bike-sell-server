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
      const order = client.db("bikeCollection").collection("order")
      const advertisement = client.db("bikeCollection").collection("advertisement")
      // add category
      app.post("/addCategory",async(req,res) => {
        const categorys = req.body;
        const result = await category.insertOne(categorys)
        res.send(result)
      })
      // get all category
      app.get("/category", async(req,res) => {
        const query = {}
        const cursor = category.find(query)
        const result = await cursor.toArray()
        res.send(result)
      })
    app.get("/product",async(req,res) =>{
        const name = req.query.category
        const query = {category:name}
        const data = bikes.find(query)
        const result = await data.toArray()
        res.send(result)
    })
    // get only sing in byer product
    app.get("/products",async(req,res) =>{
        const emails = req.query.email
        const query = {userEmail:emails}
        const data = bikes.find(query)
        const result = await data.toArray()
        res.send(result)
    })
    app.post("/addproduct",async(req,res) => {
      const categorys = req.body;
      const result = await bikes.insertOne(categorys)
      res.send(result)
    })
    
    // get user
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
      app.post("/order", async(req,res) => {
        const users = req.body
          const result = await order.insertOne(users)
          res.send(result)
      })
      app.get("/order",async(req,res) =>{
        const emails = req.query.email
        const query = {email:emails}
        const data = order.find(query)
        const result = await data.toArray()
        res.send(result)
    })
    app.get("/alluser", async (req,res) => {
      const query= {}
      const cursor = user.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })
      // // get review with email 
      // app.get("/",async(req,res)=>{
      //   const email = req.query.email;
      //   const query = {userEmail:email}
      //   const cursor = review.find(query)
      //   const result = await cursor.toArray()
      //   res.send(result)
      // })
      // delete product from seller 
      app.delete("/product/:id",async(req,res)=>{
        const id = req.params.id;
        console.log(id)
        const query = {_id:ObjectId(id)}
        const result = await bikes.deleteOne(query)
        res.send(result)
      })
      //  add advertisement
      app.post("/advertisement", async(req,res) => {
        const product = req.body
          const result = await advertisement.insertOne(product)
          res.send(result)
      })
    // update review 
    app.put('/user/:id', async (req, res) => {
      const _id = req.params.id;
      const query = { _id: ObjectId(_id) };
      const options = { upsert: true };
      const updateDoc = {
          $set: {
            verfiyed:true
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
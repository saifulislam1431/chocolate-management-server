const express = require('express');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8cnv71c.mongodb.net/?retryWrites=true&w=majority`;

app.use(cors());
app.use(express.json())





// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    await client.connect();

    const chocolateCollection = client.db("chocolateServer").collection("chocolates");
    // Read data
    app.get("/chocolates", async(req,res)=>{
      const cursor = chocolateCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    app.get("/chocolates/:id", async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await chocolateCollection.findOne(query)
      res.send(result);
    })


    // Create data
    app.post("/chocolates",async(req,res)=>{
      const newChocolate = req.body;
      const result = await chocolateCollection.insertOne(newChocolate)
      res.send(result)
    })

    // Delete Data
    app.delete("/chocolates/:id", async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await chocolateCollection.deleteOne(query)
      res.send(result);
    })

    // Update Data
    app.put("/chocolates/:id", async(req,res)=>{
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)};
      const option = {upsert : true};
      const updatedChocolate = req.body;
      const update = {
        $set:{
          name : updatedChocolate.name,
          country : updatedChocolate.country,
          category : updatedChocolate.category,
          photo : updatedChocolate.photo
        }
      }
      const result = await chocolateCollection.updateOne(filter , update, option)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/",(req,res)=>{
    res.send("This is chocolate server");
})


app.listen(port , ()=>{
console.log(`This server listen at port: ${port}`);
})
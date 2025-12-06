const express=require("express")
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app=express()
const cors=require("cors");
const port=process.env.port||3000;
// middleware
app.use(cors())
app.use(express.json())
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xbqvadl.mongodb.net/?appName=Cluster0`;
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
    const dataBase=client.db('Home_Service')
    const homeServices=dataBase.collection('services')
    const bookings=dataBase.collection('bookings')
    // get all services from the database
    app.get('/services',async(req,res)=>{
      const cursor=homeServices.find();
      const result=await cursor.toArray();
      res.send(result) 
    })
    // for details
    app.get('/services/:id',async (req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)}
      const result=await homeServices.findOne(query);
      res.send(result);
    })
    // adding services to database
    app.post('/services',async(req,res)=>{
        const data=req.body;
        const result=await homeServices.insertOne(data);
        res.send(result);
    })
    // adding my service
    app.get('/services',async (req,res)=>{
      const email=req.query.email
      const query={}
      if(email){
        query.providerEmail=email;
      }
      const cursor=homeServices.find(query)
      const result=await cursor.toArray()
      res.send(result)
    })
    // updating service data
    app.patch('/services/:id',async(req,res)=>{
      const id=req.params.id;
      const updatedService=req.body;
      const query={_id:new ObjectId(id),
        providerEmail:req.body.providerEmail
      }
      const update={
        $set:updatedService
      }
      const options={}
      const result=await homeServices.updateOne(query,update,options)
      res.send(result)
    })
    // deleting service data
    app.delete('/services/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id),
        providerEmail: req.body.providerEmail
      }
      const result=await homeServices.deleteOne(query)
      res.send(result)
    })
    // bookings collection
    app.post('/bookings',async(req,res)=>{
      const newBooking=req.body
      const result=await bookings.insertOne(newBooking);
      res.send(result);
    })
    // my bookings
    app.get('/bookings',async(req,res)=>{
      const email=req.query.email;
      console.log(email)
      const query={}
      if(email){
        query.userEmail=email
      }
      const cursor=bookings.find(query)
      const result=await cursor.toArray()
      res.send(result)
    })
    // 
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);
app.get('/',(req,res)=>{
    res.send("homehero backend server is running")
})
app.listen(port,()=>{
    console.log(`backend server is running on ${port}`)
})
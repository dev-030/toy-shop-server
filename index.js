const express = require('express');
const app = express()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(express.json())
app.use(cors());

  

const uri = "mongodb+srv://test:K4eBYlSmrhWdqTJI@cluster0.qcnne9d.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
[]
async function run() {
  try {
    client.connect();

    const db = client.db('assignment-11').collection('collection0')


    app.get('/' , async(req,res) => {
        const result = await db.find().limit(20).toArray()
        res.send(result)
    })

    app.get('/category' , async(req,res) => {
        let query = {} ;
        query = {category : req.query.category}
        const result = await db.find(query).limit(6).toArray()
        res.send(result)
    })

    app.get('/my-toys' , async(req,res) => {
        let query = {} ;
        query = {sellerEmail : req.query.email}
        const result = await db.find(query).toArray()
        res.send(result)
    })

    app.get('/my-toys/sort', async(req, res) => {
        let query = {} ;
        query = {sellerEmail : req.query.email}
        const result = await db.find(query).sort({price:parseInt(req.query.sorting)}).toArray()
        res.send(result);
    })

    app.get('/all-toys/:id' , async(req,res) => {
        const query = {_id : new ObjectId(req.params.id)}
        const result = await db.find(query).toArray()
        res.send(result)
    })

    app.post('/addtoys' , async(req,res) => {
        const data = {
            name : req.body.name ,
            image: req.body.image,
            price: parseInt(req.body.price),
            rating : parseInt(req.body.rating),
            quantity : parseInt(req.body.quantity),
            description : req.body.description,
            category : req.body.category,
            sellerName : req.body.sellerName,
            sellerEmail : req.body.sellerEmail,
        }
        const result =await db.insertOne(data)
        res.send(result)
    })

    app.put('/' , async(req,res) => {
        const filter = {_id : new ObjectId(req.body.id)}
        const options = { upsert : true }
        const update = {
            $set: {
            name : req.body.name ,
            price : req.body.price,
            quantity : req.body.quantity,
            description :req.body.description ,
            rating : req.body.rating
            }
        }
        const result = await db.updateOne(filter,update,options)
        res.send(result)
    })
  
    app.delete('/my-toys' , async(req,res) => {
        const query = {_id : new ObjectId(req.body.data)}
        const result = await db.deleteOne(query)
        res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);





app.listen(process.env.PORT || 3000, () => {console.log('listening')})

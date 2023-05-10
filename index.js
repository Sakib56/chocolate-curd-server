const express = require('express');
const cors = require('cors');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

// console.log(process.env.USER_ID)

const uri = `mongodb+srv://${process.env.USER_ID}:${process.env.DB_PASS}@cluster0.ngmeevb.mongodb.net/?retryWrites=true&w=majority`;

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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // const database = client.db("chocolateDB");
        // const chocolateCollection = database.collection("chocolate");
        // const chocolateCollection = client.db("chocolateDB").collection('chocolate')
        const database = client.db("chocolateDB");
        const chocolateCollection = database.collection("chocolate");

        app.get('/chocolates', async (req, res) => {
            const chocolates = chocolateCollection.find()
            const result = await chocolates.toArray()
            res.send(result)
        })

        app.get('/chocolates/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await chocolateCollection.findOne(query)
            res.send(result)

        })

        app.post('/chocolates', async (req, res) => {
            const chocolates = req.body;
            console.log('New Chocolates', chocolates)
            const result = await chocolateCollection.insertOne(chocolates);
            res.send(result)
        })

        app.put('/chocolates/:id', async (req, res) => {
            const id = req.params.id;
            const chocolate = req.body;
            console.log(chocolate)
            const filter = { _id: new ObjectId(id) }
            const option = { upset: true };
            const updatedChocolate = {
                $set: {
                    name: chocolate.name,
                    country: chocolate.country,
                    category: chocolate.category,
                    url: chocolate.url
                }
            }
            const result = await chocolateCollection.updateOne(filter, updatedChocolate, option)
            res.send(result)
        })

        app.delete('/chocolates/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: new ObjectId(id) }
            const result = await chocolateCollection.deleteOne(query)
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



app.get('/', (req, res) => {
    res.send('chocolate server is running');
})
app.listen(port, () => {
    console.log(`chocolate server is running on port ${port}`)
})
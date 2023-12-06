const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { client } = require('./mongodb');
const { ObjectId } = require('mongodb');

dotenv.config();
const app = express();
const port = process.env.PORT || 8000

// middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.listen(port, async () => {
    console.log(`The app is running at http://localhost:${port}`)
    try {
        // Connect to your Atlas cluster
        await client.connect();
        console.log("Successfully connected to Atlas");

        app.get('/', (req, res) => {
            res.send('app is running correctly')
        })

        app.get('/foods', async (req, res) => {
            const foods = await client.db('foodDB').collection('foodsCollection').find({}).toArray()
            res.send(foods)
        })

        app.get('/foods/food/:id', async (req, res) => {
            const foods = await client
                .db('foodDB')
                .collection('foodsCollection')
                .findOne({ _id: new ObjectId(req.params.id) })
            // .toArray();
            res.send(foods)
        })

        app.get('/foods/:type', async (req, res) => {
            console.log(req.params)
            const specificTypedFoods = await client
                .db('foodDB')
                .collection('foodsCollection')
                .find({ type: req.params.type })
                .toArray();
            res.send(specificTypedFoods)
        })

        app.get('/foodTypes', async (req, res) => {
            const foodTypes = await client.db('foodDB').collection('foodTypes').find({}).toArray()
            res.send(foodTypes)
        })

        app.get('/foodTypes/:type', async (req, res) => {
            const singleFoodType = await client
                .db('foodDB')
                .collection('foodTypes')
                .findOne({ type: req.params.type })
            res.send(singleFoodType)
        })

        app.get('/orderedFoods/:email', async (req, res) => {
            console.log(req.params.email)
            const result = await client.db('foodDB').collection('orderedFoods').find({ 'client.email': req.params.email }).toArray();
            res.send(result)
        })

        app.delete('/orderedFoods/:id', async (req, res) => {
            console.log(req.params.id)
            const result = await client.db('foodDB').collection('orderedFoods').deleteOne({ _id: new ObjectId(req.params.id) })
            res.send(result)
        })

        app.post('/foodOrder', async (req, res) => {
            console.log(req.body)
            const result = await client.db('foodDB').collection('orderedFoods').insertOne(req.body);
            console.log(result)
            res.send(result)
        })

        app.post('/addFood', async (req, res) => {
            const data = req.body;
            console.log('you are nothing', data)
            const result = await client.db('foodDB').collection('foodsCollection').insertOne(data)
            console.log(result)
            res.send(result)
        })


    } catch (err) {
        console.log(err.stack);
    } finally {
        // await client.close();
    }
})
const { MongoClient } = require("mongodb");

const dotenv = require('dotenv');
dotenv.config();
 
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.n469tyl.mongodb.net/`;

// Connect to your Atlas cluster
const client = new MongoClient(url);

exports.client = client;
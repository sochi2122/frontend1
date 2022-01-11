///////////////////////////////
// DEPENDENCIES
////////////////////////////////
// get .env variables
require('dotenv').config()
// pull PORT from .env, give default value of 3001
const { PORT = 3001, DATABASE_URL } = process.env
// const PORT = process.env || 3001
// import express from 'express
const express = require('express')
// create application object 
const app = express()
// import mongoose
const mongoose = require('mongoose')
// import middleware...req => middleware => route => res
const cors =require('cors') 
const morgan = require('morgan')


///////////////////////////////
// DATABASE CONNECTION
////////////////////////////////
// Establish Connection
mongoose.connect(DATABASE_URL)
// Connection Events
mongoose.connection
  .on("open", () => console.log("You are connected to MongoDB"))
  .on("close", () => console.log("You are disconnected from MongoDB"))
  .on("error", (error) => console.log(error))

///////////////////////////////
// MODELS
////////////////////////////////
const PeopleSchema = new mongoose.Schema({ 
    name: String,
    image: String,
    title: String
})

const People = mongoose.model('People', PeopleSchema)

///////////////////////////////
// MiddleWare
////////////////////////////////
app.use(cors())
app.use(morgan('dev'))
app.use(express.json()) // JSON.parse("{"name":"joe"}") => {name: joe}

///////////////////////////////
// ROUTES
////////////////////////////////
// create a test route 
app.get('/', (req,res) => {
    res.send('hello world')
})

// PEOPLE INDEX ROUTE - GET
// async/await
app.get('/people', async(req, res) => {
    try{
        res.json(await People.find({}))
    } catch(error) {
        res.status(400).json(error)
    } 
})
// PEOPLE INDEX ROUTE - POST
app.post('/people', async(req, res) => { 
    try {
        res.json(await People.create(req.body))
    } catch(error){
        res.status(400).json(error);
    }
})

// PEOPLE DELETE ROUTE
app.delete('/people/:id', async (req, res) => {
	try {
		res.json(await People.findByIdAndDelete(req.params.id));
	} catch (error) {
		res.status(400).json(error);
	}
});

// PEOPLE UPDATE ROUTE
app.put('/people/:id', async (req, res) => {
	try {
		res.json(await People.findByIdAndUpdate(req.params.id, req.body, {new: true}));
	} catch (error) {
		res.status(400).json(error);
	}
});


///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`))
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connection URI and MongoDB client
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
let db;

// Connect to MongoDB
async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB!");
        db = client.db(process.env.DB_NAME); // Database name from .env
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1); // Exit the process if MongoDB connection fails
    }
}

connectToMongoDB();

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the server!');
});

// Route to retrieve logs
app.get('/logs', async (req, res) => {
    try {
        const logsCollection = db.collection('logs');
        const logs = await logsCollection.find({}).toArray();
        res.status(200).json(logs); // Send logs as JSON
    } catch (err) {
        console.error('Error retrieving logs:', err);
        res.status(500).send('Error retrieving logs from database');
    }
});

// Route to add a log entry
app.post('/logs', async (req, res) => {
    const { message } = req.body;
    console.log('Received log from client:', message); // Log to console for server

    const logEntry = {
        message,
        timestamp: new Date().toISOString(),
    };

    try {
        // Insert log into MongoDB
        const logsCollection = db.collection('logs');
        await logsCollection.insertOne(logEntry);

        // Optionally append log to a file
        fs.appendFile('client-logs.txt', `${logEntry.timestamp}: ${logEntry.message}\n`, (err) => {
            if (err) {
                console.error('Failed to write log to file:', err);
            }
        });

        res.status(201).send('Log created');
    } catch (error) {
        console.error('Failed to log message to MongoDB:', error);
        res.status(500).send('Error logging message');
    }
});

// Route to update a log by ID
app.put('/logs/:id', async (req, res) => {
    const { id } = req.params;
    const { message } = req.body;

    try {
        const logsCollection = db.collection('logs');
        const result = await logsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { message, timestamp: new Date().toISOString() } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).send('Log not found or not updated');
        }

        res.status(200).send('Log updated');
    } catch (error) {
        console.error('Failed to update log:', error);
        res.status(500).send('Error updating log');
    }
});

// Route to delete a log by ID
app.delete('/logs/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const logsCollection = db.collection('logs');
        const result = await logsCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).send('Log not found');
        }

        res.status(200).send('Log deleted');
    } catch (error) {
        console.error('Failed to delete log:', error);
        res.status(500).send('Error deleting log');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

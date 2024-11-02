const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connection URI and MongoDB client
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);
let db;

// Connect to MongoDB
async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB!");
        db = client.db('numer'); // Set your database name
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}

connectToMongoDB();

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the server!');
});

// Route to display logs
app.get('/logs', async (req, res) => {
    try {
        const logsCollection = db.collection('logs');
        const logs = await logsCollection.find({}).toArray();
        res.status(200).json(logs); // Return logs as JSON
    } catch (err) {
        console.error('Error retrieving logs:', err);
        res.status(500).send('Error retrieving logs from database');
    }
});

// Logging route for client logs
app.post('/logs', async (req, res) => {
    const { message } = req.body;
    console.log('Received log from client:', message); // Log to server console

    // Create log object to store in MongoDB
    const logEntry = {
        message: message,
        timestamp: new Date().toISOString(),
    };

    try {
        // Append log to MongoDB
        const logsCollection = db.collection('logs');
        await logsCollection.insertOne(logEntry);

        // Append log to a file as well (optional)
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

// Update a log by ID
app.put('/logs/:id', async (req, res) => {
    const { id } = req.params;
    const { message } = req.body;

    try {
        const logsCollection = db.collection('logs');
        await logsCollection.updateOne({ _id: new ObjectId(id) }, { $set: { message, timestamp: new Date().toISOString() } });
        res.status(200).send('Log updated');
    } catch (error) {
        console.error('Failed to update log:', error);
        res.status(500).send('Error updating log');
    }
});

// Delete a log by ID
app.delete('/logs/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const logsCollection = db.collection('logs');
        await logsCollection.deleteOne({ _id: new ObjectId(id) });
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

const cron = require('node-cron');
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI; // MongoDB connection URI from your .env file
const client = new MongoClient(uri);

async function deleteOldLogs() {
    try {
        await client.connect();
        const db = client.db('yourDatabaseName');
        const logsCollection = db.collection('logs');

        // Deletes logs older than 7 days
        const result = await logsCollection.deleteMany({
            createdAt: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        });

        console.log(`${result.deletedCount} old logs deleted`);
    } catch (error) {
        console.error('Error deleting old logs:', error);
    } finally {
        await client.close();
    }
}

// Schedule the job to run every day at midnight
cron.schedule('0 0 * * *', deleteOldLogs);

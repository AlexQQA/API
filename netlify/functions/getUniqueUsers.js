const { MongoClient } = require('mongodb');
require('dotenv').config();

exports.handler = async function(event, context) {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection('online');

    const now = new Date();
    const past24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Проверка, какие записи есть
    const allRecords = await collection.find({}).toArray();
    console.log('All records:', allRecords);

    const uniqueUsers = await collection.aggregate([
      {
        $match: { 
          timestamp: { $gte: past24Hours }
        }
      },
      {
        $group: {
          _id: '$email' // Group by email to ensure uniqueness
        }
      }
    ]).toArray();

    console.log('Unique users in the last 24 hours:', uniqueUsers);

    return {
      statusCode: 200,
      body: JSON.stringify({ uniqueUsersLast24Hours: uniqueUsers.length })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  } finally {
    await client.close();
  }
};

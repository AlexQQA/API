const { MongoClient } = require('mongodb');

exports.handler = async function(event, context) {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const database = client.db(process.env.MONGODB_DATABASE);
    const collection = database.collection(process.env.MONGODB_COLLECTION);

    const users = await collection.find({}).toArray();  // Fetch users from the collection

    return {
      statusCode: 200,
      body: JSON.stringify(users),  // Convert users to JSON
    };
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch users' }),
    };
  } finally {
    await client.close();
  }
};

const { MongoClient } = require('mongodb');

exports.handler = async function(event, context) {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const collection = client.db(process.env.MONGODB_DATABASE).collection(process.env.MONGODB_COLLECTION);
    const users = await collection.find().toArray();

    return {
      statusCode: 200,
      body: JSON.stringify(users)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message })
    };
  } finally {
    await client.close();
  }
};
console.log('Fetched users:', users);


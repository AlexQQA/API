const { MongoClient } = require('mongodb');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);  // Удалите устаревшие параметры

  try {
    await client.connect();
    const database = client.db(process.env.MONGODB_DATABASE);
    const collection = database.collection(process.env.MONGODB_COLLECTION);

    const userData = JSON.parse(event.body);  // Извлечение данных пользователя из тела запроса

    const result = await collection.insertOne(userData);  // Вставка данных пользователя в коллекцию

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User created successfully', userId: result.insertedId }),  // Возвращение ID созданного пользователя
    };
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create user' }),  // Обновите сообщение об ошибке
    };
  } finally {
    await client.close();
  }
};


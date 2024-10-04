const { MongoClient } = require('mongodb');

async function saveUser(event) {
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        const db = client.db(process.env.DB_NAME);
        const collection = db.collection('online');

        const userData = JSON.parse(event.body); // Парсим тело запроса
        if (!userData._id) {
            delete userData._id; // Удаляем _id, если его нет
        }

        const userWithTimestamp = {
            ...userData,
            timestamp: new Date()
        };

        await collection.updateOne(
            { _id: userData.id },
            { $set: userWithTimestamp },
            { upsert: true }
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'User saved successfully' })
        };
    } catch (err) {
        console.error('Error saving user:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to save user' })
        };
    } finally {
        await client.close();
    }
}

// Экспортируем функцию
exports.handler = saveUser;

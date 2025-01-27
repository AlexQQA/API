const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

// Инициализация клиента MongoDB
const client = new MongoClient(process.env.MONGODB_URI);

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'DELETE') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE',
                'Content-Type': 'application/json'
            }
        };
    }

    const authHeader = event.headers.authorization || event.headers.Authorization;

    if (!authHeader) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'No authorization token provided' }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE',
                'Content-Type': 'application/json'
            }
        };
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Invalid authorization header format' }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE',
                'Content-Type': 'application/json'
            }
        };
    }

    // Проверяем заголовок Access для подтверждения прав
    const accessHeader = event.headers.access || event.headers.Access;
    if (!accessHeader || (accessHeader !== 'admin' && accessHeader !== 'moderator')) {
        return {
            statusCode: 403,
            body: JSON.stringify({ error: 'Insufficient permissions. To delete a user, please use the Access: admin header.' }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE',
                'Content-Type': 'application/json'
            }
        };
    }

    try {
        // Декодируем JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decoded:', decoded);

        // Подключаемся к базе данных
        await client.connect();
        const db = client.db(process.env.DB_NAME);
        const usersCollection = db.collection('users');
        console.log('Connected to database');

        // Извлекаем userId из пути
        const userId = event.path.split('/').pop();
        console.log('User ID from path:', userId);

        if (!userId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'User ID is required' }),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'DELETE',
                    'Content-Type': 'application/json'
                }
            };
        }

        // Проверяем формат userId
        let objectId;
        try {
            objectId = new ObjectId(userId);
        } catch (e) {
            console.error('Invalid ObjectId:', e); // Логируем ошибку
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid User ID format' }),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'DELETE',
                    'Content-Type': 'application/json'
                }
            };
        }

        // Удаляем пользователя из базы данных
        const result = await usersCollection.deleteOne({ _id: objectId });

        if (result.deletedCount === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'User not found' }),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'DELETE',
                    'Content-Type': 'application/json'
                }
            };
        }

        console.log('Delete result:', result);

        await client.close();

        return {
            statusCode: 200,
            body: JSON.stringify({
                id: userId,
                status: 'deleted'
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE',
                'Content-Type': 'application/json'
            }
        };
    } catch (error) {
        console.error('Error:', error); // Логируем ошибку

        // Обрабатываем только ошибки JWT
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: 'Invalid token' }),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'DELETE',
                    'Content-Type': 'application/json'
                }
            };
        }

        // В случае других ошибок возвращаем 500
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE',
                'Content-Type': 'application/json'
            }
        };
    }
};

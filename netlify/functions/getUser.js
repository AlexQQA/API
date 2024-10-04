const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

// Инициализация клиента MongoDB
const client = new MongoClient(process.env.MONGODB_URI);

exports.handler = async function(event, context) {
    // Проверяем метод HTTP
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    const authHeader = event.headers.authorization || event.headers.Authorization;
    let decoded = null;

    // Если заголовок авторизации присутствует
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        if (!token) {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: 'Invalid authorization header format' })
            };
        }

        try {
            // Декодируем JWT
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Token decoded:', decoded);
        } catch (error) {
            console.error('JWT Error:', error);

            // Обработка ошибок JWT
            if (error.name === 'JsonWebTokenError') {
                return {
                    statusCode: 401,
                    body: JSON.stringify({ error: 'Invalid token' })
                };
            }

            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Internal Server Error' })
            };
        }
    }

    try {
        // Подключаемся к базе данных
        await client.connect();
        const db = client.db(process.env.DB_NAME);
        const usersCollection = db.collection('users');
        console.log('Connected to database');

        // Извлекаем ID из пути
        const userId = event.path.split('/').pop();
        console.log('User ID from path:', userId);

        if (!userId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'User ID is required' })
            };
        }

        // Проверяем формат userId
        let objectId;
        try {
            objectId = new ObjectId(userId);
        } catch (e) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid User ID format' })
            };
        }

        // Получаем информацию о пользователе из базы данных
        const user = await usersCollection.findOne({ _id: objectId });

        if (!user) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'User not found' })
            };
        }

        console.log('User data:', user);

        await client.close();

        // Ответ с данными пользователя
        return {
            statusCode: 200,
            body: JSON.stringify({
                id: user._id.toString(),  // Преобразование ObjectId в строку
                name: user.name,
                email: user.email,
                age: user.age,
                phoneNumber: user.phoneNumber,
                address: user.address,
                role: user.role,
                referralCode: user.referralCode,
                createdAt: user.createdAt,
                createdBy: user.createdBy,
                decodedToken: decoded // Добавляем информацию о токене, если она есть
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Content-Type': 'application/json'
            }
        };
    } catch (error) {
        console.error('Error:', error);

        // Общая ошибка сервера
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};

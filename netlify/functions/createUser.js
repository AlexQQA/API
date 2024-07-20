const mongoose = require('mongoose');
const User = require('./models/User'); // Убедитесь, что путь к модели корректный

mongoose.connect('your-mongodb-uri'); // Удалили устаревшие параметры

exports.handler = async (event) => {
    try {
        const { name, email, age } = JSON.parse(event.body);

        const user = new User({ name, email, age });
        await user.save();

        return {
            statusCode: 201,
            body: JSON.stringify(user),
        };
    } catch (error) {
        console.error('Error creating user:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error creating user' }),
        };
    }
};

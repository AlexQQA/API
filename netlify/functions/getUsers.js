const mongoose = require('mongoose');
const User = require('./models/User'); // Убедитесь, что путь к модели верный

// Подключение к MongoDB без устаревших параметров
mongoose.connect('your-mongodb-uri', {
  // Устаревшие параметры убраны
});

// Экспорт функции
exports.handler = async function(event, context) {
  try {
    const users = await User.find();
    return {
      statusCode: 200,
      body: JSON.stringify(users),
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error fetching users' }),
    };
  }
};

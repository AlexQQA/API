const mongoose = require('mongoose');
const User = require('../../models/usermodel'); // Обратите внимание на путь

// Подключение к MongoDB без устаревших параметров
mongoose.connect(process.env.MONGODB_URI, {});

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

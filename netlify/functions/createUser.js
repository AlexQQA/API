const mongoose = require('mongoose');
const User = require('../../models/usermodel'); // Обратите внимание на путь

// Подключение к MongoDB без устаревших параметров
mongoose.connect(process.env.MONGODB_URI, {});

exports.handler = async function(event, context) {
  try {
    const { name, email, age } = JSON.parse(event.body);
    const newUser = new User({ name, email, age });
    await newUser.save();
    return {
      statusCode: 201,
      body: JSON.stringify(newUser),
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error creating user' }),
    };
  }
};

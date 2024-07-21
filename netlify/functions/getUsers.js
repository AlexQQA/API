const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB', err));

exports.handler = async (event) => {
  console.log('getUsers function called');
  try {
    // Ваш код для получения пользователей из MongoDB
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Users fetched successfully' }),
    };
  } catch (error) {
    console.error('Error in getUsers function', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

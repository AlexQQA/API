const mongoose = require('mongoose');
const User = require('../../models/userModel');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dummyapi', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { name, email, age } = JSON.parse(event.body);
  const newUser = new User({ name, email, age });

  try {
    const savedUser = await newUser.save();
    return { statusCode: 200, body: JSON.stringify(savedUser) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Error creating user' }) };
  }
};

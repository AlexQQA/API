const mongoose = require('mongoose');
const User = require('../../models/userModel');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dummyapi', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const users = await User.find({});
    return { statusCode: 200, body: JSON.stringify(users) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Error fetching users' }) };
  }
};

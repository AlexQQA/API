const jwt = require('jsonwebtoken'); // Import JWT library
const { MongoClient } = require('mongodb'); // Import MongoDB client
require('dotenv').config(); // Load environment variables from .env file

// Import fetch dynamically since it's now an ES module
const fetch = async (...args) => (await import('node-fetch')).default(...args);

// Define the saveUser function with timestamp
async function saveUser(userData) {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const collection = db.collection('online'); // Use correct collection name

    // Add timestamp
    const userWithTimestamp = {
      ...userData,
      timestamp: new Date() // Adding timestamp
    };

    // Upsert user data
    console.log('Saving user data with timestamp:', userWithTimestamp);
    await collection.updateOne(
      { _id: userData.id },
      { $set: userWithTimestamp },
      { upsert: true }
    );
    console.log('User data saved successfully');
  } catch (err) {
    console.error('Error saving user:', err);
    throw err; // Re-throw the error to handle it in the main function
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// AWS Lambda handler for GitHub OAuth callback
exports.handler = async function(event, context) {
  const { code } = event.queryStringParameters;

  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing code parameter' }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST',
        'Content-Type': 'application/json'
      }
    };
  }

  try {
    // Exchange code for token
    console.log('Exchanging code for token...');
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code
      })
    });

    const tokenData = await tokenResponse.json();
    console.log('Token response:', tokenData);

    if (tokenData.error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: tokenData.error_description }),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST',
          'Content-Type': 'application/json'
        }
      };
    }

    // Get user information
    console.log('Fetching user info...');
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    const userData = await userResponse.json();
    console.log('User info:', userData);

    // Save user data
    try {
      await saveUser(userData); // Call saveUser
    } catch (err) {
      console.error('Failed to save user:', err);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to save user data' }),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST',
          'Content-Type': 'application/json'
        }
      };
    }

    // Create JWT
    const jwtToken = jwt.sign(
      { userId: userData.id }, // Payload
      process.env.JWT_SECRET,   // Secret key
      { expiresIn: '1h' }       // Token expiration time
    );

    // Redirect URL
    const redirectUrl = `https://alexqa.netlify.app?token=${jwtToken}&user=${encodeURIComponent(JSON.stringify(userData))}`;
    console.log('Redirecting to:', redirectUrl);

    return {
      statusCode: 302,
      headers: {
        Location: redirectUrl
      },
      body: ''
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST',
        'Content-Type': 'application/json'
      }
    };
  }
};

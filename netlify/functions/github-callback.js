const axios = require('axios');

exports.handler = async (event, context) => {
    const code = event.queryStringParameters.code;

    if (!code) {
        return {
            statusCode: 400,
            body: 'Code not provided'
        };
    }

    const clientID = 'Ov23liUm9zDqtXxfqLwa';
    const clientSecret = '3a2aa8917ec88e2c736f1a531dbb9c5af2d16cac';

    try {
        const response = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: clientID,
            client_secret: clientSecret,
            code: code,
        }, {
            headers: {
                'Accept': 'application/json'
            }
        });

        const accessToken = response.data.access_token;

        return {
            statusCode: 200,
            body: JSON.stringify({ accessToken: accessToken }),
        };
    } catch (error) {
        console.error('Error getting access token:', error);
        return {
            statusCode: 500,
            body: 'Error getting access token'
        };
    }
};

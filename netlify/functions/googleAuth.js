import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

export async function handler(event) {
    const { code } = JSON.parse(event.body);

    try {
        const fetch = await import('node-fetch');
        const res = await fetch.default('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: 'https://alexqa.netlify.app/',
                grant_type: 'authorization_code'
            })
        });

        const tokenData = await res.json();

        if (tokenData.error) {
            throw new Error(tokenData.error_description);
        }

        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken: tokenData.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const jwtToken = jwt.sign(
            { user: payload.sub, email: payload.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ token: jwtToken }),
        };
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Failed to exchange code for token' }),
        };
    }
}

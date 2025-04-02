import request from 'supertest';
import {app} from '@/server'; 

describe('Authentication Tests', () => {
    it('should register a new user', async () => {
        const response = await request(app)
            .post('/api/auth/register')

            .send({
                username: 'root',
                email:'rootman@gmail.com',
                password: 'password123'
            });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'User registered successfully');
    });

    it('should login an existing user', async () => {
        const response = await request(app)
            .post('/api/auth/login')

            .send({
                email: 'rootman@gmail.com',
                password: 'password123'
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    it('should send a password reset email', async () => {
        const response = await request(app)
            .post('/api/auth/forgot-password')

            .send({
                email: 'rootman@gmail.com'
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Password reset email sent successfully');
    });

});

const request = require('supertest');
const express = require('express');
const authRoutes = require('./auth');
const User = require('../models/user');

const { createToken } = require('../token');

jest.mock('../models/user');
jest.mock('../token');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes); // Use '/auth' as the base path

describe('POST /register', () => {
    test('registers a new user', async () => {
        const mockUser = {
            username: 'testUser',
            password: 'password',
            firstName: 'Test',
            lastName: 'User',
        };

        User.register.mockResolvedValueOnce(mockUser);
        User.saveAuthToken.mockResolvedValueOnce('mock_token');

        const response = await request(app)
            .post('/auth/register') // Updated path
            .send(mockUser);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('token');
    });

    test('returns error on registration failure', async () => {
        User.register.mockRejectedValueOnce(new Error('Registration failed'));

        const response = await request(app)
            .post('/auth/register') // Updated path
            .send({
                username: 'testUser',
                password: 'password',
                firstName: 'Test',
                lastName: 'User',
            });

        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('message', 'Registration failed');
    });
});

describe('POST /token', () => {
    test('returns a token on successful authentication', async () => {
        const mockUser = {
            username: 'testUser',
            password: 'password',
            auth_token: 'mock_token',
        };

        User.authenticate.mockResolvedValueOnce(mockUser);
        createToken.mockReturnValueOnce('mock_token');
        User.saveAuthToken.mockResolvedValueOnce('mock_token');

        const response = await request(app)
            .post('/auth/token') // Updated path
            .send({
                username: 'testUser',
                password: 'password',
            });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token', 'mock_token');
    });

    test('returns error on authentication failure', async () => {
        User.authenticate.mockResolvedValueOnce(null);

        const response = await request(app)
            .post('/auth/token') // Updated path
            .send({
                username: 'testUser',
                password: 'password',
            });

        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });
});

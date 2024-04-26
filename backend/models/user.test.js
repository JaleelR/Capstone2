const request = require('supertest');
const app = require('../app'); // Assuming your app is exported from app.js
const db = require('../db');
const User = require('../models/user');
const { UnauthorizedError } = require('../expressError');

jest.mock('../db'); // Mock the database module
jest.mock('bcrypt'); // Mock bcrypt to avoid actual hashing

describe('User Model - authenticate', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('authenticates user with correct credentials', async () => {
        const mockUser = {
            id: 1,
            username: 'testUser',
            password: 'hashedPassword',
            firstName: 'Test',
            lastName: 'User',
        };

        db.query.mockResolvedValueOnce({ rows: [mockUser] });

        const user = await User.authenticate('testUser', 'password'); // Provide correct password

        expect(user).toEqual(expect.objectContaining({
            id: expect.any(Number),
            username: 'testUser',
            firstName: 'Test',
            lastName: 'User',
        }));
    });

    test('throws UnauthorizedError on invalid credentials', async () => {
        const mockUser = {
            id: 1,
            username: 'testUser',
            password: 'hashedPassword',
            firstName: 'Test',
            lastName: 'User',
        };

        db.query.mockResolvedValueOnce({ rows: [mockUser] });

        await expect(User.authenticate('testUser', 'wrongPassword')).rejects.toThrow(UnauthorizedError);
    });

    test('throws UnauthorizedError if no user found', async () => {
        db.query.mockResolvedValueOnce({ rows: [] });

        await expect(User.authenticate('testUser', 'password')).rejects.toThrow(UnauthorizedError);
    });
});

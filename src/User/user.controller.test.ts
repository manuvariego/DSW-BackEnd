import { Request, Response } from 'express';
import { EntityManager } from '@mikro-orm/core';
import bcrypt from 'bcryptjs';
import { add } from './user.controller.js';

// Mock dependencies
jest.mock('../shared/db/orm.js', () => ({
  orm: {
    em: {
      create: jest.fn(),
      persistAndFlush: jest.fn()
    }
  }
}));

jest.mock('bcryptjs');

describe('User Controller - add', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockEm: EntityManager & {
    create: jest.Mock;
    persistAndFlush: jest.Mock;
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Mock EntityManager methods
    const { orm } = require('../shared/db/orm.js');
    mockEm = orm.em as any;
    mockEm.create.mockReturnValue({ id: 1, name: 'Test User' });
    mockEm.persistAndFlush.mockResolvedValue(undefined);

    // Mock bcrypt.hash
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password_123');

    // Mock Request
    mockRequest = {
      body: {
        sanitizedInput: {
          dni: '12345678',
          name: 'Test User',
          lastname: 'Test Lastname',
          password: 'plain_password',
          email: 'test@example.com',
          phoneNumber: '123456789'
        }
      }
    };

    // Mock Response
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  it('should create a new user with hashed password', async () => {
    // Act
    await add(mockRequest as Request, mockResponse as Response);

    // Assert
    expect(bcrypt.hash).toHaveBeenCalledWith('plain_password', 10);
    expect(mockEm.create).toHaveBeenCalled();
    expect(mockEm.persistAndFlush).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1, name: 'Test User' })
    );
  });
});

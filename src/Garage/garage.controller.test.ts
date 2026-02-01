import { Request, Response } from 'express';
import { EntityManager } from '@mikro-orm/core';
import bcrypt from 'bcryptjs';
import { add } from './garage.controller.js';
import { Garage } from './garage.entity.js';

// Mock dependencies
jest.mock('../shared/db/orm.js', () => ({
  orm: {
    em: {
      create: jest.fn(),
      persistAndFlush: jest.fn(),
    },
  },
}));

jest.mock('bcryptjs');

jest.mock('../shared/errors/errorHandler.js', () => ({
    handleError: jest.fn(),
}));

describe('Garage Controller - add', () => {
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
    const mockGarage = new Garage();
    mockGarage.cuit = 123456789;
    mockGarage.name = 'Test Garage';
    mockEm.create.mockReturnValue(mockGarage);
    mockEm.persistAndFlush.mockResolvedValue(undefined);
    mockEm.flush = jest.fn().mockResolvedValue(undefined);

    // Mock bcrypt.hash
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_garage_password');

    // Mock Request
    mockRequest = {
      body: {
        sanitizedInput: {
          cuit: 123456789,
          name: 'Test Garage',
          password: 'plain_password',
          address: '123 Test St',
          phoneNumber: '987654321',
          email: 'garage@example.com',
          location: 1, // Assuming location is an ID
        },
      },
    };

    // Mock Response
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it('should create a new garage with a hashed password and return it with status 201', async () => {
    // Act
    await add(mockRequest as Request, mockResponse as Response);

    // Assert
    expect(bcrypt.hash).toHaveBeenCalledWith('plain_password', 10);
    expect(mockEm.create).toHaveBeenCalledWith(Garage, { ...mockRequest.body.sanitizedInput, password: 'hashed_garage_password' });
    expect(mockEm.flush).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(mockEm.create.mock.results[0].value);
  });
});
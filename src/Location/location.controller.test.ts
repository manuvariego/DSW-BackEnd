import { Request, Response } from 'express';
import { EntityManager } from '@mikro-orm/core';
import { add } from './location.controller.js';
import { Location } from './location.entity.js';

// Mock dependencies
jest.mock('../shared/db/orm.js', () => ({
  orm: {
    em: {
      create: jest.fn(),
      flush: jest.fn(),
    },
  },
}));

jest.mock('../shared/errors/errorHandler.js', () => ({
    handleError: jest.fn(),
}));

describe('Location Controller - add', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockEm: EntityManager & {
    create: jest.Mock;
    flush: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();

    const { orm } = require('../shared/db/orm.js');
    mockEm = orm.em as any;

    const mockLocation = new Location();
    mockLocation.name = 'Test Location';
    mockLocation.province = 'Test Province';
    mockEm.create.mockReturnValue(mockLocation);
    mockEm.flush.mockResolvedValue(undefined);

    mockRequest = {
      body: {
        sanitizedInput: {
          name: 'Test Location',
          province: 'Test Province',
        },
      },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it('should create a new location and return it with status 201', async () => {
    await add(mockRequest as Request, mockResponse as Response);

    expect(mockEm.create).toHaveBeenCalledWith(Location, { name: 'Test Location', province: 'Test Province' });
    expect(mockEm.flush).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(mockEm.create.mock.results[0].value);
  });
});
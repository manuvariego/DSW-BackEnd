import { Request, Response } from 'express';
import { EntityManager } from '@mikro-orm/core';
import { add } from './parkingSpace.controller.js';
import { ParkingSpace } from './parkingSpace.entity.js';
import { Garage } from '../Garage/garage.entity.js';
import { typeVehicle } from '../VehicleType/vehicleType.entity.js';

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

describe('ParkingSpace Controller - add', () => {
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

    const mockParkingSpace = new ParkingSpace();
    mockParkingSpace.number = 1;
    mockParkingSpace.garage = { cuit: 123456789 } as Garage;
    mockParkingSpace.TypeVehicle = { id: 1 } as typeVehicle;

    mockEm.create.mockReturnValue(mockParkingSpace);
    mockEm.flush.mockResolvedValue(undefined);

    mockRequest = {
      body: {
        sanitizedInput: {
          number: 1,
          garage: 123456789,
          TypeVehicle: 1,
        },
      },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it('should create a new parking space and return it with status 201', async () => {
    await add(mockRequest as Request, mockResponse as Response);

    expect(mockEm.create).toHaveBeenCalledWith(ParkingSpace, {
      number: 1,
      garage: 123456789,
      TypeVehicle: 1,
    });
    expect(mockEm.flush).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(mockEm.create.mock.results[0].value);
  });
});

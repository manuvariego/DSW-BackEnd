import 'jest';
import express, { Application } from 'express';
import request from 'supertest';
import { MikroORM } from '@mikro-orm/core';
import { LibSqlDriver } from '@mikro-orm/libsql'; 

import { LocationRouter } from './location.routes.js';
import { Location } from './location.entity.js';
import { Garage } from '../Garage/garage.entity.js';
import { ParkingSpace } from '../ParkingSpace/parkingSpace.entity.js';
import { Reservation } from '../Reservation/reservation.entity.js';
import { ReservationType } from '../ReservationType/reservationType.entity.js';
import { Service } from '../Services/service.entity.js';
import { typeVehicle } from '../VehicleType/vehicleType.entity.js';
import { Vehicle } from '../Vehicle/vehicle.entity.js';
import { User } from '../User/user.entity.js';

// --------------------------------------------------------
// THE FIXED MOCK
// --------------------------------------------------------
jest.mock('../shared/db/orm.js', () => {
  let innerEm: any = null;

  const proxyEm = new Proxy({}, {
    get(_target, prop) {
      if (!innerEm) {
        return () => ({}); 
      }
      const value = innerEm[prop];
      return typeof value === 'function' ? value.bind(innerEm) : value;
    }
  });

  return {
    orm: {
      em: proxyEm,
      init: jest.fn().mockResolvedValue(true),
      isConnected: jest.fn().mockReturnValue(true),
      setTestEm(em: any) {
        innerEm = em;
      },
    },
  };
});

import { orm } from '../shared/db/orm.js';

describe('Location Integration Tests', () => {
  let app: Application;
  let ormInstance: MikroORM<LibSqlDriver>;

  beforeAll(async () => {
    ormInstance = await MikroORM.init({
      driver: LibSqlDriver, 
      dbName: ':memory:',
      entities: [
        Location, Garage, ParkingSpace, Reservation, 
        ReservationType, Service, typeVehicle, Vehicle, User
      ],
      discovery: { warnWhenNoEntities: false },
      allowGlobalContext: true,
    });

    await ormInstance.getSchemaGenerator().createSchema();

    // Inject the real EM into our Proxy
    (orm as any).setTestEm(ormInstance.em.fork());

    app = express();
    app.use(express.json());
    app.use('/api/locations', LocationRouter);
  });

  afterAll(async () => {
    if (ormInstance) {
      await ormInstance.close(true);
    }
  });

  beforeEach(async () => {
    await ormInstance.getSchemaGenerator().clearDatabase();
  });

  describe('POST /api/locations', () => {
    it('should create a new location and return it with status 201', async () => {
      const newLocationData = { name: 'Centro', province: 'CABA' };

      const response = await request(app)
        .post('/api/locations')
        .send(newLocationData);

      if (response.status === 500) {
        console.error('SERVER ERROR:', response.body || response.text);
      }

      expect(response.status).toBe(201);
      
      const savedLocation = await ormInstance.em.fork().findOne(Location, { id: response.body.id });
      expect(savedLocation).not.toBeNull();
      expect(savedLocation?.name).toBe(newLocationData.name);
    });
  });

  describe('GET /api/locations', () => {
    it('should return all locations', async () => {
      const em = ormInstance.em.fork();
      em.create(Location, { name: 'Palermo', province: 'CABA' });
      em.create(Location, { name: 'Belgrano', province: 'CABA' });
      await em.flush();

      const response = await request(app).get('/api/locations');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
    });
  });
});
import 'dotenv/config';
import 'reflect-metadata'
import express from 'express'
import 'dotenv/config'
import { orm } from './shared/db/orm.js'
import { RequestContext } from '@mikro-orm/core'
import { UserRouter } from './User/user.routes.js'
import { VehicleRouter } from './Vehicle/vehicle.routes.js'
import { LocationRouter } from './Location/location.routes.js'
import { GarageRouter } from './Garage/garage.routes.js'
import { typeVehicleRouter } from './VehicleType/vehicleType.routes.js'
import { ParkingSpaceRouter } from './ParkingSpace/parkingSpace.routes.js'
import { ReservationTypeRouter } from './ReservationType/reservationType.routes.js'
import { ReservationRouter } from './Reservation/reservation.routes.js'
import { AuthRouter } from './Auth/auth.routes.js'
import { serviceRouter } from './Services/service.routes.js'
import cors from 'cors'

const app = express()
app.use(express.json())

const corsOptions = {
  origin: 'http://localhost:4200', // Permitir solicitudes desde este origen
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
};

app.use(cors(corsOptions))

app.use((req, res, next) => {

  RequestContext.create(orm.em, next)

})

app.use('/api/auth', AuthRouter)

app.use('/api/users', UserRouter)

app.use('/api/garages', GarageRouter)

app.use('/api/vehicles', VehicleRouter)

app.use('/api/locations', LocationRouter)

app.use('/api/typeVehicles', typeVehicleRouter)

app.use('/api/parkingSpaces', ParkingSpaceRouter)

app.use('/api/reservationTypes', ReservationTypeRouter)

app.use('/api/reservations', ReservationRouter)

// Health check endpoint for Docker
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() })
})

app.use('/api/services', serviceRouter)


app.use((_, res) => {
  return res.status(404).send({ message: 'Resource not found.' })
})

/**
 * Start the application
 */
async function start() {
  const port = process.env.PORT || 3000

  // Auto-sync schema in development
  if (process.env.NODE_ENV !== 'production') {
    const generator = orm.getSchemaGenerator();
    await generator.updateSchema();
    console.log('Database schema synced');
  }

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
    console.log(`Health check: http://localhost:${port}/health`)
  })
}


start().catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})

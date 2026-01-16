import 'reflect-metadata'
import express from 'express'

import { orm, syncSchema } from './shared/db/orm.js'
import { RequestContext } from '@mikro-orm/core'
import { UserRouter } from './User/user.routes.js'
import { VehicleRouter } from './Vehicle/vehicle.routes.js'
import { LocationRouter } from './Location/location.routes.js'
import { GarageRouter } from './Garage/garage.routes.js'
import { typeVehicleRouter } from './VehicleType/vehicleType.routes.js'
import { ParkingSpaceRouter } from './ParkingSpace/parkingSpace.routes.js'
import { ReservationTypeRouter } from './ReservationType/reservationType.routes.js'
import { ReservationRouter } from './Reservation/reservation.routes.js'
//import { auth } from './middlewares/auth.js'
import 'dotenv/config';
import cors from 'cors'

const app = express()
app.use(express.json())

const corsOptions = {
    origin: 'http://localhost:4200', // Permitir solicitudes desde este origen
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
};

app.use(cors(corsOptions))

app.use((req, res, next) => {

    RequestContext.create(orm.em, next)

})


app.use('/api/users', UserRouter)

app.use('/api/garages', GarageRouter)

app.use('/api/vehicles', VehicleRouter)

app.use('/api/locations', LocationRouter)

app.use('/api/typeVehicles', typeVehicleRouter)

app.use('/api/parkingSpaces', ParkingSpaceRouter)

app.use('/api/reservationTypes', ReservationTypeRouter)

app.use('/api/reservations', ReservationRouter)


app.use((_, res) => {
    return res.status(404).send({ message: 'Resource not found.' })
})

await syncSchema() //never in production


app.listen(3000, () => {
    console.log('Server running on http://localhost:3000')
})

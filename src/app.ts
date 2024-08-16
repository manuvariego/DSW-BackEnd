import 'reflect-metadata'
import express from 'express'
import { orm, syncSchema } from './shared/db/orm.js'
import { RequestContext } from '@mikro-orm/core'
import { UserRouter } from './routes/user.routes.js'
import { VehicleRouter } from './routes/vehicle.routes.js' 
import { LocationRouter } from './routes/location.routes.js'
import { GarageRouter } from './routes/garage.routes.js'
import { Parking_spaceRouter } from './routes/parking_space.routes.js'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors())

app.use((req, res, next) => {

  RequestContext.create(orm.em, next)

})


app.use('/api/users', UserRouter)

app.use('/api/garages', GarageRouter)

app.use('/api/vehicles', VehicleRouter)

app.use('/api/locations', LocationRouter)

app.use('/api/parking_spaces', Parking_spaceRouter)


app.use((_, res) => {
  return res.status(404).send({ message: 'Resource not found.' })
})

await syncSchema() //never in production


app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})

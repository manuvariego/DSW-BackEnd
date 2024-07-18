import express from 'express'
import { UserRouter } from './Usuario/usuario.routes.js'
import { GarageRouter } from './Garage/garage.routes.js'
import {connectToDatabase} from './shared/db/connectdb.js'

const app = express()
app.use(express.json())


app.use('/api/users', UserRouter)

app.use('/api/garages', GarageRouter)

app.use((_ ,res)=>{
    return res.status(404).send({message: 'Resource not found.'})
})


app.listen(3000,async  () => {
  try {
    await connectToDatabase();
    console.log('Server running on http://localhost:3000');
  } catch(error) {
    console.error("Fallo la conexion al servidor",error)

  }
    
})

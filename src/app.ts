import express from 'express'
import { UserRouter } from './Usuario/usuario.routes.js'
import { GarageRouter } from './Garage/garage.routes.js'

const app = express()
app.use(express.json())


app.use('/api/users', UserRouter)

app.use('/api/garages', GarageRouter)

app.use((_,res)=>{
    return res.status(404).send({message: 'Resource not found.'})
})


app.listen(3000, ()=>{
    console.log('Server running on http://localhost:3000')
})

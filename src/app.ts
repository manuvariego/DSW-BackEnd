import 'reflect-metadata'
import express from 'express'
import { UserRouter } from './Usuario/usuario.routes.js'
import {VehiculoRouter} from './Vehiculo/vehiculo.routes.js' 
import { orm, syncSchema } from './shared/db/orm.js'
import { RequestContext } from '@mikro-orm/core'
import { UserClassRouter } from './Usuario/usuarioClass.routes.js'
import { ItemUserRouter } from './Usuario/itemUser.routes.js'

const app = express()
app.use(express.json())

app.use((req, res, next)=>{

 RequestContext.create(orm.em, next)

})


app.use('/api/users', UserRouter)

app.use('/api/classes', UserClassRouter)

app.use('/api/items', ItemUserRouter)

app.use('/api/vehiculos', VehiculoRouter)



app.use((_,res)=>{
    return res.status(404).send({message: 'Resource not found.'})
})

await syncSchema()


app.listen(3000, ()=>{
    console.log('Server running on http://localhost:3000')
})
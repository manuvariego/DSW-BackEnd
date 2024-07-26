import 'reflect-metadata'
import express from 'express'
import { UserRouter } from './Usuario/usuario.routes.js'
import { VehiculoRouter } from './Vehiculo/vehiculo.routes.js' 
import { orm, syncSchema } from './shared/db/orm.js'
import { RequestContext } from '@mikro-orm/core'
import { LocalidadRouter } from './Localidad/localidad.routes.js'
import { CocheraRouter } from './Cochera/cochera.routes.js'

const app = express()
app.use(express.json())

app.use((req, res, next) => {

  RequestContext.create(orm.em, next)

})


app.use('/api/users', UserRouter)

app.use('/api/cocheras', CocheraRouter)

app.use('/api/vehiculos', VehiculoRouter)

app.use('/api/localidades', LocalidadRouter)

app.use('/api/cocheras', CocheraRouter)

app.use((_, res) => {
  return res.status(404).send({ message: 'Resource not found.' })
})

await syncSchema() //never in production


app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})

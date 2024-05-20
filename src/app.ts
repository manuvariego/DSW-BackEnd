import express, { NextFunction, Request, Response} from 'express'


const app = express()
app.use(express.json())

//app.use('/api/characters', UserRouter)

app.use((_,res)=>{

    return res.status(404).send({message: 'Resource not found.'})

})

app.listen(3000, ()=>{

    console.log('Server running on http://localhost:3000/')

})
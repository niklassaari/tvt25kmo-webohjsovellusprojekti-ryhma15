import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import movieRoutes from "./routes/movieRoutes.js"


const port = process.env.PORT||3001


const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))


app.use('/api/movies',movieRoutes);




app.use((err,req,res,next)=>{
    const statusCode = err.status || 500
    res.status(statusCode).json({
        error: {
            message: err.message,
            status:statusCode
        }
    })
})

app.listen(port)
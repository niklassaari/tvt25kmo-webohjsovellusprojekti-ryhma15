import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import movieRoutes from "./routes/movieRoutes.js"

import cookieParser from "cookie-parser";
import userRouter from "./routes/userRouter.js";
import { authenticateToken } from "./middleware/auth.js";

const port = process.env.PORT||3001
const app = express()





app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use('/api/movies',movieRoutes);


// jwt esim
app.use(cors({
 origin: process.env.FRONTEND_URL || "http://localhost:5173",
 credentials: true // Allow cookies
}));

app.use(cookieParser());

app.get("/", async (req, res) => {
 res.send("Postgres API esimerkki");
});


//Suojaamattomat endpointit
app.use("/user", userRouter);

//Suojatut endpointit
app.listen(port, () => {
 console.log(`Server is listening port ${port}`);
});

app.use((err,req,res,next)=>{
    const statusCode = err.status || 500
    res.status(statusCode).json({
        error: {
            message: err.message,
            status:statusCode
        }
    })
    
})


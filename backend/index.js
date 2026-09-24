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

app.get('/api/movies/test2', (req, res) => {
  console.log("🔥 TEST2 OSUI");
  res.send("TEST2 TOIMII");
});


//test
const allowedOrigins = [
    "http://localhost:5173",
    "http://128.214.255.200:5173"
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(cookieParser());

app.get("/", async (req, res) => {
 res.send("Postgres APIiiiiiiii esimerkki");
});
//testi
app.get("/test", (req, res) => {
  console.log("🔥 SERVER TEST OSUI");
  res.send("SERVER TEST TOIMII");
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

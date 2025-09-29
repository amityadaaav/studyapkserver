
const Dbconnect=require("./config/database")
const express=require("express")
const app=express()
const moongose=require("mongoose")
require("dotenv").config()
const userRouter=require("./router/userRouter")

  const PORT= process.env.HOST_NAME || 3000
 app.use(express.json()); // important to parse JSON from body

//setting up routes (versining)
 app.use("/api/v1",userRouter)

Dbconnect()

app.listen(PORT,()=>{
    console.log(`server started at ${PORT}`)
})  


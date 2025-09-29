const moongose=require("mongoose")
  require("dotenv").config()
const Dbconnect=async()=>{
      
        await moongose.connect(process.env.DATABASE_URL,{
        })
        .then(()=>{console.log("database connected successfully")})
        .catch((error)=>{
            console.log("not connected")
            console.error(error)
            process.exit(1)  
        })
        
     
}
 
 module.exports=Dbconnect

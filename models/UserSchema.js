const mongoose=require("mongoose")

const userSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    accountType:{
        type:String,
        default:"user",
        role:["user","admin","instructor"]
    },
    additionalInfo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"profile"
    },
    image:{
        type:String,

    },
    courses:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"courses"
    }
})
module.exports = mongoose.model("user", userSchema);
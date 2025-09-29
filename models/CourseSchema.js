const mongoose=require("mongoose")

const courseSchema= new mongoose.Schema({
    CourseName:{
        type:String,
        required:true
    },
    Desc:{
        type:String,
        
    },
    thumbnil:{
        type:String,
        
    },
    instructor:{
        type:String,
        ref:"user"
        
    },
    price:{
        type:Number,
       
    },
    courseContent:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section"
    },
    studentsEnrolled: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  whatYouWillLearn: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: "Category",
  },
  ratingAndReviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RatingAndReview",
    },
]
})
module.exports = mongoose.model("user", courseSchema);
const mongoose=require("mongoose")

const postSchema=mongoose.Schema({
title: String,
body :String,
device: String,
userId:String,
username:String
},{
    versionKey:false
}
)

const PostModel=mongoose.model("post",postSchema)

module.exports={
    PostModel
}


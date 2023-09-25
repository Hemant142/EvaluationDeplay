const express=require("express");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const {PostModel}=require("../model/posts.model")
const {auth}=require("../middleware/auth.middleware")
const postRoutes=express.Router()
postRoutes.use(auth)

 
postRoutes.get("/",async(req,res)=>{
    const {device1,device2}=req.query;
    let query={}
    if(device1&&device2){
        query.device={$and:[{device:device1},{device:device2}]};
    }else if(device1){
        query.device=device1
    }else if(device2){
        query.device=device2
    }
    try{
        const posts=await PostModel.find(query)
        res.status(200).json({msg:"User Posts",posts})
    }catch(err){
        res.status(400).json({error:err.message})
    }
})


postRoutes.post("/add",auth,async(req,res)=>{
    const {userID}=req.body;
    try{
        const post=new PostModel({...req.body,userID})
        
        await post.save()
        res.status(200).send({"msg":"Post added"})
    }catch(err){
        res.status(400).send({"error":err})
    }
})


postRoutes.patch("/update/:postId",async(req,res)=>{
    const {postId}=req.params
    const note=await PostModel.findOne({_id:postId})
    try{
        if(req.body.userId!==note.userId){
            res.status(400).send({"error":"You are not authorized"})
        }else{
            await PostModel.findByIdAndUpdate({_id:postId},req.body);
            res.status(200).send({"msg":"Post Updated"})
        }
    }catch(err){
        res.status(400).send({"error":err})
    }
})

postRoutes.delete("/delete/:postId",async(req,res)=>{
    const {postId}=req.params
    const note=await PostModel.findOne({_id:postId})
    try{
        if(req.body.userId!==note.userId){
            res.status(400).send({"error":"You are not authorized"})
        }else{
            await PostModel.findByIdAndDelete({_id:postId});
            res.status(200).send({"msg":"Post Delete"})
        }
}catch(err){
        res.status(400).send({"error":err})
    }
})

module.exports={
    postRoutes
}
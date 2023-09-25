const express=require("express");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const {UserModel}=require("../model/users.model")
const userRoutes=express.Router()

userRoutes.post("/register",async(req,res)=>{
    try{
        const email=req.body.email;
        const user=await UserModel.findOne({email})
        if(user){
            res.status(400).json({msg:"User Already Registered"})
        }else{
            bcrypt.hash(req.body.password,5,async(error,hash)=>{
                if(hash){
                    const newUser=new UserModel({
                        ...req.body, 
                        password:hash,
                    });
                    await newUser.save()
                    res.status(200).json({msg:"User Registered Sucessfull"})
                }
            })
        }

    }catch(err){
        res.status(400).json({error:err.message})
    }
})

userRoutes.post("/login",async(req,res)=>{
    const {password,email}=req.body;
    try{
        const user=await UserModel.findOne({email})
        if(user){
            bcrypt.compare(password,user.password,(error,result)=>{
                if(result){
                    var token=jwt.sign({userId:user._id,username:user.name},"masai")
                    res.status(200).json({msg:"USer Logged in Sucessfull!", token})
                }else{
                    res.status(400).json({msg:"Incorrect Password"})
                }
            })
        }
    }catch(err){
        res.status(400).json({error:err.message})
    }
})


module.exports={
    userRoutes
}
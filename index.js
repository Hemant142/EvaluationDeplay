const express=require("express")
const cors=require("cors")
const {connection}=require("./db")
const {userRoutes}=require("./routes/user.routes")
const {postRoutes}=require("./routes/post.routes")
const app=express()
app.use(express.json())
app.use(cors())

app.get("/",(req,res)=>{
    res.status(200).send({"msg":"This is the home page"})
})

app.use("/users",userRoutes)
app.use("/posts",postRoutes)


let PORT=process.env.PORT
app.listen(PORT,async()=>{
    try{
        await connection
        console.log("Db is connected");
        console.log(`local host is running at ${PORT}`)

    }catch(err){
        console.log(err)
    }
})


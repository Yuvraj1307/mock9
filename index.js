const { connection } = require("./config/db")

const express=require("express")
const { userRout } = require("./rout/userRout")
const { postRout } = require("./rout/postRout")


const app=express()

app.use(express.json())

app.get("/",(req,res)=>{
    res.send("hello")
})


app.use("/user",userRout)

app.use("/post",postRout)



app.listen(4500,async ()=>{
    try {
        await connection
        console.log("connected to DB at port 4500")
    } catch (error) {
        console.log("cant connect")
        console.log(error)
    }
})
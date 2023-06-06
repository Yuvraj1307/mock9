const express=require("express")
const { auth } = require("../middleware/auth")
const { userModel } = require("../model/userModel")
const { postModel } = require("../model/postModel")
const { default: mongoose } = require("mongoose")



const postRout=express.Router()


postRout.get("/api/posts",auth,async (req,res)=>{
let id=req.body.userID

let user=await userModel.findOne({_id:id}).populate("posts")
console.log(user)
res.send({msg:"here is all posts",posts:user.posts})
})



postRout.post("/api/posts",auth,async (req,res)=>{
    let {userID,text,image}=req.body
    console.log(userID)
    let objID=new mongoose.Types.ObjectId(userID)
let date=new Date()
    let post=new postModel({
        user:objID,
        text,image,createdAt:date
    })
    await post.save()
    let user=await userModel.findOne({_id:userID})
    user.posts.push(post)
    await user.save()
    console.log(post)
    res.status(201).send({msg:"post is created",post})
 })




 postRout.patch("/api/posts/:id",auth,async (req,res)=>{

    let id=req.params.id
    let {text,image,userID}=req.body
    let post=await postModel.findOneAndUpdate({user:userID,_id:id},{text,image})

    res.status(204).send(post)
 })


 postRout.delete("/api/posts/:id",auth,async (req,res)=>{

    let id=req.params.id
    let {userID}=req.body
    let post=await postModel.findOneAndRemove({user:userID,_id:id})

    res.status(202).send(post)
 })



 postRout.post("/api/posts/:id/like",auth,async (req,res)=>{
    let postid=req.params.id
    let id=req.body.userID
    let post=await postModel.findOne({_id:postid})
    post.likes.push(id)
    await post.save()

    res.send(post)

 })



 postRout.post("/api/posts/:id/comment",auth,async (req,res)=>{
    let postid=req.params.id
    let id=req.body.userID
    let  { userID,text}=req.body
    let date=new Date()
    
    let post=await postModel.findOne({_id:postid})
    post.comments.push({user:userID,text,createdAt:date})
    await post.save()

    res.send(post)

 })



 postRout.get("/api/posts/:id",async (req,res)=>{
    let id=req.params.id
    let data=await postModel.findOne({_id:id})
    res.status(200).send({mag:"here is all posts",data})
 })
module.exports={
    postRout
}
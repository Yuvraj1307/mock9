const express = require("express");
const bcrypt = require('bcrypt');
const { userModel } = require("../model/userModel");
var jwt = require('jsonwebtoken');
const { auth } = require("../middleware/auth");

const userRout = express.Router();

userRout.get("/", async (req, res) => {
    let users=await userModel.find()
    console.log(users)
    res.status(200).send({msg:"here is all users",users})
});

userRout.post("/api/register", async (req, res) => {
  let { name, email, password, bio,dob } = req.body;
  const date2 = new Date(dob);
  console.log(date2)
 

  try {
    bcrypt.hash(password, 5,async function(err, hash) {
              
        let user=new userModel({name,email,password:hash,bio,dob:date2})
        await user.save()
        console.log(user)
        res.status(201).send({msg:"user is added",user})
    });

  } catch (error) {
    console.log(error)
    res.status(404).send({mag:"can't add user"})
  }
});

userRout.post("/api/login", async (req, res) => {
    let {email,password}=req.body

    try {

        let user=await userModel.findOne({email})
        if(!user){
            return res.send({msg:"please register first"})
        }
        bcrypt.compare(password, user.password).then(async function(result) {
             if(result == true){
               console.log("ok")
               var token = jwt.sign({ userId: user._id }, 'yuvraj');

               res.status(201).send({mag:"login ok",token})
             }else{
                res.send("please register first")
             }
        });
    
      } catch (error) {
        console.log(error)
        res.status(404).send({mag:"can't add user"})
      }

});






//<<<<<<<<<<<<<<<<<<<<<---------------------friends rout------------------>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


userRout.get("/api/users/:id/friends",auth,async (req,res)=>{
    let id=req.params.id
    console.log(req.body.userID)
    let user=await userModel.findOne({_id:id}).populate("friends")
    res.status(201).send({msg:"here is all friends",friends:user.friends})
})


userRout.post("/api/users/:id/friends",auth,async (req,res)=>{
    let id=req.params.id
    let myId=req.body.userID
    let user=await userModel.findOne({_id:id})
    user.friendRequests.push(myId)
    await user.save()
    res.status(201).send({msg:"here is all friends",user})
})



userRout.patch("/api/users/:id/friends/:friendId",auth,async (req,res)=>{
    let id=req.params.id
    let myId=req.body.userID
    let frdId=req.params.friendId
    let excepted=req.body.status
    if(excepted){
        let user=await userModel.findOne({_id:id})
        let frd=await userModel.findOne({_id:frdId})
        let frdIdx=user.friendRequests.indexOf(frdId)
        if(frdId!=-1){
            user.friends.push(user.friendRequests[frdIdx])
            frd.friends.push(user._id)
            user.friendRequests.splice(frdIdx,1)
            await user.save()
            await frd.save()
            res.status(204).send({msg:"here is all friends",user,frd})
        }
    }else{
        let user=await userModel.findOne({_id:id})
        let frdIdx=user.friendRequests.indexOf(frdId)
        user.friendRequests.splice(frdIdx,1)

             user.save()

        res.status(204).send({msg:"request is declined",user})
    }
})
module.exports = { userRout };

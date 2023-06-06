
var jwt = require('jsonwebtoken');




const auth=(req,res,next)=>{
    let token= req.headers.authorization

    if(!token){
        return res.send({msg:"please login first"})
    }
    

    jwt.verify(token, 'yuvraj', function(err, decoded) {
        console.log(decoded) // bar
         if(!err){
            req.body.userID=decoded.userId
            next()
         }else{
            res.send("please login first")
         }
      });

}

module.exports={
    auth
}
const User=require('../models/user');
const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
const expressJwt=require('express-jwt');

dotenv.config();

exports.signup=async(req,res)=>{
    const userExists = await User.findOne({email:req.body.email})
    if(userExists) return res.status(403).json({
        error:'Email is Already taken !!'
    })
    
    const user=await new User(req.body)
    await user.save();
    res.status(200).json({message:"Signup success Please login"});
};

exports.signin=(req,res)=>{
  // Find user based on email
   const{email,password} =req.body
   User.findOne({email},(err,user)=>{
       // if error or no user
       if(err||!user){
          return  res.status(401).json({
               error:'User with that Email-ID does not exists !!'
           })
       }
       
       //if user is found make sure that email and password matches
       
       //create authentication method in user model and use here.
       if(!user.authenticate(password)){
           return res.status(401).json({
               error:'email and Password do not match !!'
           })
       }
       
         
  // Generate a token with user id and secret key
    const token=jwt.sign({_id: user._id},process.env.JWT_SECRET);
    
  // persist the token as 't' in cookie with expiry date
    res.cookie("t",token,{expire:new Date()+9999})
    
  // return response with user and token to frontend client
      const {_id,name,email}=user
      return res.json({token,user:{_id,email,name}})
   });
  
  
};

exports.signout =(req,res)=>{
    res.clearCookie("t");
    return res.json({message:'Signout Success !!'});
};


exports.requireSignin=expressJwt({
    //if the token is valid ,express jwt appends the verified users id 
    //in  an auh key to the request object
    
    
    secret:process.env.JWT_SECRET,
    userProperty:"auth"
});
const mongoose=require('mongoose');
const uuidv1=require('uuidv1');
const crypto = require('crypto');
const {ObjectId}=mongoose.Schema
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        require:true
        
    },
    email:{
        type:String,
        trim:true,
        require:true
    },
    hashed_password:{
        type:String,
        required:true
    },
    salt:String,
    created:{
      type:Date,
      default:Date.now
    },
    
    photo:{
        data:Buffer,
        contentType:String
    }, 
about:{
        type:String,
        trim:true
        
    },
    updated:Date,
    following:[{type:ObjectId,ref:"User"}],
    followers:[{type:ObjectId,ref:"User"}]
});


/*
* Virtual fields are additional fields for a given model.
* Their values can be set manually or automatically with defined functionality.
* Keep in mind virtual properties(properties) don't get persisted in the database.
* They only exist logically and are not written to the document's collection.

*/



//Virtual Field
userSchema.virtual('password')
.set(function(password){
    //create a temporary vairable called _password
    this._password=password
    //Generate a Timestamp
    this.salt=uuidv1()
    //encrpytPassword()
    this.hashed_password=this.encryptPassword(password)
})
.get(function(){
    return this._password
})


//methods
userSchema.methods={
    authenticate:function(plainText){
        return this.encryptPassword(plainText)===this.hashed_password
    },
    
   encryptPassword:function(password){
       if(!password) return "";
       try{
           return crypto.createHmac('sha256',this.salt)
                    .update(password)
                    .digest('hex');
       }
       catch(err)
           {
              return "";
           }
   }
}


module.exports=mongoose.model("User",userSchema);
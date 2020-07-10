exports.createPostValidator=(req,res,next)=>{
    //title
    req.check('title',"Write a title").notEmpty();
    req.check('title','Title must be between 4 to 150 characters').isLength({
        min:4,
        max:150
    });
    
    //body
    req.check('body',"Write a body").notEmpty()
    req.check('body','Body must be contain 4 to 150 characters').isLength({
        min:4,
        max:2500
    });
    
    
    //Check for errors
    const errors=req.validationErrors();
    //if error show the first one as they occur
    if(errors){
        const firstError=errors.map((error)=>error.msg)[0]
        return res.status(400).json({error:firstError})
    }
    
    // Proceed to next middleware
    next();
};

exports.userSignupValidator=(req,res,next)=>{
    //name 
    req.check('name','Please enter username').notEmpty()
    req.check('name','Name must be between 4 to 10 characters').isLength({
        min:4,
        max:10
    });
    
    //email
    
    req.check('email','Please enter your email')
        .notEmpty()
        .matches(/.+\@.+\..+/)
        .withMessage("Email must contain @");
    
    //password
    req.check('password','Please enter your Password').notEmpty();
    req.check('password')
    .isLength({min:6})
    .withMessage('Password must contain atleast 6 characters')
    .matches(/\d/)
    .withMessage('Password Must contain a digit')
    
    //check for errors
    const errors=req.validationErrors();
    //if errors show the first one as they happen
    if(errors){
        const firstError=errors.map(error=>error.msg)[0];
        return res.status(400).json({error:firstError});
    }
    //proceed to next middleware
    next();
    
    
}
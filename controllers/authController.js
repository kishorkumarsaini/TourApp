const User = require('./../models/usermodel');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/AppError');
const catchAsync= require('./../utils/catchAsync');
const { use } = require('../routes/userRoutes');

exports.signup = async(req,res,next)=>{
        
        try{
            const user = await User.create(req.body);
            //create jwt token
            const token = jwt.sign(JSON.parse(JSON.stringify(user)), process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
            user.password = undefined;
            res.status(200).json({
                status: 'success',
                token,
                data:{
                    user
                }
            });
    
        }catch(err){
            res.status(400).json({
                status: 'fail',
                message: 'Invalid data'
            });
        }
}


exports.login = async(req,res,next)=>{

    try{

        const {email,password} = req.body;

        // 1) check email and password is correct
        console.log(email,password);
        if(!email || !password) return next(new AppError('please enter correct password and email',400));
    
        //2) check user exitst and match the password
        const user = await User.findOne({email}).select('+password');
    
        if(!user || !(await user.correctPassword(password,user.password))) return next(new AppError('Please enter the correct password',401));
    
        const token = jwt.sign(JSON.parse(JSON.stringify(user)), process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
    
        res.status(200).json({
            status:'success',
            token,
            data:{
                user
            }
        });

    }catch(err){
        res.status(401).json({
            status:'fail',
            message:'email and password is not correct'
        });
    }
}


exports.protect = async (req,res,next)=>{

    try{
    let token ;
    // get the token 
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){

        token = req.headers.authorization.split(' ')[1];
    }

    //  check token is exist
    if(!token)
    {
        return next(new AppError('Token is not found please login again',401));
    }

    //decode  the token 
    const {id,iat} =  await jwt.verify(token ,process.env.JWT_SECRET);

    // find current user and check user is still exist
     const Currentuser = User.findById(id);
     if(!Currentuser){
         return next(new AppError('This is user is not longer exist for this token',401));
     }

     // check if user change the password
     if(Currentuser.changePasswordAfter(iat)){
         return next(new AppError('user change the password currently login again',401));
     }
     req.user = Currentuser;
    }catch(err){
        console.log('jwt error');
    }
    next();

}




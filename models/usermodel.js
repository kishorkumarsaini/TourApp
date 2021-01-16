const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt')

userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true,'Please enter your name']
    },
    email: {
        type: String,
        require: [true, 'Please enter your email'],
        unique: true,
        lowercase: true,
        validator: [validator.isEmail,'Please enter your email']
    },
    password: {
        type: String,
        required:[ true, 'Please enter your password'],
        minlength: 8,
        select: false 
    },
    passwordConfirm:{
        type: String,
        required: [true, 'Please enter your password again'],
        validate :{
            validator: function(el){
                return el === this.password
            },
            message: 'Password is not same' }
    },
    passwordChangeAt: Date,
    role: {
        type: String,
        enum : ['user','guide','admin'],
        default: 'user'
    }
});


// use mongoose middlewar
userSchema.pre('save', async function(next){
    // only run this function when password is modified
    if(!this.isModified('password')) return next();
    
    // Hash password with strength 12
    this.password = await bcrypt.hash(this.password,12);
    console.log(this.password);
    // remove the passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function(currentpassword,userpassword){
    
    return await bcrypt.compare(currentpassword,userpassword);

}

userSchema.methods.changePasswordAfter = function(jwtTimeStamp){
    
    if(this.passwordChangeAt){
        
        // return true means password change
        const changePasswordTimeStamp = parseInt(this.passwordChangeAt.getTime()/1000,10)
        return jwtTimeStamp < changePasswordTimeStamp

    }
    return false;
}



const User = mongoose.model('User',userSchema);
module.exports = User;
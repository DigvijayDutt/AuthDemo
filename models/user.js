const mongoose = require('mongoose');
const bc = require('bcrypt');

const userSchema = new mongoose.Schema({
    username :{
        type: String,
        required: [true, "user cannot be blank"]
    },
    password:{
        type: String,
        required: [true, "Password cannot be blank"]
    }
})

userSchema.statics.findAndValidate = async function(username, password){
    const found = await this.findOne( {username} );
    const check = await bc.compare(password, found.password);
    return check ? found : false;
}

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bc.hash(this.password, 12);
    next();
})

module.exports = mongoose.model("User", userSchema);

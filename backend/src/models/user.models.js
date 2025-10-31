import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

    fullname: {
        type: String ,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim:true,
    },

    password: {
        type: String,
        required:true,

    },

    role: {
        type: String,
        enum:['user' , 'admin'],
        default: 'user'
    },

    phoneNumber: {
        type: String,
        required: true
        
    },

    profilePic:{
        type:String, //cloudinary url goes here,
         default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png", // placeholder avatar

    }



}, {timestamps: true}) ;

export const User = mongoose.model('User' , userSchema);


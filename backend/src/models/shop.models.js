import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    location:{
        type: String,
        required: true,
    },

    rating: {
        type:Number,
        
        default: 0
    },

    contact:[{

        email: {
            type: String,
            
        },

        phoneNumber: {
            type: String,
        }
    }],

    images: [
        {
            type: String,
        }
    ]

}, {timestamps: true});

export const Shop = mongoose.model('Shop' , shopSchema)
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
        url: { type: String, required: true },
        public_id: { type: String, required: true }
    }],

    createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
    }



}, {timestamps: true});

export const Shop = mongoose.model('Shop' , shopSchema)
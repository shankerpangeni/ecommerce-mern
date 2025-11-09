import mongoose, { mongo } from "mongoose";

const cartSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    products: [{
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'Product',
        },
        quantity:{
            type: Number,
            default:1 ,
            min:1
        },

        
    }],

    

},{timestamps: true});

export const Cart = mongoose.model('Cart', cartSchema);
import mongoose, { mongo } from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        trim : true,
    },

    description: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
        index: true,
    },

    brand: {
        type: String,
        required: true,
        index: true,
    },

    category: {
        type: String,
        required: true,
        index: true,
    },

    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true,
    },

    genderSpecific: {
        type: String,
        enum: ['Men' , 'Women' , 'Unisex'],
        required: true,
        default: 'Unisex',
        index:true
    },

    images: [{
        url: { type: String, required: true },
        public_id: { type: String, required: true }
    }],


    stock: {
        type: Number ,
        required: true,
        default: 0,
    },

    avgRating: {
        type: Number,
        default: 0,
    },

    discountedPrice: {
        type: Number,
    },

    review: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        rating: {
            type: Number,
        },
        comment: {
            type: String,
            
        }
    }]


}, {timestamps:true});

export const Product = mongoose.model('Product' , productSchema);
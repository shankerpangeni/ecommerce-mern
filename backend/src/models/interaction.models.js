const interactionSchema = new mongoose.Schema({

  user:
   { type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
    },

  product:
   { type: mongoose.Schema.Types.ObjectId,
     ref: 'Product' 
    },

  action:
   { type: String,
     enum: ['view', 'click', 'add_to_cart', 'purchase'],
      required: true 
    },
    
}, { timestamps: true });

export const Interaction = mongoose.model('Interaction', interactionSchema);

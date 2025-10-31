const paymentSchema = new mongoose.Schema({

  order:
   { type: mongoose.Schema.Types.ObjectId,
     ref: 'Order',
      required: true
    },

  method:
   { type: String,
     enum: ['esewa', 'khalti', 'card'],
      required: true
    },
    
  transactionId:
   { type: String

    },

  amount: {
     type: Number,
      required: true
    },

  status: 
  { type: String,
     enum: ['pending', 'success', 'failed'],
      default: 'pending'
    },

}, { timestamps: true });

export const Payment = mongoose.model('Payment', paymentSchema);

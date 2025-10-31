import mongoose from 'mongoose';

const connnectDb = async() => {
    try {
          await mongoose.connect(process.env.MONGO_URI);

          console.log('Db connected Succesfully.')

        
    } catch (error) {

        console.log('Db connection Failed. ' , error);
       
        
    }
}

export default connnectDb;
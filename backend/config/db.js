import mongoose from "mongoose";

export async function connectDB(){
    const uri=process.env.MONGO_URI;
   
    try{
        await mongoose.connect(uri);
        console.log("MongoDb connected Sucessfully");
    }catch(err){
        console.error("MongoDb connection failed");
        process.exit(1);
    }
}
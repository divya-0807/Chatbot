const mongoose = require("mongoose");

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.DATABASE_CONNECT_URL);
        console.log("Database connected successfully")
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB;
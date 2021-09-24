const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DBURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB Connected and Running Perfectly");
    } catch (error) {
        console.error(error.message);
        process.exit(1); // Exit Process With Failure
    }
}

module.exports = connectDB;
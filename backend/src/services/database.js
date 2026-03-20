const mongoose = require('mongoose');

const URI = "mongodb+srv://<db_username>:<db_password>@cluster0.6pg6g1a.mongodb.net/?appName=Cluster0";

const connectDatabase = async () => {
    try {
        await mongoose.connect(URI);
        console.log("Successfully connected to MongoDB.");
    } catch (error) {
        console.error("Connection error:", error.message);
        process.exit(1);
    }
};

module.exports = connectDatabase;
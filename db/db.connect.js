const mongoose = require("mongoose");
require("dotenv").config();
const mongooseUri = process.env.MONGODB;

const initializeDB = async () => {
    await mongoose
        .connect(mongooseUri)
        .then(() => console.log("Database connected"))
        .catch((error) => console.log("Error while connecting to DB", error));
};

module.exports = { initializeDB };

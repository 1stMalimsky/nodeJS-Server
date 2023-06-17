const config = require("config");
const mongoose = require("mongoose");
const connectToDBMongo = () => {
    console.log("Connected locally to MongoDB");
    return mongoose.connect(config.get("dbConfig.mongoUrl"));
};

const connectToDBAtlas = () => {
    console.log("Connected globaly to MongoDB Atlas");
    return mongoose.connect(config.get("dbConfig.mongoAtlasUrl"));
};

module.exports = { connectToDBMongo, connectToDBAtlas };
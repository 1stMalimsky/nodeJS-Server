const config = require("config");
const mongoose = require("mongoose");
const connectToDBMongo = () => {
    console.log("mongo config", config.get("dbConfig"));
    return mongoose.connect(config.get("dbConfig.mongoUrl"));
};

const connectToDBAtlas = () => {
    console.log("atlas config", config.get("dbConfig"));
    return mongoose.connect(config.get("dbConfig.mongoAtlasUrl"));
};

module.exports = { connectToDBMongo, connectToDBAtlas };
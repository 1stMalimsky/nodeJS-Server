const config = require("config");
const mongoose = require("mongoose");
const chalk = require("chalk")

const connectToDB = () => {
    return mongoose.connect(config.get("dbConfig.url"));
};

module.exports = connectToDB;
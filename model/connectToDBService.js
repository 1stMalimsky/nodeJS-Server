const config = require("config");
const connectToDBMongo = require("./mongoDB/connectToDB");
const dbOption = config.get("dbOption");

const connectToDB = () => {
  if (dbOption === "mongo") {
    return connectToDBMongo();
  }
};

module.exports = connectToDB;

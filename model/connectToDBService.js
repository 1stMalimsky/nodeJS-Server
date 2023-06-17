const config = require("config");
const connectToDb = require("./mongoDB/connectToDB");
const dbOption = config.get("dbOption");

const connectToDB = () => {
  if (dbOption === "local") {
    return connectToDb.connectToDBMongo();
  }
  if (dbOption === "global") {
    return connectToDb.connectToDBAtlas()
  };
};

module.exports = connectToDB;

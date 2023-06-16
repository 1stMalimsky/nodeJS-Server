const config = require("config");
const connectToDb = require("./mongoDB/connectToDB");
const dbOption = config.get("dbOption");

const connectToDB = () => {
  if (dbOption === "mongo") {
    return connectToDb.connectToDBMongo();
  }
  if (dbOption === "mongoAtlas") {
    return connectToDb.connectToDBAtlas()
  };
};

module.exports = connectToDB;

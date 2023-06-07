const bcryptjs = require("./bcryptjs");
const config = require("config");
const hashOption = config.get("hashOption");

const generateHash = (password) => {
    switch (hashOption) {
        case "bcryptjs":
        default:
            return bcryptjs.encryptPassword(password);
    }
};

const compareHash = (password, hash) => {
    switch (hashOption) {
        case "bcryptjs":
        default:
            return bcryptjs.compareHash(password, hash);
    }
};

module.exports = {
    generateHash,
    compareHash
}
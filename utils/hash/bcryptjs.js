const bcryptjs = require("bcryptjs");

const encryptPassword = (password) => bcryptjs.hash(password, 10);

const compareHash = (password, hash) => bcryptjs.compare(password, hash);

module.exports = {
    encryptPassword,
    compareHash
}
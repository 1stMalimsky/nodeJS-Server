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

const fisrtUsersHash = async (userArr) => {
    try {
        const hashedPasswords = await Promise.all(hashPromises);

        for (let i; i < 3; i++) {
            userArr[i].password = hashedPasswords[i];
        };
    }
    catch (err) {
        res.status(400).json({ message: err.message || err })
    }
}

module.exports = {
    generateHash,
    compareHash,
    fisrtUsersHash,
}
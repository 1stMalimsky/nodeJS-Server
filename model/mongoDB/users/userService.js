const User = require("./Users");
const jwtService = require("../../../utils/jwt/jwtService")


const registerUser = (userInput) => {
    const user = new User(userInput);
    return user.save();
}

const loginUser = (payload) => {
    return jwtService.generateToken(payload, expDate = "30d")
}

const getUserByEmail = (email) => {
    return User.findOne({ email });
}

const getUserById = (id) => {
    return User.findById(id);
}

const getAllUsers = () => {
    return User.find();
}

const updateUser = (id, updatedUser) => {
    return User.findByIdAndUpdate(id, updatedUser, {
        new: true,
    });
};

const deleteUser = (id) => {
    return User.deleteOne({ _id: id });
}

module.exports = {
    registerUser,
    loginUser,
    getUserByEmail,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
}
const userServiceModel = require("../../model/mongoDB/users/userService");
const cardsServiceModel = require("../../model/mongoDB/cards/cardService");
const userList = require("./userList.json");
const cardList = require("./cardsList.json");
const chalk = require("chalk");
const hashServiceModel = require("../../utils/hash/hashService")


const initUsers = async (userList) => {
    await userServiceModel.inializeData(userList);
}

const checkData = async () => {
    try {
        let allUsers = await userServiceModel.getAllUsers();
        let allCards = await cardsServiceModel.getAllCards();
        if (allUsers.length == 0) {
            for (user of userList) {
                user.password = await hashServiceModel.generateHash(user.password);
                userServiceModel.registerUser(user);
            }
            console.log("data created");
        }
        allUsers = await userServiceModel.getAllUsers()
        if (allCards.length == 0) {
            for (let i = 0; i < 3; i++) {
                await cardsServiceModel.createCard({ ...cardList[i], user_id: allUsers[i]._id });
            };
            console.log("cards created");
        }
    }
    catch (err) {
        console.log(chalk.red.bold("initial err: ", err.message || err));
    }
}


module.exports = {
    checkData,
    initUsers,
}
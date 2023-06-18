const userServiceModel = require("../../model/mongoDB/users/userService");
const cardsServiceModel = require("../../model/mongoDB/cards/cardService");
const userList = require("./userList.json");
const cardList = require("./cardsList.json");
const chalk = require("chalk");
const hashServiceModel = require("../../utils/hash/hashService");
const normalizeUser = require("../../utils/normalize/normalizeUser");
const normalizeCard = require("../../utils/normalize/normalizeCard");

const checkData = async () => {
    try {
        let allUsers = await userServiceModel.getAllUsers();
        let allCards = await cardsServiceModel.getAllCards();
        if (allUsers.length === 0) {
            await Promise.all(
                userList.map(async (user) => {
                    try {
                        normalizeUser(user);
                        user.password = await hashServiceModel.generateHash(user.password);
                        await userServiceModel.registerUser(user);
                    }
                    catch (err) {
                        res.status(500).json({ message: err.message || err });
                    }
                })
            )
            console.log("Users created");
        }
        allUsers = await userServiceModel.getAllUsers()
        if (allCards.length == 0) {
            for (let i = 0; i < 3; i++) {
                normalizeCard(cardList[i]);
                await cardsServiceModel.createCard({ ...cardList[i], user_id: allUsers[i]._id });
            };
            console.log("Cards Created");
        }
        else return console.log("Database already exists");
    }
    catch (err) {
        console.log(chalk.red.bold("initial err: ", err.message || err));
    }
}


module.exports = {
    checkData
}
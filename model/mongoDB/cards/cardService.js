const Card = require("./Card");


const getAllCards = () => {
    return Card.find();
}

const createCard = (cardToCreate) => {
    const card = new Card(cardToCreate);
    return card.save();
}

const initializeCards = (arr) => {
    return Card.insertMany(arr);
}

module.exports = {

    getAllCards,
    createCard,
    initializeCards
}
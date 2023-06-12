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

const findCardById = (id) => {
    return Card.findById(id)
}

const findMany = (userId) => {
    return Card.find({ user_id: userId });
}

const updateCard = (cardId, updatedCard) => {
    return Card.findByIdAndUpdate(cardId, updatedCard, {
        new: true
    });
};

const deleteCard = (id) => {
    return Card.deleteOne({ _id: id });
}

module.exports = {

    getAllCards,
    createCard,
    initializeCards,
    findMany,
    findCardById,
    updateCard,
    deleteCard
}
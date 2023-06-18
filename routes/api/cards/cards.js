const express = require("express");
const router = express.Router();
const cardsServiceModel = require("../../../model/mongoDB/cards/cardService")
const { checkCredentials, loggedInCheck } = require("../../../middleware/userAuthMiddleware");
const validateId = require("../../../validation/joi/userIdValidation")
const { validateCardSchema } = require("../../../validation/joi/cardsValidation");
const generateBizNumber = require("../../../utils/generateBizNumber");
const normalizeCard = require("../../../utils/normalize/normalizeCard");

/* POST requests */

router.post("/", loggedInCheck, checkCredentials(false, true), async (req, res) => {
    try {
        const newCard = normalizeCard(req.body);
        await validateCardSchema(newCard);
        const bizNumber = await generateBizNumber()
        const cardData = { ...newCard, bizNumber: bizNumber, user_id: req.tokenPayload.userId };
        await cardsServiceModel.createCard(cardData);
        res.status(200).json({
            message: "card created",
            cardData: cardData
        })
    }
    catch (err) {
        res.status(400).json({ message: err.message || err })
    }

})

/* GET requests */

router.get("/", async (req, res) => {
    try {
        const allCards = await cardsServiceModel.getAllCards();
        res.status(200).json({ allCards: allCards })
    }
    catch (err) {
        res.status(400).json({ message: err.message || err });
    }
});

router.get("/my-cards", loggedInCheck, async (req, res) => {
    try {
        const foundCards = await cardsServiceModel.findMany(req.tokenPayload.userId);
        if (foundCards.length == 0) {
            res.status(404).json({ message: "no cards found" })
        }
        else {
            res.status(200).json({ yourCards: foundCards })
        }
    }
    catch (err) {
        res.status(400).json({ message: err.message || err });
    }
})

router.get("/:id", async (req, res) => {
    try {
        await validateId({ id: req.params.id });
        const reqId = req.params.id;
        const foundCard = await cardsServiceModel.findCardById(reqId)
        if (!foundCard) {
            throw ("no card found")
        }
        res.status(200).json({ foundCard: foundCard });
    }
    catch (err) {
        res.status(400).json({ message: err.message || err })
    }

});

/* PUT requests */

router.put("/:id", loggedInCheck, async (req, res) => {
    try {
        validateId({ id: req.params.id });
        const cardId = req.params.id;
        const foundCard = await cardsServiceModel.findCardById(cardId);
        if (!foundCard) {
            throw ("card not found")
        }
        const updatedData = await validateCardSchema(req.body);
        if (foundCard.user_id == req.tokenPayload.userId) {
            await cardsServiceModel.updateCard(cardId, updatedData)
            res.status(200).json({
                message: "Card update successful",
                Edited_Card: updatedData
            })
        }
        else throw ("You are not the owner of the card you are trying to edit!")
    }
    catch (err) {
        res.status(400).json({ message: err.message || err });
    }
})

/* PATCH requests */

router.patch("/:id", loggedInCheck, async (req, res) => {
    try {
        await validateId({ id: req.params.id });
        const cardId = req.params.id;
        const userId = req.tokenPayload.userId;
        const foundCard = await cardsServiceModel.findCardById(cardId);
        if (!foundCard) {
            throw ("The card you are attempting to like is not found")
        }
        if (req.tokenPayload && foundCard.likes.includes(userId)) {
            const unlikeUpdated = foundCard.likes.filter((user) => user !== userId)
            foundCard.likes = unlikeUpdated;
            await cardsServiceModel.updateCard(cardId, foundCard);
            res.status(200).json({ message: "unlike submitted" })
        }
        else {
            const likeUpdated = foundCard.likes.concat(userId);
            foundCard.likes = likeUpdated;
            await cardsServiceModel.updateCard(cardId, foundCard);
            res.status(200).json({ message: "like submitted" })
        }
    }
    catch (err) {
        res.status(400).json({ message: err.message || err });
    }
})

/* DELETE requests */

router.delete("/:id", loggedInCheck, async (req, res) => {
    try {
        await validateId({ id: req.params.id });
        const cardId = req.params.id
        foundCard = await cardsServiceModel.findCardById(cardId);
        if (!foundCard) {
            throw ("The card you are attempting to delete was not found")
        }
        if (req.tokenPayload && req.tokenPayload.userId == foundCard.user_id || req.tokenPayload.isAdmin) {
            await cardsServiceModel.deleteCard(cardId);
            res.status(200).json({ message: "card deleted" })
        }
        else res.status(400).json({ message: "You are not authorized to delete this card" })
    }
    catch (err) {
        res.status(400).json({ message: err.message || err });
    }
})

module.exports = router;
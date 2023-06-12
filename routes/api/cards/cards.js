const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const jwtServiceModel = require("../../../utils/jwt/jwtService");
const chalk = require("chalk");
const cardsServiceModel = require("../../../model/mongoDB/cards/cardService")
const { checkCredentials, loggedInCheck } = require("../../../middleware/userAuthMiddleware");
const validateId = require("../../../validation/joi/userIdValidation")
const { validateCardSchema } = require("../../../validation/joi/cardsValidation");
const { genereateBizNumber } = require("../../../utils/generateBizNumber");
const generateBizNumber = require("../../../utils/generateBizNumber");


/* POST requests */

router.post("/", loggedInCheck, checkCredentials(false, true), async (req, res) => {
    try {
        await validateCardSchema(req.body);
        const bizNumber = await generateBizNumber()
        const cardData = { ...req.body, bizNumber: bizNumber, user_id: req.tokenPayload.userId };
        await cardsServiceModel.createCard(cardData);
        res.status(200).json({
            message: "card created",
            cardData: cardData
        })
    }
    catch (err) {
        console.log("card registration err", err.message || err);
        res.status(400).json({ message: err.message || err })
    }

})

/* GET requests */

router.get("/", async (req, res, next) => {
    const allCards = await cardsServiceModel.getAllCards();
    res.status(200).json({ allCards: allCards })
});

router.get("/my-cards", async (req, res) => {
    try {
        const token = await jwtServiceModel.verifyToken(req.headers["x-auth-token"]);
        if (!token) {
            throw ("Please provide a valid token")
        }
        const foundCards = await cardsServiceModel.findMany(token.userId);
        if (foundCards.length == 0) {
            res.status(404).json({ message: "no cards found" })
        }
        else {
            res.status(200).json({ foundCards: foundCards })
        }
    }
    catch (err) {
        res.status(400).json({ message: err.message || err });
    }
})

router.get("/:id", async (req, res) => {
    try {
        const reqId = req.params.id;
        await validateId(reqId);
        const foundCard = await cardsServiceModel.findCardById(reqId)
        res.status(200).json({ foundCard: foundCard });
    }
    catch (err) {
        res.status(400).json({ message: err.message || err })
    }

});

/* PUT requests */

router.put("/:id", loggedInCheck, async (req, res) => {
    try {
        const cardId = req.params.id;
        validateId(cardId);
        const foundCard = await cardsServiceModel.findCardById(cardId);
        const updatedData = await validateCardSchema(req.body);
        if (foundCard.user_id == req.tokenPayload.userId) {
            await cardsServiceModel.updateCard(cardId, updatedData)
            res.status(200).json({ messgae: "Card update successful" })
        }
        else res.status(400).json({ message: "somethign went wrong. Please try again" })
    }
    catch (err) {
        res.status(400).json({ message: err.message || err });
    }
})

/* PATCH requests */

router.patch("/:id", loggedInCheck, async (req, res) => {
    try {
        const cardId = { id: req.params.id };
        await validateId(cardId);
        const userId = req.tokenPayload.userId;
        const foundCard = await cardsServiceModel.findCardById(cardId);
        if (req.tokenPayload && foundCard.likes.includes(userId)) {
            const unlikeUpdated = foundCard.likes.filter((user) => user !== userId)
            foundCard.likes = unlikeUpdated;
            await cardsServiceModel.updateCard(cardId, foundCard);
            console.log("updated unlikes array", foundCard.likes);
            res.status(200).json({ message: "unlike submitted" })
        }
        else {
            const likeUpdated = foundCard.likes.concat(userId);
            foundCard.likes = likeUpdated;
            console.log("foundCard---> ", foundCard);
            await cardsServiceModel.updateCard(cardId, foundCard);
            console.log("updated Like array", foundCard.likes);
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
        const cardIdToCheck = { id: req.params.id };
        await validateId(cardIdToCheck);
        const cardId = cardIdToCheck.id;
        foundCard = await cardsServiceModel.findCardById(cardId);
        if (req.tokenPayload && req.tokenPayload.userId == foundCard.user_id || req.tokenPayload.isAdmin) {
            await deleteCard(cardId);
            res.status(200).json({ message: "card deleted" })
        }
        else res.status(400).json({ message: "You are not authorized to delete this card" })
    }
    catch (err) {
        console.log("Delete err", err.message || err);
        res.status(400).json({ message: err.message || err });
    }
})

module.exports = router;
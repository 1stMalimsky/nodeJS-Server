const express = require("express");
const router = express.Router();
const jwtServiceModel = require("../../../utils/jwt/jwtService");
const chalk = require("chalk");
const cardsServiceModel = require("../../../model/mongoDB/cards/cardService")
const { checkCredentials, loggedInCheck } = require("../../../middleware/userAuthMiddleware");
const { validateCardSchema } = require("../../../validation/joi/cardsValidation");
const { genereateBizNumber } = require("../../../utils/generateBizNumber");
const generateBizNumber = require("../../../utils/generateBizNumber");


/* POST requests */

router.post("/", loggedInCheck, async (req, res) => {
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

router.get("/", loggedInCheck, checkCredentials(true, false), async (req, res, next) => {
    const allCards = await cardsServiceModel.getAllCards();
    res.status(200).json({ allCards: allCards })
})

module.exports = router;
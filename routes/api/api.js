const express = require("express");
const router = express.Router();

const userRouter = require("../api/user/user");
const cardsRouter = require("../api/cards/cards");

router.use("/user", userRouter);

router.use("/cards", cardsRouter);


module.exports = router;
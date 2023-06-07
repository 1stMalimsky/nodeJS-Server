const express = require("express");
const router = express.Router();

const userRouter = require("./user/user");
//const cardsRouter = require("./api/cards");

router.use("/user", userRouter);

//router.use("/cards", cardsRouter);


module.exports = router;
const express = require("express");
const router = express.Router();
const chalk = require("chalk");
const {
    registerUserValidation,
    loginUserValidation,
} = require("../../../validation/userValidationService");
const normalizeUser = require("../../../model/mongoDB/users/helpers/normalizationUser")
const hashService = require("../../../utils/hash/hashService")
const userServiceModel = require("../../../model/mongoDB/users/userService");
const CustomError = require("../../../utils/CustomError");
const jwtServiceModel = require("../../../utils/jwt/jwtService");
const { checkCredentials, loggedInCheck } = require("../../../middleware/userAuthMiddleware");
const { validateUserId } = require("../../../validation/joi/userIdValidation")


/* POST requests */

router.post("/users", async (req, res) => {
    try {
        await registerUserValidation(req.body);
        req.body.password = await hashService.generateHash(req.body.password);
        req.body = normalizeUser(req.body);
        await userServiceModel.registerUser(req.body);
        res.status(200).json("user registered");
    }
    catch (err) {
        console.log(chalk.red.bold("regValidation", err));
        res.status(500).send(`regValid error - ${err}`);
    }
})

router.post("/users/login", async (req, res) => {
    try {
        await loginUserValidation(req.body);
        const currentUser = await userServiceModel.getUserByEmail(req.body.email);
        if (!currentUser) {
            throw new Error("Invalid user name or password. please try again!");
        }
        const validatePassword = await hashService.compareHash(req.body.password, currentUser.password)
        console.log("validate password", validatePassword);
        if (!validatePassword) {
            throw new Error("Invalid user name or password. please try again!")
        }
        const token = await jwtServiceModel.generateToken({
            userId: currentUser._id,
            isBiz: currentUser.isBusiness,
            isAdmin: currentUser.isAdmin
        })
        res.json({ token: token })
    }
    catch (err) {
        console.log(chalk.red.bold(err));
        res.status(400).json("Invalid user name or password. please try again!");
    }
})

/* GET Requests */

router.get("/users/", loggedInCheck, checkCredentials(true, false, false), async (req, res) => {
    try {
        console.log("/users reached");
        const allUsers = await userServiceModel.getAllUsers();
        if (!allUsers) {
            throw new Error("no users found")
        }
        res.status(200).json(allUsers)
    }
    catch (err) {
        console.log(err);
    }
});

router.get("/:id", loggedInCheck, async (req, res) => {
    try {
        const paramsId = req.params.id;
        await validateUserId(req.params.id);
        const userFromDb = await userServiceModel.getUserById(paramsId);
        console.log(userFromDb);
        if (req.tokenPayload._id == userFromDb._id || req.tokenPayload.isAdmin) {
            res.status(200).json(userFromDb);
        }
        else throw new Error("You are not authorized to view this User");
    }
    catch (err) {
        res.status(400).json({ msg: err })
    }
})



/* PUT requests */



module.exports = router;
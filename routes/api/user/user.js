const express = require("express");
const router = express.Router();
const chalk = require("chalk");
const {
    registerUserValidation,
    loginUserValidation,
} = require("../../../validation/userValidationService");
const hashService = require("../../../utils/hash/hashService")
const userServiceModel = require("../../../model/mongoDB/users/userService");
const CustomError = require("../../../utils/CustomError");
const jwtServiceModel = require("../../../utils/jwt/jwtService");
const { checkCredentials, loggedInCheck } = require("../../../middleware/userAuthMiddleware");
const { validateUserId } = require("../../../validation/joi/userIdValidation")
const { validateBizChange, validateEditUser } = require("../../../validation/joi/editValidation")

/* POST requests */

router.post("/users", async (req, res) => {
    try {
        await registerUserValidation(req.body);
        req.body.password = await hashService.generateHash(req.body.password);
        req.body = (req.body);
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

router.get("/users/", loggedInCheck, checkCredentials(true, false), async (req, res) => {
    try {
        console.log("/users reached");
        const allUsers = await userServiceModel.getAllUsers();
        if (!allUsers) {
            throw { message: "no users found" };
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
        validateUserId(paramsId);
        const userFromDb = await userServiceModel.getUserById(paramsId);
        if (req.tokenPayload.userId !== userFromDb._id.toString() && !req.tokenPayload.isAdmin) {
            throw new CustomError("You are not authorized to view this User");
        }
        else res.status(200).json(userFromDb);
    }
    catch (err) {
        console.log("err from get id", err);
        res.status(400).json(err)
    }
})



/* PUT requests */

router.put("/:id", loggedInCheck, async (req, res) => {
    try {
        await validateUserId(req.params.id);
        await validateEditUser(req.body);
        if (req.params.id === req.tokenPayload.userId.toString()) {
            delete req.body.isBusiness;
            await userServiceModel.updateUser(req.params.id, req.body);
            return res.status(200).json({ message: "Update Successful" });
        }
        throw { message: "You don't are not the user you are trying to edit!" }
    }
    catch (err) {
        console.log("error from edit - ", err);
        res.status(400).json({ message: err.message || err })
    }
})

/* PATCH requests */
router.patch("/:id", loggedInCheck, async (req, res) => {
    try {
        await validateUserId(req.params.id);
        //await validateBizChange(req.body);
    }
    catch (err) {
        console.log("err from bizCahnge", err);
        res.status(400).json({ message: err.message || err });
    }
})



module.exports = router;
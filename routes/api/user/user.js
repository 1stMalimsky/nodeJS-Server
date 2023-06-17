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
const validateId = require("../../../validation/joi/userIdValidation");
const { validateEditUser } = require("../../../validation/joi/editValidation")
const normalizeUser = require("../../../utils/normalize/normalizeUser")

/* POST requests */

router.post("/users", async (req, res) => {
    try {
        const newUser = normalizeUser(req.body);
        await registerUserValidation(newUser);
        newUser.password = await hashService.generateHash(newUser.password);
        await userServiceModel.registerUser(newUser);
        res.status(201).json({ userRegistered: newUser });
    }
    catch (err) {
        res.status(400).json({ message: err.message || err });
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
        res.status(400).json({ message: err.message || err });
    }
})

/* GET Requests */

router.get("/users/", loggedInCheck, checkCredentials(true, false), async (req, res) => {
    try {
        const allUsers = await userServiceModel.getAllUsers();
        if (!allUsers) {
            throw new CustomError("no users found");
        }
        res.status(200).json(allUsers)
    }
    catch (err) {
        res.status(400).json({ message: err.message || err });
    }
});

router.get("/:id", loggedInCheck, async (req, res) => {
    try {
        const paramsId = { id: req.params.id };
        await validateId(paramsId);
        const userIdString = paramsId.id;
        const userFromDb = await userServiceModel.getUserById(userIdString);
        if (req.tokenPayload.userId !== userFromDb._id.toString() && !req.tokenPayload.isAdmin) {
            throw ("You are not authorized to view this User");
        }
        else res.status(200).json(userFromDb);
    }
    catch (err) {
        res.status(401).json({ message: err.message || err });
    }
})



/* PUT requests */

router.put("/:id", loggedInCheck, async (req, res) => {
    try {
        const userId = req.params.id
        await validateId({ id: req.params.id });
        const userToEdit = await userServiceModel.getUserById(userId)
        if (!userToEdit) {
            throw ("user does not exist");
        }
        await validateEditUser(req.body);
        if (userId === req.tokenPayload.userId.toString()) {
            delete req.body.isBusiness;
            delete req.body.password;
            await userServiceModel.updateUser(req.params.id, req.body);
            return res.status(200).json({ message: "Update Successful" });
        }
        throw { message: "You are not the user you are trying to edit!" }
    }
    catch (err) {
        res.status(401).json({ message: err.message || err })
    }
})

/* PATCH requests */
router.patch("/:id", loggedInCheck, async (req, res) => {
    try {

        await validateId({ id: req.params.id });
        const userId = req.params.id;
        const userProfile = await userServiceModel.getUserById(userId);
        if (!userProfile) {
            throw ("User does not exist")
        }
        if (userId === req.tokenPayload.userId.toString()) {
            userProfile.isBusiness = !userProfile.isBusiness;
            await userServiceModel.updateUser(userId, userProfile);
            res.status(200).json({ message: "business status updated!", newProfile: userProfile })
        }
        else throw { message: "You are not the user you are trying to edit!" }
    }
    catch (err) {
        res.status(401).json({ message: err.message || err });
    }
})

/* DELETE requests */

router.delete("/:id", loggedInCheck, async (req, res) => {
    try {
        await validateId({ id: req.params.id });
        const idToDelete = await userServiceModel.getUserById(req.params.id);
        if (!idToDelete) {
            throw ("user does not exist")
        }
        if (req.tokenPayload.isAdmin || req.tokenPayload.userId.toString() === req.params.id) {
            await userServiceModel.deleteUser(req.params.id)
            res.status(200).json({ message: "user deleted!" })
        }
        else throw ("You are not allowed to delete this user")
    }
    catch (err) {
        res.status(401).json({ message: err.message || err });
    }
})


module.exports = router;
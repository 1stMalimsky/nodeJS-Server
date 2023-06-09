const jwtServiceModel = require("../utils/jwt/jwtService");
const chalk = require("chalk");
const CustomError = require("../utils/CustomError")

const loggedInCheck = async (req, res, next) => {
    try {
        const token = req.headers["x-auth-token"];
        if (!token) {
            throw new CustomError("Please provide a valid token")
        }
        const tokenPayload = await jwtServiceModel.verifyToken(token);
        req.tokenPayload = tokenPayload;
        next()
    }
    catch (err) {
        let errToSend;
        if (err instanceof CustomError) {
            errToSend = err;
        } else {
            errToSend = new CustomError("LoggedInChecked error");
        }
        res.status(400).json(errToSend);
    }
}

const checkCredentials = (needAdmin, needBiz) => {
    return async (req, res, next) => {
        try {
            if (needAdmin && req.tokenPayload.isAdmin && needAdmin === true) {
                return next();
            }
            if (needBiz && req.tokenPayload.isBiz && needBiz === true) {
                return next();
            }
            else throw { message: "you don't have the right credentials" };
        }
        catch (err) {
            console.log("userAuthMW response", err);
            res.status(400).json(err);
        }
    }
}


module.exports = {
    checkCredentials,
    loggedInCheck,
}
const express = require("express");
const UserModel = require("../models/User.model");
const bcrypt = require("bcryptjs");
const {check, validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Register User Route
router.post("/", [
    check("name", "Please Enter Name").not().isEmpty(),
    check("email", "Please Enter Email").isEmail(),
    check("password", "Please Enter Password").isLength({min: 6})
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors) {
        return res.status(400).json({errors: errors.array()});
    }
    const {name, email, password} = req.body;
    try {
        let user = await UserModel.findOne({email});
        if(user) {
            return res.status(400).json({msg: "User Already Exists"});
        }
        user = new UserModel({name, email, password});
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        // Payload returning to frontend
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payload, process.env.JWTSECRET, {
            expiresIn: 3600
        }, (error, token) => {
            if(error) {
                throw error
            }
            res.json({token});
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});


module.exports = router;
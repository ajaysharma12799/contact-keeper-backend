const UserModel = require("../models/User.model");
const bcrypt = require("bcryptjs");
const {check, validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const router = require("express").Router();

// Get Logged In User
router.get("/", auth, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id).select("-password");
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// Login User Route
router.post("/", [
    check("email", "Please Enter Email").isEmail(),
    check("password", "Plese Enter Password").isLength({min: 6})
], async (req, res) => {
    const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
    const { email, password } = req.body;
    try {
        let user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const payload = {
            user: {
                id: user.id
            }
        };
        jwt.sign(payload, process.env.JWTSECRET, {expiresIn: 3600}, (error, token) => {
                if (error) {
                    throw error
                }
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
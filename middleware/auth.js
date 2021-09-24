const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    // Get Token from Headers
    const token = req.header("x-auth-token");
    
    // Check If Not Token
    if(!token) {
        return res.status(401).json({msg: "No Token, Authorization Denied"});
    }
    // If Token is Present Verify It
    try {
        const decode = jwt.verify(token, process.env.JWTSECRET);
        req.user = decode.user;
        next();
    } catch (error) {
        res.status(401).json({msg: "Token is Not Valid"});
    }
}
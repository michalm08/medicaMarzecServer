const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json("Do not have a tokenn");
  }
  try {
    const data = jwt.verify(token, process.env.jwtSecret);
    req.user = data;
    
    next();
  } catch (err) {
    return res.status(401).json("Token is not valid");
  }
};

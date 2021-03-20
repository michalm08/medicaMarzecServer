const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json("Do not have a tokensp");
  }
  try {
    const data = jwt.verify(token, process.env.jwtSecret);
    if (data.type != "admin" && data.type != "doctor") {
      nonExistentFunction();
    }
    req.user = data;
    next();
  } catch (err) {
    return res.status(500).json("You don't have permision");
    // return res.status(401).json(data.patient.id);
  }
};

const jwt = require("jsonwebtoken");

// auth middleware
exports.Auth = async (req, res, next) => {
  try {
    // access authorize header to validate request
    const token = req.headers.authorization.split(" ")[1];

    // retrive the user details of the logged in user
    const decodedToken = await jwt.verify(token, "secret");

    req.user = decodedToken;

    next();
  } catch (error) {
    res.status(401).json({ error: "Authentication Failed" });
  }
};

exports.variable = (req, res, next) => {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };

  next();
};

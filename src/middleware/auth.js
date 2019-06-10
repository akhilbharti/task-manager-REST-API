const jwt = require("jsonwebtoken");
const User = require("../models/user");
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    // console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_ENV);
    // console.log(decoded._id);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token
    }); // it will find an user with the id and the token still stored
    // console.log(user);
    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: "Please Authenticate" });
  }
};

module.exports = auth;
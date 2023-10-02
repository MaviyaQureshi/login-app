const UserModel = require("../model/model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");

// middle for verify user
exports.verifyUser = async (req, res, next) => {
  try {
    const { username } = req.method == "GET" ? req.query : req.body;

    // check the user existance

    let exist = await UserModel.findOne({ username });

    console.log(exist);

    if (!exist) return res.status(404).send({ error: "Cant find user" });
    next();
  } catch (error) {
    return res.status(404).send({ error: "Authentication failed" });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, password, profile, email } = req.body;

    // check the existing user
    const existUsername = await UserModel.findOne({ username });
    if (existUsername) {
      console.log("Username taken");
    }

    // check for existing email
    const existEmail = await UserModel.findOne({ email });
    if (existEmail) {
      console.log("Email taken");
    }

    Promise.all([existUsername, existEmail]).then(() => {
      if (password) {
        bcrypt
          .hash(password, 10)
          .then((hashedPassword) => {
            const user = new UserModel({
              username,
              password: hashedPassword,
              profile: profile || "",
              email,
            });

            user
              .save()
              .then((result) => {
                // Send a success response
                res.status(201).send({ msg: "User Registered Successfully" });
              })
              .catch((error) => {
                // Handle database save error
                res.status(500).send({ error: "Unable to save user data" });
              });
          })
          .catch((error) => {
            // Handle bcrypt hashing error
            res.status(500).send({ error: "Unable to hash password" });
          });
      } else {
        // Handle missing password error
        res.status(400).send({ error: "Password is required" });
      }
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    UserModel.findOne({ username }).then((user) => {
      bcrypt.compare(password, user.password).then((passwordCheck) => {
        if (!passwordCheck)
          return res.status(400).send({ error: "Dont have Password" });

        // create jwt token
        const token = jwt.sign(
          {
            userId: user._id,
            username: user.username,
          },
          "secret",
          { expiresIn: "24h" }
        );

        return res.status(200).send({
          msg: "Login Successful",
          username: user.username,
          token,
        });
      });
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
};

exports.getUser = async (req, res) => {
  const { username } = req.params;

  try {
    if (!username) return res.status(501).send({ Error: "Invalid Username" });

    UserModel.findOne({ username }).then(function (err) {
      if (!err.username)
        return res.status(501).send({ error: "Couldnt find user" });

      // remove password from user
      // mongoose return unnescessary data with object so convert it into json
      const { password, ...rest } = Object.assign({}, err.toJSON());

      return res.status(201).send(rest);
    });
  } catch (error) {
    return res.status(404).send({ Error: "cannot find user data" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    // const id = req.query.id;
    const { userId } = req.user;

    if (userId) {
      const body = req.body;

      // update the data
      const doc = await UserModel.findById(userId);
      await doc.updateOne(body).then(res.status(201).send("Record Updated"));
    } else {
      return res.status(401).send({ error: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).send({ error });
  }
};

exports.generateOTP = async (req, res) => {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  res.status(201).send({ code: req.app.locals.OTP });
};

exports.verifyOTP = async (req, res) => {
  const { code } = req.query;

  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null; // reset OTP value
    req.app.locals.resetSession = true; // start sesison for reset password

    return res.status(201).send({ msg: "Verify Successfull" });
  }
  return res.status(400).send({ msg: "Invalid OTP" });
};

exports.createResetSession = async (req, res) => {
  if (req.app.locals.resetSession) {
    return res.status(201).send({ flag: req.app.locals.resetSession });
  }
  return res.status(440).send({ error: "Session expited!" });
};

exports.resetPassword = async (req, res) => {
  if (!req.app.locals.resetSession)
    return res.status(440).send("Session expired");

  try {
    const { username, password } = req.body;

    try {
      let exist = await UserModel.findOne({ username });

      if (exist) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await UserModel.updateOne(
          { username: username },
          { password: hashedPassword }
        ).then(res.status(201).send("Record Updated"));
        req.app.locals.resetSession = false; // reset session
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ error });
    }
  } catch (error) {
    return res.status(401).send({ error });
  }
};

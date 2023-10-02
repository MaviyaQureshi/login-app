const nodemailer = require("nodemailer");
const mailgen = require("mailgen");

exports.mail = async (req, res) => {
  const { username, userEmail, text, subject } = req.body;

  let config = {
    service: "gmail",
    auth: {
      user: "maviyazenon@gmail.com",
      pass: "tipokzgadoacxmap",
    },
  };

  let transporter = nodemailer.createTransport(config);

  let mailgenerator = new mailgen({
    theme: "default",
    product: {
      name: "Mr.Qureshi",
      link: "https://mailgen.js/",
    },
  });

  let response = {
    body: {
      name: username,
      intro: text || "Welcome to this portal!!",
      outro:
        "Need help, or have any queries? Just reply to this email, we'd love to help",
    },
  };

  let mail = mailgenerator.generate(response);

  let message = {
    from: "maviyazenon@gmail.com",
    to: userEmail,
    subject: subject || "Signup Sucessful",
    html: mail,
  };

  transporter
    .sendMail(message)
    .then(() => {
      return res.status(201).send({ msg: "Email sent!!!" });
    })
    .catch((error) => {
      return res.status(500).send({ error });
    });
};

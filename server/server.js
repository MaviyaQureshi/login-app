const express = require("express");
const cors = require("cors");
// const morgan = require("morgan");
const app = express();
const connectDB = require("./config/db");
const route = require("./router/route");

connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/api", route);

const port = 8080;

// HTTP GET Request
app.get("/", (req, res) => {
  res.status(200).json("Home GET Request");
});

//  start server
app.listen(port, console.log(`Server connected to http://localhost:${port}`));

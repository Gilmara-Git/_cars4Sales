"use strict";
const express = require("express");
const cors = require("cors");
const app = express();
const routes = require("./routes");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.json({ message: "Root /" });
});

app.use("/car", routes);

app.listen(port, function () {
  console.log("Listening on port http://localhost:%d", port);
});

"use strict";
let express = require("express");
let router = express.Router();

let data = [];

router.get("/", function (req, res) {
  console.log("[GET]/car:", data);
  res.json(data);
});

router.post("/", function (req, res) {
  let { image, makeModel, year, color, plate } = req.body;

  data.push({
    image: image,
    makeModel: makeModel,
    year: year,
    color: color,
    plate: plate,
  });
  console.log(
    "[POST] /car:",
    JSON.stringify(
      {
        body: req.body,
        data,
      },
      null,
      2
    )
  );
  res.json({ message: "success" });
});

module.exports = router;

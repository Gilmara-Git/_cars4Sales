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
  console.log(typeof plate, " tipo da placa", plate)
  let hasCar = data.some(function (car) {
    return car.plate === plate.toUpperCase();
  });
  if (hasCar) {
    return res.json({ message: "Placa já existe!" });
  } else {
    data.push({
      image: image,
      makeModel: makeModel,
      year: year,
      color: color,
      plate: plate.toUpperCase(),
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
    return res.json({ message: "success" });
  }
});

router.delete("/", function (req, res) {
  let plate = req.body.plate;
  data = data.filter(function (car) {
    return car.plate !== plate;
  });

  return res.json({ message: "success" });
});

module.exports = router;

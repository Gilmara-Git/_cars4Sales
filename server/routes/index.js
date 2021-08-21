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

router.delete("/", function(req, res){
  let plate =  req.body.plate;
    data = data.filter(function(car){   
      return car.plate !==  plate;
  });
  console.log(data, 'array atualizado')

  return res.json({ message: "success" })
  // console.log('ttttt',retorno, 'retorno')
  // console.log('plate being deleted', plate)
  // console.log(JSON.stringify({body: req.body }, null, 2))
});


module.exports = router;

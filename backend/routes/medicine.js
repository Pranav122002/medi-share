const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const MEDICINE = mongoose.model("MEDICINE");

router.get("/allmedicines", (req, res) => {
  MEDICINE.find()
    .select("-_id -__v")
    .sort("-createdAt")
    .then((medicines) => res.json(medicines))
    .catch((err) => console.log(err));
});

router.post("/addmedicine", async (req, res, next) => {
  try {
    const { medicine_name, description, disease } = req.body;
    const data = await MEDICINE.create({
      medicine_name: medicine_name,
      description: description,
      disease: disease,
    });

    if (data) return res.json({ msg: "Medicine added..." });
    else return res.json({ msg: "Failed to add medicine..." });
  } catch (ex) {
    next(ex);
  }
});

router.post('/search-medicines',(req,res)=>{
  let userPattern = new RegExp(req.body.query, "i"); // add "^" at start for exact search 
  MEDICINE.find({medicine_name:{$regex:userPattern}})
  .select("_id medicine_name description disease")
  .then(medicine=>{
      res.json({medicine})
  }).catch(err=>{
      console.log(err)
  })
})

module.exports = router;

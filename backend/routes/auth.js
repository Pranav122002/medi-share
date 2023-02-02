const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const USER = mongoose.model("USER");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const { Jwt_secret } = require("../keys");
const requireLogin = require("../middlewares/requireLogin");



router.post("/signup", (req, res) => {
    // const { name,  email, password, location } = req.body;
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const location = req.body.location;
    console.log(location);
    if (!name || !email || !password  || !location) {
        return res.status(422).json({ error: "Please add all the fields" })
    }
    USER.findOne({ $or: [{ email: email }, { name: name }] }).then((savedUser) => {
        if (savedUser) {
            console.log("Hello");
            return res.status(422).json({ error: "User already exist with that email or userName" })
        }
        bcrypt.hash(password, 12).then((hashedPassword) => {

            const user = new USER({
                name,
                email,
                password: hashedPassword
            })

            user.save()
                .then(user => { res.json({ message: "Registered successfully" }) })
                .catch(err => { console.log(err) })
        })
    })

})

router.post("/signin", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json({ error: "Please add email and password" })
    }
    USER.findOne({ email: email }).then((savedUser) => {
        if (!savedUser) {
            return res.status(422).json({ error: "Invalid email" })
        }
        bcrypt.compare(password, savedUser.password).then((match) => {
            if (match) {
                // return res.status(200).json({ message: "Signed in Successfully" })
                const token = jwt.sign({ _id: savedUser.id }, Jwt_secret)
                const { _id, name, email } = savedUser

                res.json({ token, user: { _id, name, email } })

                console.log({ token, user: { _id, name, email } })
            } else {
                return res.status(422).json({ error: "Invalid password" })
            }
        })
            .catch(err => console.log(err))
    })
})

const getAllUsers = async (req, res, next) => {
    try {
      const users = await USER.find({ _id: { $ne: req.params.id } }).select([
        "email",
        "name",
        "_id",
      ]);
      return res.json(users);
    } catch (ex) {
      next(ex);
    }
  };

  router.get("/allusers/:id", getAllUsers);

module.exports = router;
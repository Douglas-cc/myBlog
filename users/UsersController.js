const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("./Users");

const router = express.Router();

router.get("/admin/users", (req, res) => {
  User.findAll().then(users => {
    res.render("admin/users/index", { users: users })
  })
});

router.get("/admin/users/create", (req, res) => {
  res.render("admin/users/create");
});

router.post("/users/create", (req, res) => {
  var { email, password } = req.body;
  User.findOne({where:{
     email: email 
    }
  }).then(user => {
    if (user == undefined){
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(password, salt);
    
      User.create({ 
        email: email,
        password: hash 
      }).then(() => {
        res.redirect("/");
      }).catch(() => {
        res.redirect("/");
      })

    }else{
      res.redirect("/admin/users/create")
    }  
  })



});

module.exports = router;
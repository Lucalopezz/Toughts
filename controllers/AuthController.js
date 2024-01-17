const User = require("../models/User");

const bcrypt = require("bcryptjs");

module.exports = class AuthController {
  static login(req, res) {
    res.render("auth/login");
  }
  static async loginPost(req, res) {
    const { email, password } = req.body;

    //if user exist
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      req.flash("message", "O E-mail não existe!");
      res.render("auth/register");
      return;
    }

    //match password in database
    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      req.flash("message", "Senha Incorreta!");
      res.render("auth/login");
      return;
    }


    req.session.userid = user.id

    req.flash("message", "Login realizado com sucesso!");

    req.session.save(() => {
      res.redirect("/");
    });


  }
  static register(req, res) {
    res.render("auth/register");
  }

  static async registerPost(req, res) {
    const { name, email, password, confirmpassword } = req.body;

    //password match validation
    if (password != confirmpassword) {
      //message
      req.flash("message", "As senhas não coferem, tente novamente!");
      res.render("auth/register");
      return;
    }

    //check if user exits
    const checkIfUserExists = await User.findOne({ where: { email: email } });
    if (checkIfUserExists) {
      //message
      req.flash("message", "O E-mail já está em uso!");
      res.render("auth/register");
      return;
    }

    // create password
    const salt = bcrypt.genSaltSync(10);

    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = {
      name,
      email,
      password: hashedPassword,
    };

    try {
      const createdUser = await User.create(user);

      req.session.userid = createdUser.id;

      req.flash("message", "Cadastro realizado com sucesso!");

      req.session.save(() => {
        res.redirect("/");
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async logout(req, res) {
    req.session.destroy();
    res.redirect("/login");
  }
};

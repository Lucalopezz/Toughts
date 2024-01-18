const Tought = require("../models/Tought");
const User = require("../models/User");

module.exports = class ToughtController {
  static async showToughts(req, res) {
    res.render("toughts/home");
  }

  static async dashboard(req, res) {
    const userId = req.session.userid;

    const user = await User.findOne({
      where: {
        id: userId,
      },
      include: Tought,
      plain: true,
    });

    if (!user) {
      res.redirect("/login");
    }

    const toughts = user.Toughts.map((result) => result.dataValues);

    let emptyToughts = false

    if(toughts.length === 0){
        emptyToughts = true
    }

    res.render("toughts/dashboard", { toughts, emptyToughts });
  }


  static createTought(req, res) {
    res.render("toughts/create");
  }
  static async createToughtSave(req, res) {
    const tought = {
      tittle: req.body.tittle,
      UserId: req.session.userid,
    };
    //check if user exists
    const userExist = await User.findByPk(tought.UserId);

    if (userExist) {
      try {
        await Tought.create(tought);

        req.flash("message", "Pensamento criado com sucesso!");

        req.session.save(() => {
          res.redirect("dashboard");
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      req.flash("message", "Tente novamente!");

      req.session.save(() => {
        res.redirect("dashboard");
      });
    }
  }

  static async removeTought(req, res) {
    const id = req.body.id;
    const UserId = req.session.userid;

    try {
      await Tought.destroy({ where: { id: id, UserId: UserId } });

      req.flash("message", "Pensamento deletado com sucesso!");

      req.session.save(() => {
        res.redirect("dashboard");
      });
    } catch (error) {
      console.log(error);
    }
  }
};

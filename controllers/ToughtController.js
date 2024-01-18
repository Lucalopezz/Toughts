const Tought = require("../models/Tought");
const User = require("../models/User");

const { Op } = require("sequelize");

module.exports = class ToughtController {
  static async showToughts(req, res) {
    let search = "";

    if (req.query.search) {
      search = req.query.search;
    }

    let order = "DESC"; // decre

    if (req.query.order === "old") {
      order = "ASC"; // acen
    } else {
      order = "DESC";
    }

    const toughtsData = await Tought.findAll({
      include: User,
      where: {
        tittle: { [Op.like]: `%${search}%` },
      },
      order: [["createdAT", order]],
    });
    const toughts = toughtsData.map((result) => result.get({ plain: true }));

    let toughtsQty = toughts.length;

    if (toughtsQty === 0) {
      toughtsQty = false;
    }

    res.render("toughts/home", { toughts, search, toughtsQty });
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

    let emptyToughts = false;

    if (toughts.length === 0) {
      emptyToughts = true;
    }

    res.render("toughts/dashboard", { toughts, emptyToughts });
  }
  // create tought
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
  // remove tought
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
      req.flash("message", "Erro !");

      req.session.save(() => {
        res.redirect("dashboard");
      });
    }
  }

  // edit tought
  static async editTought(req, res) {
    const id = req.params.id;
    const UserId = req.session.userid;

    //check if user exist and he is the owner
    const tought = await Tought.findOne({ where: { id: id }, raw: true });
    if (tought.UserId !== UserId) {
      res.redirect("/");
      return;
    }

    res.render("toughts/edit", { tought });
  }
  static async editToughtSave(req, res) {
    const id = req.body.id;
    const tought = { tittle: req.body.tittle };

    try {
      await Tought.update(tought, { where: { id: id } });
      req.flash("message", "Pensamento editado com sucesso!");

      req.session.save(() => {
        res.redirect("dashboard");
      });
    } catch (error) {
      console.log(error);
      req.flash("message", "Erro !");

      req.session.save(() => {
        res.redirect("dashboard");
      });
    }
  }
};

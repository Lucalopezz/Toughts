const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("toughts", "root", "", {
  host: "localhost",
  dialect: "mysql",
});
try {
  sequelize.authenticate();
  console.log("Conectou ao Banco!");
} catch (error) {
  console.log("Erro ao conectar ao Banco", error);
}

module.exports = sequelize;

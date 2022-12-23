const { Op, Model, col, ...Sequelize } = require("sequelize");

const { ProfileType } = require("../../constants/profile");
const sequelize = require('../config');
const Contract = require("./contract");
const Job = require("./job");

class Profile extends Model {
  static getById(id, options = {}) {
    return Profile.findOne({ where: { id }, ...options });
  }

  static async getBestProfession(since, to) {
    return Profile.findAll({
      attributes: ["profession", [sequelize.fn("SUM", col("Contractor.Jobs.price")), "total"],],
      group: ["profession"],
      where: { type: ProfileType.CONTRACTOR },
      include: [{
        model: Contract,
        attributes: [],
        as: "Contractor",
        include: [{
          model: Job,
          attributes: [],
          as: "Jobs",
          where: { paid: true, paymentDate: { [Op.between]: [since, to] } }
        }]
      }],
      order: [["total", "DESC"]]
    })
  }

  static async getBestClients(since, to, limit) {
    return Profile.findAll({
      subQuery: false, // It is needed to use the limit param with agregations of associations columns
      attributes: ["id", [sequelize.fn("SUM", col("Client.Jobs.price")), "paid"], [sequelize.literal("firstName || ' ' || lastName"), "fullName"]],
      group: ["Profile.id"],
      order: [["paid", "DESC"]],
      where: { type: ProfileType.CLIENT },
      include: [{
        model: Contract,
        attributes: [],
        as: "Client",
        include: [{
          model: Job,
          attributes: [],
          as: "Jobs",
          where: { paid: true, paymentDate: { [Op.between]: [since, to] } }
        }]
      }],
      limit
    })
  }

  receivePayment(amount, transactionOption) {
    return this.update({
      balance: this.balance + amount
    }, { transaction: transactionOption.transaction });
  }

  sendPayment(amount, transactionOption) {
    return this.update({
      balance: this.balance - amount
    }, { transaction: transactionOption.transaction });
  }
}

Profile.init(
  {
    firstName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    profession: {
      type: Sequelize.STRING,
      allowNull: false
    },
    balance: {
      type: Sequelize.DECIMAL(12, 2)
    },
    type: {
      type: Sequelize.ENUM('client', 'contractor')
    }
  },
  {
    sequelize,
    modelName: 'Profile'
  }
);

module.exports = Profile;

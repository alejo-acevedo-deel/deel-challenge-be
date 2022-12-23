const { Op, Model, ...Sequelize } = require("sequelize");

const { ContractStatus } = require("../../constants/contract");
const sequelize = require('../config');

class Contract extends Model {

  static findById(id, options = {}) {
    return Contract.findOne({ where: { id }, ...options });
  }

  static getNotTerminatedWithFilter(filter) {
    const notTerminatedWithFilter = { ...filter };

    if (filter) {
      notTerminatedWithFilter.where = { ...filter.where, status: { [Op.ne]: ContractStatus.TERMINATED } };
    } else {
      notTerminatedWithFilter.where = { status: { [Op.ne]: ContractStatus.TERMINATED } };
    }

    return Contract.findAll(notTerminatedWithFilter);
  }

  isContractor(profile) {
    return this.ContractorId === profile.id;
  }

  isClient(profile) {
    return this.ClientId === profile.id;
  }
}

Contract.init(
  {
    terms: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    status: {
      type: Sequelize.ENUM('new', 'in_progress', 'terminated')
    }
  },
  {
    sequelize,
    modelName: 'Contract'
  }
);

module.exports = Contract;

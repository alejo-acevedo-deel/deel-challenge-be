const Sequelize = require('sequelize');

const Job = require('./model/job');
const Contract = require('./model/contract');
const Profile = require('./model/profile');

Profile.hasMany(Contract, { as: 'Contractor', foreignKey: 'ContractorId' })
Profile.hasMany(Contract, { as: 'Client', foreignKey: 'ClientId' })
Contract.belongsTo(Profile, { as: 'Contractor' })
Contract.belongsTo(Profile, { as: 'Client' })
Contract.hasMany(Job)
Job.belongsTo(Contract)

const models = {
  Job,
  Contract,
  Profile
}

module.exports = models;

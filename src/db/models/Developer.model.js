const { DataTypes } = require('sequelize');
const { CATEGORIES } = require('../../constants');

/**
 *
 * @param {import('sequelize').Sequelize} sequelize
 */
module.exports = function (sequelize) {
    return sequelize.define(
        'developer',
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true,
                isEmail: true,
            },
            category: {
                type: DataTypes.ENUM(CATEGORIES.FRONT, CATEGORIES.BACK, CATEGORIES.MOBILE, CATEGORIES.DATA),
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
        },
        {
            tableName: 'Developer',
        },
    );
};

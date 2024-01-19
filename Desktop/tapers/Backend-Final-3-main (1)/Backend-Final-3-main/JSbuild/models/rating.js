"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ratingModel = void 0;
var db_1 = require("../config/db");
var sequelize_1 = require("sequelize");
var ratingModel = db_1.sequelize.define('ratings', {
    ratingID: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    rating: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    productID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false,
    tableName: 'ratings'
});
exports.ratingModel = ratingModel;

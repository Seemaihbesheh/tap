"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wishListModel = void 0;
var db_1 = require("../config/db");
var sequelize_1 = require("sequelize");
var wishListModel = db_1.sequelize.define('wishList', {
    wishlistID: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    productID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false,
    tableName: 'wishList'
});
exports.wishListModel = wishListModel;

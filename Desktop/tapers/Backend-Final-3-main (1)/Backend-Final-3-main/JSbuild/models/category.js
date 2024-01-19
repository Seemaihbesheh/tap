"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryModel = void 0;
var db_1 = require("../config/db");
var sequelize_1 = require("sequelize");
var categoryModel = db_1.sequelize.define('category', {
    categoryID: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
    tableName: 'category'
});
exports.categoryModel = categoryModel;

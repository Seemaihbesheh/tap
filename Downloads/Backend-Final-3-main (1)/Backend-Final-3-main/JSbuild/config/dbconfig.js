"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dbConfig = {
    HOST: 'localhost',
    USER: 'root',
    PASSWORD: 'seema123.I',
    DB: 'coraldatabase',
    dialect: 'mysql',
    pool: {
        max: 10,
        min: 1
    }
};
exports.default = dbConfig;

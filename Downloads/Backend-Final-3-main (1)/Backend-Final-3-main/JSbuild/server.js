"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var db_1 = require("./config/db");
var authenticationController_1 = __importDefault(require("./controllers/authenticationController"));
var productRoutes_1 = __importDefault(require("./routes/productRoutes"));
var productRoutes_2 = __importDefault(require("./routes/productRoutes"));
var cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
var app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use('/', authenticationController_1.default);
app.use('/products', productRoutes_1.default);
app.use('/cart', cartRoutes_1.default);
app.use('/wishList', productRoutes_2.default);
(0, db_1.syncModels)()
    .then(function () {
    app.listen(3000, function () {
        console.log("Server is running on port 3000");
    });
})
    .catch(function (error) {
    console.error('Error syncing models:', error);
});

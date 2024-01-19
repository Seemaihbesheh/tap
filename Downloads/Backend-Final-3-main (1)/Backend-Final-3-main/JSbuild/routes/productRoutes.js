"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var sessionMiddleware_1 = require("../middlewares/sessionMiddleware");
var productController_1 = require("../controllers/productController");
router.get('/trendy', productController_1.getTrendyProducts);
router.get('/handpicked', productController_1.handPicked);
router.get('/:productID', productController_1.getSpecificProduct);
router.post('/rate/:productID', sessionMiddleware_1.sessionMiddleware, productController_1.rateProduct);
router.get('/ratings-and-reviews/:productID', productController_1.getRateAndReview);
exports.default = router;

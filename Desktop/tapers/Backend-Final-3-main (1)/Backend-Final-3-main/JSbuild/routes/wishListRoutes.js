"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var wishListController_1 = require("../controllers/wishListController");
var sessionMiddleware_1 = require("../middlewares/sessionMiddleware");
router.get('/', sessionMiddleware_1.sessionMiddleware, wishListController_1.getWishList);
router.post('/:productID', sessionMiddleware_1.sessionMiddleware, wishListController_1.toggleWishlist);
exports.default = router;

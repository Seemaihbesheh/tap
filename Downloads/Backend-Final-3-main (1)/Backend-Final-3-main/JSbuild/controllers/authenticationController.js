"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUser = void 0;
var modelsRelations_1 = require("../models/modelsRelations");
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var bcrypt_1 = __importDefault(require("bcrypt"));
var uuid_1 = require("uuid");
var sessionMiddleware_1 = require("../../src/middlewares/sessionMiddleware");
function findUser(email) {
    return __awaiter(this, void 0, void 0, function () {
        var foundUser, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, modelsRelations_1.userModel.findOne({ where: { email: email } })];
                case 1:
                    foundUser = _a.sent();
                    return [2 /*return*/, foundUser];
                case 2:
                    err_1 = _a.sent();
                    throw new Error('Error finding user:' + err_1.message);
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.findUser = findUser;
function generateSessionID() {
    var uuid = (0, uuid_1.v4)();
    var base64Encoded = Buffer.from(uuid).toString('base64');
    return base64Encoded;
}
router.post('/signup', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, firstName, lastName, foundUser, userData, newUser, sessionID, sessionData, _b, _c, err_2;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                console.log(req.body);
                _a = req.body, email = _a.email, password = _a.password, firstName = _a.firstName, lastName = _a.lastName;
                if (!email || !password || !firstName || !lastName) {
                    return [2 /*return*/, res.status(400).json('All fields are required')];
                }
                _d.label = 1;
            case 1:
                _d.trys.push([1, 5, , 6]);
                return [4 /*yield*/, findUser(req.body.email)];
            case 2:
                foundUser = _d.sent();
                if (foundUser) {
                    throw new Error('Email already exists');
                }
                userData = req.body;
                return [4 /*yield*/, modelsRelations_1.userModel.create({ email: userData.email, password: userData.password, firstName: firstName, lastName: lastName })];
            case 3:
                newUser = _d.sent();
                sessionID = generateSessionID();
                sessionData = { "sessionID": sessionID, "userID": newUser.userID };
                _c = (_b = console).log;
                return [4 /*yield*/, modelsRelations_1.sessionModel.create(sessionData)];
            case 4:
                _c.apply(_b, [_d.sent()]);
                res.status(200).json({ "sessionID": sessionID });
                return [3 /*break*/, 6];
            case 5:
                err_2 = _d.sent();
                res.status(500).json({ error: err_2.message });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, foundUser_1, pass, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, email = _a.email, password = _a.password;
                if (!email || !password) {
                    return [2 /*return*/, res.status(400).json('Please enter all fields')];
                }
                return [4 /*yield*/, findUser(req.body.email)];
            case 1:
                foundUser_1 = _b.sent();
                if (!foundUser_1) {
                    return [2 /*return*/, res.status(404).json('User not found')];
                }
                pass = req.body.password;
                bcrypt_1.default.compare(pass, foundUser_1.password, function (err, result) { return __awaiter(void 0, void 0, void 0, function () {
                    var sessionID, sessionData, _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                if (!err) return [3 /*break*/, 1];
                                res.status(500).json(err.message);
                                return [3 /*break*/, 4];
                            case 1:
                                if (!result) return [3 /*break*/, 3];
                                sessionID = generateSessionID();
                                sessionData = { "sessionID": sessionID, "userID": foundUser_1.userID };
                                _b = (_a = console).log;
                                return [4 /*yield*/, modelsRelations_1.sessionModel.create(sessionData)];
                            case 2:
                                _b.apply(_a, [_c.sent()]);
                                res.status(200).json({ "sessionID": sessionID });
                                return [3 /*break*/, 4];
                            case 3:
                                res.status(401).json('Invalid username or password');
                                _c.label = 4;
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                return [3 /*break*/, 3];
            case 2:
                err_3 = _b.sent();
                res.status(500).json(err_3.message);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/changePassword', sessionMiddleware_1.sessionMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, newPassword, foundUser, passwordMatch, salt, hashedPass, sessionData, err_4, err_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 12, , 13]);
                console.log(req.body);
                _a = req.body, email = _a.email, password = _a.password, newPassword = _a.newPassword;
                if (!email || !password || !newPassword) {
                    return [2 /*return*/, res.status(400).json('Please enter all fields')];
                }
                return [4 /*yield*/, findUser(email)];
            case 1:
                foundUser = _b.sent();
                if (!foundUser) {
                    return [2 /*return*/, res.status(404).json('User not found')];
                }
                return [4 /*yield*/, bcrypt_1.default.compare(password, foundUser.password)];
            case 2:
                passwordMatch = _b.sent();
                if (!passwordMatch) return [3 /*break*/, 10];
                return [4 /*yield*/, bcrypt_1.default.genSalt(10)];
            case 3:
                salt = _b.sent();
                return [4 /*yield*/, bcrypt_1.default.hash(newPassword, salt)];
            case 4:
                hashedPass = _b.sent();
                _b.label = 5;
            case 5:
                _b.trys.push([5, 8, , 9]);
                return [4 /*yield*/, modelsRelations_1.userModel.update({ password: hashedPass }, __assign({ where: { email: email } }, { validate: false }))];
            case 6:
                _b.sent();
                sessionData = req.session;
                return [4 /*yield*/, modelsRelations_1.sessionModel.destroy({ where: { userID: sessionData.userID } })];
            case 7:
                _b.sent();
                res.json('password updated succesfully');
                return [3 /*break*/, 9];
            case 8:
                err_4 = _b.sent();
                throw err_4;
            case 9: return [3 /*break*/, 11];
            case 10:
                res.status(401).json('Invalid username or password');
                _b.label = 11;
            case 11: return [3 /*break*/, 13];
            case 12:
                err_5 = _b.sent();
                res.status(500).json(err_5.message);
                return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
        }
    });
}); });
router.delete('/logout', sessionMiddleware_1.sessionMiddleware, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var sessionData, userSession, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                sessionData = req.session;
                return [4 /*yield*/, modelsRelations_1.sessionModel.findOne({ where: { sessionID: sessionData.sessionID } })];
            case 1:
                userSession = _a.sent();
                if (!userSession) {
                    return [2 /*return*/, res.status(404).json({ error: 'No sessions found for the user' })];
                }
                return [4 /*yield*/, modelsRelations_1.sessionModel.destroy({ where: { sessionID: sessionData.sessionID } })];
            case 2:
                _a.sent();
                res.status(200).json({ message: 'Logged out successfully' });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                res.status(500).json({ error: 'Failed to logout', details: error_1.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dbschema_1 = require("../db/dbschema");
dotenv_1.default.config();
const jwtSecret = process.env.JWT_SECRET || "Rajesh@friedman235";
function auth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'No token found'
                });
                return;
            }
            const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
            console.log(decoded);
            const user = yield dbschema_1.Usermodel.findById(decoded.id);
            if (!user) {
                return res.status(401).json({ message: 'Invalid token'
                });
                return;
            }
            req.user = user;
            next();
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ message: 'Invalid token'
            });
            return;
        }
    });
}
exports.default = auth;

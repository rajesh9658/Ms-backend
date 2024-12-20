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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = __importDefault(require("zod"));
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const dbschema_1 = require("../db/dbschema");
const middleware_1 = __importDefault(require("../middleware/middleware"));
const JWT_SECRET = process.env.JWT_SECRET || "Rajesh@friedman235";
const userrouter = (0, express_1.Router)();
userrouter.get('/test', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ message: 'test route working fine' });
}));
//@ts-ignore
userrouter.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Zod validation schema
    const requirebody = zod_1.default.object({
        username: zod_1.default.string().min(3).max(20).regex(/^[a-zA-Z0-9]+$/),
        password: zod_1.default.string().min(6).max(20).regex(/^[a-zA-Z0-9]+$/),
        email: zod_1.default.string().email(),
    });
    try {
        // Parsing the request body with Zod
        const parsedbody = requirebody.parse(req.body);
        // Accessing parsed fields
        const { username, password, email } = parsedbody;
        // Password hashing & saving user to database
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        yield dbschema_1.Usermodel.create({ username, password: hashedPassword, email });
        res.json({ message: 'User created successfully' });
    }
    catch (error) {
        // Handling Zod validation errors
        if (error instanceof zod_1.default.ZodError) {
            return res.status(400).json({ message: 'Invalid body', errors: error.errors });
        }
        // Handling other errors
        console.error(error);
        res.status(500).json({ message: 'User creation failed' });
    }
}));
//@ts-ignore
userrouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield dbschema_1.Usermodel.findOne({ username });
    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    //password comparison
    const machedpassword = yield bcrypt_1.default.compare(password, user.password);
    //asing token to user
    if (machedpassword) {
        const token = jsonwebtoken_1.default.sign({ id: user._id.toString() }, JWT_SECRET);
        res.json({
            user: {
                Id: user._id.toString(),
                username: user.username,
                email: user.email
            },
            token
        });
        return;
    }
    return res.status(401).json({ message: 'Invalid username or password' });
}));
//@ts-ignore
userrouter.get('/content', middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const userContent = yield dbschema_1.Contentmodel.find({ userid: userId }).populate({
            path: 'tags',
            select: 'title'
        });
        res.status(200).json(userContent);
        return;
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Content fetching failed' });
        return;
    }
}));
exports.default = userrouter;

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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dbschema_1 = require("../db/dbschema");
const tagrouter = (0, express_1.Router)();
tagrouter.get('/test', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ message: 'test route working fine' });
}));
tagrouter.post('/createtag', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title } = req.body;
        yield dbschema_1.Tagmodel.create({ title });
        res.status(200).json({ message: 'Tag created successfully' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Tag creation failed',
            error: error
        });
    }
}));
tagrouter.get('/gettags', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tags = yield dbschema_1.Tagmodel.find({}, '_id title');
        res.status(200).json(tags);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Tag fetching failed',
            error: error
        });
    }
}));
exports.default = tagrouter;

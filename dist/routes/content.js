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
const express_1 = require("express");
const dbschema_1 = require("../db/dbschema");
const mongoose_1 = __importDefault(require("mongoose"));
const contentrouter = (0, express_1.Router)();
contentrouter.get('/test', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ message: 'test route working fine' });
}));
//create content
contentrouter.post('/createcontent', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { link, type, title, description, tags, userid } = req.body;
        yield dbschema_1.Contentmodel.create({
            link,
            type,
            title,
            description,
            tags,
            date: Date.now(),
            userid
        });
        res.status(200).json({ message: 'Content created successfully' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Content creation failed',
            error: error
        });
    }
}));
//delete content
contentrouter.delete('/remove', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contentId, userId } = req.body;
        if (!contentId || !userId) {
            res.status(400).json({ msg: 'Content ID and User ID are required' });
            return;
        }
        // Check if contentId is a valid ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(contentId)) {
            res.status(400).json({ message: 'Invalid Content ID' });
            return;
        }
        const content = yield dbschema_1.Contentmodel.findById(contentId);
        if (!content) {
            res.status(404).json({ msg: 'Content not found' });
            return;
        }
        // Check if the user making the request is the owner of the content
        if (content.userid && content.userid.toString() !== userId) {
            res.status(403).json({ msg: 'You are not authorized to delete this content' });
            return;
        }
        yield dbschema_1.Contentmodel.findByIdAndDelete(contentId);
        res.status(200).json({ msg: 'Content deleted successfully' });
        return;
    }
    catch (error) {
        console.error('Error deleting content:', error);
        res.status(500).json({ msg: 'Internal Server Error' });
        return;
    }
}));
exports.default = contentrouter;

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
const crypto_1 = __importDefault(require("crypto"));
const dbschema_1 = require("../db/dbschema");
const middleware_1 = __importDefault(require("../middleware/middleware"));
const brainrouter = (0, express_1.Router)();
brainrouter.get('/test', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ message: 'test route working fine' });
}));
//@ts-ignore
brainrouter.post('/share', middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("/share route hit");
    try {
        const { share } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        console.log(userId);
        if (!userId) {
            res.status(400).json({ error: 'User ID is required' });
            return;
        }
        // Check if the user has an existing shareable link
        const existingLink = yield dbschema_1.Linkmodel.findOne({ userId });
        if (share) {
            // If sharing is enabled
            if (existingLink) {
                // Reuse existing link
                const hashval = existingLink.hash;
                res.status(200).json({ hashval });
                return;
            }
            // Create a new link
            const hash = crypto_1.default.randomBytes(16).toString('hex');
            const newLink = yield dbschema_1.Linkmodel.create({ userId, hash });
            const hashvalue = newLink.hash;
            res.status(201).json({ hashvalue });
            return;
        }
        else {
            // If sharing is disabled
            if (existingLink) {
                // Delete the existing link
                yield dbschema_1.Linkmodel.deleteOne({ userId });
                res.status(200).json({ message: 'Sharing disabled, link removed.' });
                return;
            }
            // No link to remove
            res.status(404).json({ error: 'No shareable link found for this user.' });
            return;
        }
    }
    catch (error) {
        console.error('Error toggling shareable link:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
        return;
    }
}));
brainrouter.get('/share/user/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        // Find the link associated with the userId
        const link = yield dbschema_1.Linkmodel.findOne({ userId });
        if (!link) {
            res.status(404).json({ msg: 'No shareable link found' });
            return;
        }
        res.status(200).json({ link });
    }
    catch (error) {
        console.error("Error retrieving user's shareable link:", error);
        res.status(500).json({ error: 'An error occurred while retrieving the user shareable link.' });
    }
}));
brainrouter.get('/share/:hash', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hash = req.params.hash;
        // Find the link associated with the hash
        const link = yield dbschema_1.Linkmodel.findOne({ hash }).populate({
            path: 'userId', // Field to populate
            select: 'username',
        });
        if (!link) {
            res.status(404).json({ error: 'Invalid or expired link' });
            return;
        }
        // Retrieve all shared contents for the associated user
        const sharedContents = yield dbschema_1.Contentmodel.find({
            userId: link.userId
        });
        const user = link.userId;
        res.status(200).json({ user, sharedContents });
    }
    catch (error) {
        console.error('Error retrieving shared contents:', error);
        res.status(500).json({ error: 'An error occurred while retrieving the shared contents.' });
    }
}));
exports.default = brainrouter;

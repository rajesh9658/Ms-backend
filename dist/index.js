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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const Dbconn_1 = __importDefault(require("./config/Dbconn"));
const user_1 = __importDefault(require("./routes/user"));
const tags_1 = __importDefault(require("./routes/tags"));
const content_1 = __importDefault(require("./routes/content"));
const brains_1 = __importDefault(require("./routes/brains"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/v1/user', user_1.default);
app.use('/api/v1/tag', tags_1.default);
app.use('/api/v1/content', content_1.default);
app.use('/api/v1/brain', brains_1.default);
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, Dbconn_1.default)();
            app.listen(3000, () => {
                console.log('Server is running on http://localhost:3000');
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
main();
exports.default = app;

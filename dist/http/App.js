"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = require("body-parser");
const AdminRoutes_1 = __importDefault(require("./routes/AdminRoutes"));
const AdvertiserRoutes_1 = __importDefault(require("./routes/AdvertiserRoutes"));
const AuctRoutes_1 = __importDefault(require("./routes/AuctRoutes"));
const ClientRoutes_1 = __importDefault(require("./routes/ClientRoutes"));
const CreditCardRoutes_1 = __importDefault(require("./routes/CreditCardRoutes"));
const ProductRoutes_1 = __importDefault(require("./routes/ProductRoutes"));
const ModeratorRoutes_1 = __importDefault(require("./routes/ModeratorRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, body_parser_1.json)());
app.use('/admin', AdminRoutes_1.default);
app.use('/advertiser', AdvertiserRoutes_1.default);
app.use('/auct', AuctRoutes_1.default);
app.use('/client', ClientRoutes_1.default);
app.use('/credit-card', CreditCardRoutes_1.default);
app.use('/products', ProductRoutes_1.default);
app.use('/moderator', ModeratorRoutes_1.default);
app.use('/', (req, res) => {
    res.send('AUKT API version 1.0');
});
app.listen(process.env.PORT || 3008, () => {
    console.log('[DM] Server running on PORT: ', process.env.PORT);
});
exports.default = app;

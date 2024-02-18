"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./src/database/models/index"));
const app_1 = __importDefault(require("./app"));
const PORT = 4040;
const HOST = "0.0.0.0";
app_1.default.listen(PORT, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
const connectWithRetry = () => {
    index_1.default.sequelize
        .sync()
        .then(() => console.log("PostgreSQL connection was successful..."))
        .catch((e) => {
        console.log("Failed to sync db: " + e.message);
        setTimeout(connectWithRetry, 5000);
    });
};
connectWithRetry();

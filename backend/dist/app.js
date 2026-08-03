"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const routes_1 = __importDefault(require("./routes"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: {
        policy: "cross-origin",
    },
}));
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "uploads")));
// Older seeded properties reference images that may not exist on disk.
// Serve a lightweight placeholder instead of returning a broken image/404.
app.get("/uploads/properties/:filename", (_req, res) => {
    res
        .status(200)
        .type("image/svg+xml")
        .send(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 560" role="img" aria-label="Property image unavailable">
        <rect width="800" height="560" fill="#e2e8f0"/>
        <path d="M170 400l135-145 92 94 72-76 161 127H170z" fill="#94a3b8"/>
        <circle cx="290" cy="165" r="46" fill="#f8fafc"/>
        <text x="400" y="485" text-anchor="middle" fill="#475569" font-family="Arial, sans-serif" font-size="30">Property image unavailable</text>
      </svg>
    `);
});
app.use(express_1.default.json());
app.use('/api', routes_1.default);
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', service: 'baribhara-api' });
});
app.get('/', (_req, res) => {
    res.status(200).json({ message: 'BariBhara API is running' });
});
exports.default = app;

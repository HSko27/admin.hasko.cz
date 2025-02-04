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
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use(express_1.default.json());
const JWT_SECRET = process.env.JWT_SECRET;
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).json({ message: "HELLO" });
}));
app.get("/db", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma.message.findMany();
    return res.status(200).json(users);
}));
app.delete("/db/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield prisma.message.delete({
        where: { id: parseInt(id) },
    });
    return res.status(200).json({ user: user });
}));
app.get("/admin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield prisma.users.findMany();
    return res.status(200).json(admin);
}));
app.delete("/admin/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const admin = yield prisma.users.delete({
        where: { id: parseInt(id) },
    });
    return res.status(200).json({ user: admin });
}));
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { names, pass } = req.body;
        console.log("🔹 Přihlášení:", { names, pass });
        if (typeof names !== "string" || typeof pass !== "string" || !names.trim() || !pass.trim()) {
            return res.status(400).json({ message: "Jméno a heslo jsou povinné" });
        }
        const user = yield prisma.users.findUnique({
            where: { names },
        });
        if (!user) {
            console.log("Uživatel nenalezen");
            return res.status(401).json({ message: "Špatné přihlašovací údaje" });
        }
        console.log("Nalezený uživatel:", user);
        const hashedPass = user.pass;
        const validPass = yield bcryptjs_1.default.compare(pass, hashedPass);
        console.log("Heslo platné?", validPass);
        if (!validPass) {
            return res.status(401).json({ message: "Špatné přihlašovací údaje" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, names: user.names }, JWT_SECRET, { expiresIn: "1h" });
        console.log("Token vygenerován:", token);
        res.json({ token });
    }
    catch (error) {
        console.error("Chyba serveru:", error);
        res.status(500).json({ message: "Chyba serveru" });
    }
}));
app.post("/createMess", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, firstName, lastName, message } = req.body;
        if (!email || !firstName || !lastName || !message) {
            return res.status(400).json({ error: "Všechna pole jsou povinná!" });
        }
        const existingMessage = yield prisma.message.findUnique({
            where: { email },
        });
        if (existingMessage) {
            return res.status(409).json({ error: "E-mail už existuje v databázi!" });
        }
        const newMessage = yield prisma.message.create({
            data: { email, firstName, lastName, message },
        });
        console.log("Data uložená do databáze:", newMessage);
        res.json({ message: "Data byla uložena!", data: newMessage });
    }
    catch (error) {
        console.error("Chyba při ukládání do databáze:", error);
        res.status(500).json({ error: "Interní chyba serveru" });
    }
}));
app.listen(3002, () => console.log("Server běží na http://5.39.202.91:3002"));

import express, { Request, Response } from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET as string;

app.post("/login", async (req: Request, res: Response) => {
    try {
        const { names, pass } = req.body;
        console.log("🔹 Přihlášení:", { names, pass });

        if (typeof names !== "string" || typeof pass !== "string" || !names.trim() || !pass.trim()) {
            return res.status(400).json({ message: "Jméno a heslo jsou povinné" });
        }

        const user = await prisma.users.findUnique({
            where: { names },
        });

        if (!user) {
            console.log("❌ Uživatel nenalezen");
            return res.status(401).json({ message: "Špatné přihlašovací údaje" });
        }

        console.log("✅ Nalezený uživatel:", user);

        const hashedPass = user.pass;
        const validPass = await bcrypt.compare(pass, hashedPass);
        console.log("🔑 Heslo platné?", validPass);

        if (!validPass) {
            return res.status(401).json({ message: "Špatné přihlašovací údaje" });
        }

        const token = jwt.sign({ id: user.id, names: user.names }, JWT_SECRET, { expiresIn: "1h" });

        console.log("🔐 Token vygenerován:", token);
        res.json({ token });
    } catch (error) {
        console.error("🚨 Chyba serveru:", error);
        res.status(500).json({ message: "Chyba serveru" });
    }
});

app.listen(3002, () => console.log("🚀 Server běží na http://localhost:3002"));

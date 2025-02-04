import express, { Request, Response } from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();
const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET as string;

app.get("/", async (req: Request, res: Response) => {
  return res.status(200).json({ message: "HELLO" });
});

app.get("/db", async (req: Request, res: Response) => {
  const users = await prisma.message.findMany();
  return res.status(200).json(users);
});

app.delete("/db/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await prisma.message.delete({
    where: { id: parseInt(id) },
  });
  return res.status(200).json({ user: user });
});

app.get("/admin", async (req: Request, res: Response) => {
  const admin = await prisma.users.findMany();
  return res.status(200).json(admin);
});

app.delete("/admin/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const admin = await prisma.users.delete({
    where: { id: parseInt(id) },
  });
  return res.status(200).json({ user: admin });
});

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
      console.log("Uživatel nenalezen");
      return res.status(401).json({ message: "Špatné přihlašovací údaje" });
    }

    console.log("Nalezený uživatel:", user);

    const hashedPass = user.pass;
    const validPass = await bcrypt.compare(pass, hashedPass);
    console.log("Heslo platné?", validPass);

    if (!validPass) {
      return res.status(401).json({ message: "Špatné přihlašovací údaje" });
    }

    const token = jwt.sign({ id: user.id, names: user.names }, JWT_SECRET, { expiresIn: "1h" });

    console.log("Token vygenerován:", token);
    res.json({ token });
  } catch (error) {
    console.error("Chyba serveru:", error);
    res.status(500).json({ message: "Chyba serveru" });
  }
});

app.post("/createMess", async (req, res) => {
  try {
    const { email, firstName, lastName, message } = req.body;

    if (!email || !firstName || !lastName || !message) {
      return res.status(400).json({ error: "Všechna pole jsou povinná!" });
    }

    const existingMessage = await prisma.message.findUnique({
      where: { email },
    });

    if (existingMessage) {
      return res.status(409).json({ error: "E-mail už existuje v databázi!" });
    }

    const newMessage = await prisma.message.create({
      data: { email, firstName, lastName, message },
    });

    console.log("Data uložená do databáze:", newMessage);

    res.json({ message: "Data byla uložena!", data: newMessage });
  } catch (error) {
    console.error("Chyba při ukládání do databáze:", error);
    res.status(500).json({ error: "Interní chyba serveru" });
  }
});

app.listen(3002, () => console.log("Server běží na http://5.39.202.91:3002"));

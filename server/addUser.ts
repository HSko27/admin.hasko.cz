import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createUser() {
    const hashedPassword = await bcrypt.hash("Hoffy123.", 10);

    const user = await prisma.users.create({
        data: {
            pass: hashedPassword,
            names: "hsko",
        },
    });

    console.log("Uživatel vytvořen:", user);
}

createUser()
    .catch((error) => {
        console.error("Chyba při vytváření uživatele:", error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

"use strict";
const path = require("path");
require("dotenv").config({ path: path.resolve(process.cwd(), ".env") });
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

console.log("DATABASE_URL check:", process.env.DATABASE_URL ? "FOUND" : "NOT FOUND");

const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL
});

async function main() {
    // Clear existing (optional for mongo but good for re-seed)
    // await prisma.user.deleteMany({});

    const passwordHash = await bcrypt.hash("admin123", 10);
    const employeePasswordHash = await bcrypt.hash("staff123", 10);

    console.log("Seeding database...");

    // 1. Create Admin
    const admin = await prisma.user.upsert({
        where: { email: "admin@studio.com" },
        update: {},
        create: {
            email: "admin@studio.com",
            name: "Studio Sahibi",
            passwordHash: passwordHash,
            role: "ADMIN",
            phone: "05551112233",
        },
    });

    // 2. Create Employees
    const ali = await prisma.user.upsert({
        where: { email: "ali@studio.com" },
        update: {},
        create: {
            email: "ali@studio.com",
            name: "Ali Fotoğrafçı",
            passwordHash: employeePasswordHash,
            role: "EMPLOYEE",
            phone: "05553334455",
            employee: {
                create: {
                    position: "Fotoğrafçı",
                    isActive: true,
                },
            },
        },
    });

    const ayse = await prisma.user.upsert({
        where: { email: "ayse@studio.com" },
        update: {},
        create: {
            email: "ayse@studio.com",
            name: "Ayşe Editör",
            passwordHash: employeePasswordHash,
            role: "EMPLOYEE",
            phone: "05556667788",
            employee: {
                create: {
                    position: "Editör",
                    isActive: true,
                },
            },
        },
    });

    // 3. Create Customers
    const customer1 = await prisma.customer.create({
        data: {
            name: "Mehmet Yılmaz",
            phone: "05321112233",
            email: "mehmet@gmail.com",
            socialMedia: "@mehmety",
            notes: "Düğün çekimi istiyor.",
        },
    });

    // 4. Create Shoots
    const shoot1 = await prisma.shoot.create({
        data: {
            customerId: customer1.id,
            title: "Yılmaz Düğün Çekimi",
            type: "Düğün",
            startDateTime: new Date("2026-02-10T10:00:00Z"),
            endDateTime: new Date("2026-02-10T18:00:00Z"),
            location: "Gül Bahçesi",
            package: "Full Paket",
            totalPrice: 15000,
            deposit: 3000,
            status: "PLANNED",
        },
    });

    // 5. Create Tasks
    await prisma.task.create({
        data: {
            shootId: shoot1.id,
            title: "Ekipman Hazırlığı",
            description: "Lensler ve ışıklar kontrol edilecek.",
            assignedTo: ali.id,
            createdBy: admin.id,
            priority: "HIGH",
            status: "TODO",
            deadline: new Date("2026-02-09T18:00:00Z"),
        },
    });

    console.log("Seed data created successfully.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

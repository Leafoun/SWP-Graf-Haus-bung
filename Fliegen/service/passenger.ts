import * as passengerRepo from "../Repository/passenger.ts";

export async function createPassenger(data: {
    firstName: string;
    lastName: string;
    email: string;
}) {
    // Business-Logik: Email-Validierung
    if (!data.email.includes("@")) {
        throw new Error("Invalid email format");
    }

    // Delegiere an Repository
    return await passengerRepo.create(data);
}

export async function createManyPassengers(data: Array<{
    firstName: string;
    lastName: string;
    email: string;
}>) {
    // Validiere alle Emails
    for (const passenger of data) {
        if (!passenger.email.includes("@")) {
            throw new Error(`Invalid email format: ${passenger.email}`);
        }
    }

    // Delegiere an Prisma (SQLite unterstützt kein skipDuplicates)
    // Bei Duplikaten wird der gesamte Batch fehlschlagen
    const { prisma } = await import("../Repository/db.ts");
    return await prisma.passenger.createMany({ data });
}

export { count, findMany } from "../Repository/passenger.ts";

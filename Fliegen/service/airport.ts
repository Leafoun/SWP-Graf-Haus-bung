import * as airportRepo from "../Repository/airport.ts";

export async function createAirport(data: {
    name: string;
    iataCode: string;
    city: string;
}) {
    // Business-Logik: IATA Code Validierung
    if (data.iataCode.length !== 3) {
        throw new Error("IATA code must be exactly 3 characters");
    }

    if (!/^[A-Z]{3}$/.test(data.iataCode)) {
        throw new Error("IATA code must contain only uppercase letters");
    }

    // Delegiere an Repository
    return await airportRepo.create(data);
}

export async function createManyAirports(data: Array<{
    name: string;
    iataCode: string;
    city: string;
}>) {
    // Validiere alle IATA Codes
    for (const airport of data) {
        if (airport.iataCode.length !== 3 || !/^[A-Z]{3}$/.test(airport.iataCode)) {
            throw new Error(`Invalid IATA code: ${airport.iataCode}`);
        }
    }

    // Delegiere an Prisma (SQLite unterstützt kein skipDuplicates)
    // Bei Duplikaten wird der gesamte Batch fehlschlagen
    const { prisma } = await import("../Repository/db.ts");
    return await prisma.airport.createMany({ data });
}

export { count, getAll } from "../Repository/airport.ts";
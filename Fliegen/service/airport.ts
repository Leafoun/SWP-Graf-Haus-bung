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

export { count, getAll } from "../Repository/airport.ts";

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

export { count, findMany } from "../Repository/passenger.ts";

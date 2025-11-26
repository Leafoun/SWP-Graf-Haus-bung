import * as flightRepo from "../Repository/flight.ts";

export async function createFlight(data: {
    flightNumber: string;
    departureTime: Date;
    arrivalTime: Date;
    originId: string;
    destinationId: string;
    planeId: string;
}) {
    // Business-Logik: Validierung
    if (data.departureTime >= data.arrivalTime) {
        throw new Error("Departure time must be before arrival time");
    }

    if (data.originId === data.destinationId) {
        throw new Error("Origin and destination must be different");
    }

    // Delegiere an Repository
    return await flightRepo.create(data);
}

export async function createManyFlights(data: Array<{
    flightNumber: string;
    departureTime: Date;
    arrivalTime: Date;
    originId: string;
    destinationId: string;
    planeId: string;
}>) {
    // Validiere alle Flights
    for (const flight of data) {
        if (flight.departureTime >= flight.arrivalTime) {
            throw new Error(`Invalid times for flight ${flight.flightNumber}`);
        }
        if (flight.originId === flight.destinationId) {
            throw new Error(`Same origin and destination for flight ${flight.flightNumber}`);
        }
    }

    // Delegiere an Prisma
    const { prisma } = await import("../Repository/db.ts");
    return await prisma.flight.createMany({ data });
}

export async function bookPassengersToFlight(flightId: string, passengerIds: string[]) {
    // Business-Logik: Prüfe ob Flight existiert und hole Plane-Kapazität
    const flights = await flightRepo.findMany();
    const flight = flights.find(f => f.id === flightId);
    
    if (!flight) {
        throw new Error("Flight not found");
    }

    // Optional: Kapazitätsprüfung (wenn Passengers bereits geladen sind)
    // const plane = await planeRepo.findById(flight.planeId);
    // if (currentPassengerCount + passengerIds.length > plane.capacity) {
    //     throw new Error("Flight capacity exceeded");
    // }

    // Delegiere an Prisma (direkt, da assignPassenger im Repo nicht exportiert wird)
    const { prisma } = await import("../Repository/db.ts");
    return await prisma.flight.update({
        where: { id: flightId },
        data: {
            passengers: {
                connect: passengerIds.map(id => ({ id }))
            }
        }
    });
}

export { count, findMany, findManyWithRelations, findById } from "../Repository/flight.ts";

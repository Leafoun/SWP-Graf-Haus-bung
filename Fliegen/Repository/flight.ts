import { Prisma } from "../prisma/client/browser.ts";
import { prisma } from "./db.ts"

export async function count() {
    return await prisma.flight.count();
}
export async function create(data:Prisma.FlightCreateArgs["data"]) {
    return await prisma.flight.create({data});
}
export async function findMany() {
    return await prisma.flight.findMany();
}

export async function findManyWithRelations() {
    return await prisma.flight.findMany({
        include: {
            passengers: true,
            plane: true,
            origin: true,
            destination: true,
        }
    });
}

export async function findById(id: string) {
    return await prisma.flight.findUnique({
        where: { id },
        include: {
            passengers: true,
            plane: true,
            origin: true,
            destination: true,
        }
    });
}

export async function assignPassenger(id: string, data: Prisma.FlightUpdateInput) {
    return await prisma.flight.update({ where: { id }, data });
}

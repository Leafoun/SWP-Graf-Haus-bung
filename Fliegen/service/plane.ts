import * as planeRepo from "../Repository/plane.ts";

export async function createPlane(data: {
    model: string;
    capacity: number;
}) {
    // Business-Logik: Validierung
    if (data.capacity <= 0) {
        throw new Error("Plane capacity must be positive");
    }

    if (data.capacity > 1000) {
        throw new Error("Plane capacity exceeds maximum (1000)");
    }

    // Delegiere an Repository
    return await planeRepo.create(data);
}

export async function createManyPlanes(data: Array<{
    model: string;
    capacity: number;
}>) {
    // Validiere alle Kapazitäten
    for (const plane of data) {
        if (plane.capacity <= 0 || plane.capacity > 1000) {
            throw new Error(`Invalid capacity: ${plane.capacity}`);
        }
    }

    // Delegiere an Prisma
    const { prisma } = await import("../Repository/db.ts");
    return await prisma.plane.createMany({ data });
}

export { count, getAll } from "../Repository/plane.ts";

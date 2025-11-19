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

export { count, getAll } from "../Repository/plane.ts";

import * as passengerService from "./service/passenger.ts";
import * as planeService from "./service/plane.ts";
import * as airportService from "./service/airport.ts";
import * as flightService from "./service/flight.ts";
import { faker } from "@faker-js/faker";
import { disconnect } from "./Repository/db.ts";


const ensurePassengers = 20000;
const ensureAirports = 100;
const ensurePlanes = 250;
const ensureFlights = 5000;

console.log("🌱 Starting seed...");

// ensure passengers (no deps)
console.log(`Ensuring ${ensurePassengers} passengers...`);
const passengers_to_create = ensurePassengers - await passengerService.count();
if (passengers_to_create > 0) {
    const passengerData = Array.from({ length: passengers_to_create }, () => ({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
    }));
    await passengerService.createManyPassengers(passengerData);
    console.log(`  Created ${passengers_to_create} passengers (duplicates skipped)`);
}

// ensure planes (no deps)
console.log(`Ensuring ${ensurePlanes} planes...`);
const planes_to_create = ensurePlanes - await planeService.count();
if (planes_to_create > 0) {
    const planeData = Array.from({ length: planes_to_create }, () => ({
        model: faker.airline.airplane().name,
        capacity: faker.number.int({ min: 10, max: 850 }),
    }));
    await planeService.createManyPlanes(planeData);
    console.log(`  Created ${planes_to_create} planes`);
}

// ensure airports (no deps)
console.log(`Ensuring ${ensureAirports} airports...`);
const airports_to_create = ensureAirports - await airportService.count();
if (airports_to_create > 0) {
    const airportData = Array.from({ length: airports_to_create }, () => {
        const fake_airport = faker.airline.airport();
        return {
            name: fake_airport.name,
            iataCode: fake_airport.iataCode,
            city: faker.location.city(),
        };
    });
    await airportService.createManyAirports(airportData);
    console.log(`  Created airports (duplicates skipped)`);
}

// ensure flights (depends on airport, plane)
console.log(`Ensuring ${ensureFlights} flights...`);
const flights_to_create = ensureFlights - await flightService.count();

// Fetch available airports and planes (once!)
const airports = await airportService.getAll();
const planes = await planeService.getAll();

if (airports.length < 2) {
    console.error("❌ Need at least 2 airports to create flights!");
    Deno.exit(1);
}
if (planes.length === 0) {
    console.error("❌ Need at least 1 plane to create flights!");
    Deno.exit(1);
}

if (flights_to_create > 0) {
    const flightData = Array.from({ length: flights_to_create }, () => {
        const departure = faker.date.soon({ days: 30 });
        const arrival = new Date(departure.getTime() + faker.number.int({ min: 1, max: 12 }) * 3600000);
        
        const origin = airports[faker.number.int({ min: 0, max: airports.length - 1 })];
        let destination = airports[faker.number.int({ min: 0, max: airports.length - 1 })];
        while (destination.id === origin.id && airports.length > 1) {
            destination = airports[faker.number.int({ min: 0, max: airports.length - 1 })];
        }
        const plane = planes[faker.number.int({ min: 0, max: planes.length - 1 })];
        
        return {
            flightNumber: faker.airline.flightNumber(),
            departureTime: departure,
            arrivalTime: arrival,
            originId: origin.id,
            destinationId: destination.id,
            planeId: plane.id,
        };
    });
    await flightService.createManyFlights(flightData);
    console.log(`  Created ${flights_to_create} flights`);
}

// assign passengers to flights
console.log("Assigning passengers to flights...");
const allFlights = await flightService.findMany();
const allPassengers = await passengerService.findMany();

console.log(`Found ${allFlights.length} flights and ${allPassengers.length} passengers`);

if (allFlights.length > 0 && allPassengers.length > 0) {
    let assignedCount = 0;
    for (const f of allFlights) {
        // Random number of passengers per flight (0 to 50)
        const numPassengers = faker.number.int({ min: 0, max: Math.min(50, allPassengers.length) });
        
        // Pick random unique passengers using a Set for uniqueness
        const selectedPassengerIds = new Set<string>();
        let attempts = 0;
        while (selectedPassengerIds.size < numPassengers && attempts < numPassengers * 3) {
            const randomIndex = faker.number.int({ min: 0, max: allPassengers.length - 1 });
            const randomPassenger = allPassengers[randomIndex];
            if (randomPassenger && randomPassenger.id) {
                selectedPassengerIds.add(randomPassenger.id);
            }
            attempts++;
        }
        
        if (selectedPassengerIds.size > 0) {
            try {
                await flightService.bookPassengersToFlight(f.id, Array.from(selectedPassengerIds));
                assignedCount++;
                if (assignedCount % 100 === 0) {
                    console.log(`  Assigned passengers to ${assignedCount} flights...`);
                }
            } catch (e) {
                console.error(`Error assigning passengers to flight ${f.flightNumber}:`, (e as Error).message);
            }
        }
    }
    console.log(`✅ Assigned passengers to ${assignedCount} flights`);
}

console.log("✅ Seed complete!");
await disconnect();
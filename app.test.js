const airports = require("./airports");
const app = require("./app");
const request = require("supertest");

describe("GET test", () => {
    test("GET /airports returns all airports", async () => {
        const response = await request(app).get("/airports");
        expect(response.status).toBe(200);
        expect(response.body).toEqual(airports);
    });

    test("GET /airports/:icao should return the correct airport", async () => {
        const randAirport =
            airports[Math.floor(Math.random() * airports.length)];
        const icao = randAirport.icao;
        const response = await request(app).get("/airports/" + icao);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(randAirport);
    });

    test("GET /airports/:icao should return 404 if not found", async () => {
        const response = await request(app).get(
            "/airports/" + "thisWouldNeverBeAnIcao"
        );
        expect(response.status).toBe(404);
    });
});

describe("POST test", () => {
    test("POST /airports creates given airport", async () => {
        const newAirport = {
            icao: "00CRM",
            iata: "",
            name: "Charlie Merrell",
            city: "Anchor Point",
            state: "Alaska",
            country: "US",
            elevation: 850,
            lat: 59.94919968,
            lon: -151.695999146,
            tz: "America/Anchorage",
        };
        const response = await request(app).post("/airports").send(newAirport);
        expect(response.status).toBe(201);
        const ourNewAirport = airports.find(
            (airport) => airport.icao === "00CRM"
        );
        expect(ourNewAirport).toEqual(newAirport);
    });
    test("POST /airports creates given airport", async () => {
        const response = await request(app).post("/airports").send(airports[0]);
        expect(response.status).toBe(409);
    });
});

describe("PUT tests", () => {
    test("PUT /airports/:icao replaces the given airport", async () => {
        const newAirport = {
            iata: "",
            name: "Charlie Merrell",
            city: "Anchor Point",
            state: "Alaska",
            country: "US",
            elevation: 850,
            lat: 59.94919968,
            lon: -151.695999146,
            tz: "America/Anchorage",
        };
        const icao = airports[0].icao;
        const response = await request(app)
            .put("/airports/" + icao)
            .send(newAirport);
        expect(response.status).toBe(200);
        newAirport.icao = icao;
        const ourNewAirport = airports.find((airport) => airport.icao === icao);
        expect(ourNewAirport).toEqual(newAirport);
    });
    test("PUT /airports/:icao gives 404 if not found", async () => {
        const newAirport = {
            iata: "",
            name: "Charlie Merrell",
            city: "Anchor Point",
            state: "Alaska",
            country: "US",
            elevation: 850,
            lat: 59.94919968,
            lon: -151.695999146,
            tz: "America/Anchorage",
        };
        const icao = "completeNonsense";
        const response = await request(app)
            .put("/airports/" + icao)
            .send(newAirport);
        expect(response.status).toBe(404);
    });
});

describe("DELETE tests", () => {
    test("DELETE /airports/:icao should delete the given airport", async () => {
        const randAirport =
            airports[Math.floor(Math.random() * airports.length)];
        const icao = randAirport.icao;
        const response = await request(app).delete("/airports/" + icao);
        expect(response.status).toBe(200);
        const airportIndex = airports.findIndex(
            (airport) => airport.icao === icao
        );
        expect(airportIndex).toBe(-1);
    });
    test("DELETE /airports/:icao should give 404 if not found", async () => {
        const icao = "surelyThisIsStillNotAnIcao";
        const beforeLength = airports.length;
        const response = await request(app).delete("/airports/" + icao);
        expect(response.status).toBe(404);
        expect(airports.length).toBe(beforeLength);
    });
});

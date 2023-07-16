const request = require("supertest")
const baseURL = "http://localhost:3000";
describe("POST /data", () => {
    describe('Given invalid data', () => {
        const data = "1649941817 Voltage 1.34";
        test("should return error", async () => {
            const result = await request(baseURL).post("/data").send(data);
            expect(result.status).toBe(200);
            expect(result.body).toEqual({ success: false });
        });
    });
    xdescribe('Given valid data', () => {
        const data = "1649941817 Voltage 1.34";
        test("should call return success", async () => {
            // POST some data to the server without crashing
            const result = await request(baseURL).post("/data").send(data);
            expect(result.status).toBe(200);
            console.log(result.body);
            expect(result.body).toEqual({ success: true });
        });
    });
});

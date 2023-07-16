const request = require("supertest");
const baseURL = "http://localhost:3000";

describe("POST /data", () => {
  describe("Given invalid data", () => {
    test.each([
      "1649941817 Voltage NotAFloat",
      "1649941817 NotAValidString 1.34",
      "NotADate Voltage 1.34",
    ])("%s should return error", async (data) => {
      const result = await request(baseURL)
        .post("/data")
        .set("Content-type", "text/plain")
        .send(data);
      expect(result.status).toBe(200);
      expect(result.body).toEqual({ success: false });
    });
  });

  describe("Given valid data", () => {
    const data = `1649941817 Voltage 1.34
    1649941818 Voltage 1.35
    1649941817 Current 12.0
    1649941818 Current 14.0`;
    test("should return success", async () => {
      const result = await request(baseURL)
        .post("/data")
        .set("Content-type", "text/plain")
        .send(data);
      expect(result.status).toBe(200);
      expect(result.body).toEqual({ success: true });
    });
  });
});

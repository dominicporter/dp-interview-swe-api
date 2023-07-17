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

describe("GET /data", () => {
  // GET /data?from=2022-04-12&to=2022-04-14 — this endpoint should retrieve two query parameters from and to, which will be ISO standard dates or date-times. The API should retrieve all data within the given date range
  test("should retrieve two query parameters from and to, and retrieve all data within the given date range", async () => {
    // Given
    const data = `${new Date("2022-04-10T00:00:00.000Z").valueOf()} Power 20.56
      ${new Date("2022-04-14T13:10:17.000Z").valueOf()} Voltage 1.34
      ${new Date("2022-04-14T13:10:17.000Z").valueOf()} Current 14.0
      ${new Date("2022-04-14T00:00:00.000Z").valueOf()} Power 18.76
      ${new Date("2022-04-15T00:00:00.001Z").valueOf()} Power 5.0`;
    await request(baseURL)
      .post("/data")
      .set("Content-type", "text/plain")
      .send(data);

    // When
    const response = await request(baseURL).get(
      "/data?from=2022-04-14&to=2022-04-15"
    );

    // Then
    expect(response.statusCode).toBe(200);
    expect(response.body.error).toBe(undefined);
    expect(response.body).toEqual({
      averagePower: 0,
      data: [
        {
          name: "Voltage",
          time: "2022-04-14T13:10:17.000Z",
          value: 1.34,
        },
        {
          name: "Current",
          time: "2022-04-14T13:10:17.000Z",
          value: 14,
        },
        {
          name: "Power",
          time: "2022-04-14T00:00:00.000Z",
          value: 18.76,
        },
      ],
      success: true,
    });
    expect(response.body.data.length >= 1).toBe(true);
  });

  test.todo('should calculate the average power for the given date range');
});

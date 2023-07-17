import express, { Express } from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import { addReading, getAllReadings } from "./database";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app: Express = express();

app.use(helmet());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.post("/data", async (req, res) => {
  // each line is of the form:
  //  {timestamp} {name} {value}
  try {
    const lines = req.body.split("\n");
    lines.forEach((line: string) => {
      const data = line.split(" ").filter((x) => x !== "");
      const timestamp = parseInt(data[0]);
      const name = data[1];
      const value = parseFloat(data[2]);

      if (
        !(new Date(timestamp).getTime() > 0) ||
        isNaN(value) ||
        !["Voltage", "Current", "Power"].includes(name)
      ) {
        throw new Error("Invalid data");
      }
      addReading(timestamp.toString() + name, { timestamp, name, value });
    });
    return res.json({ success: true });
  } catch (error) {
    console.log(error);
    return res.json({ success: false });
  }
});

app.get("/data", async (req, res) => {
  try {
    const from = new Date(req.query.from as string);
    const to = new Date(req.query.to as string);

    // TODO check from is earlier than to
    if (!(new Date(from).getTime() > 0) || !(new Date(to).getTime() > 0)) {
      throw new Error("Invalid parameters");
    }

    // TODO: move the date filter into DB function
    const readings = getAllReadings();

    const filteredData = readings
      .filter((r) => {
        const readingDate = new Date(r.timestamp);
        // Note: this is from midnight to midnight
        // Should we add one day to 'to' value?
        return readingDate >= from && readingDate < to;
      })
      .map((r) => ({
        time: new Date(r.timestamp),
        name: r.name,
        value: r.value,
      }));

    return res.json({ success: true, data: filteredData, averagePower: 0 });
  } catch {}
  return res.json({ success: false });
});

app.listen(PORT, () => console.log(`Running on port ${PORT} ⚡`));

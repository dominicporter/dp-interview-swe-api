import express, { Express } from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import { addReading, getReading } from "./database";

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
      console.log(data);
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
      addReading(timestamp.toString(), { timestamp, name, value });
    });
    return res.json({ success: true });
  } catch {
    return res.json({ success: false });
  }
});

app.get("/data", async (req, res) => {
  // TODO: check what dates have been requested, and retrieve all data within the given range

  // getReading(...)

  return res.json({ success: false });
});

app.listen(PORT, () => console.log(`Running on port ${PORT} ⚡`));

interface Reading {
  timestamp: number;
  name: string;
  value: number;
}

// This is a fake database which stores data in-memory while the process is running
// Feel free to change the data structure to anything else you would like
const database: Record<string, Reading> = {};

/**
 * Store a reading in the database using the given key
 */
export const addReading = (key: string, reading: Reading): Reading => {
  console.log('adding '+new Date(reading.timestamp).toISOString());
  database[key] = reading;
  return reading;
};

/**
 * Retrieve a reading from the database using the given key
 */
export const getReading = (key: string): Reading | undefined => {
  return database[key];
};

/**
 * Retrieve all the readings in the DB
 */
export const getAllReadings = (): Reading[] => {
  return Object.values(database);
};

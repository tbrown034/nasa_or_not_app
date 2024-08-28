import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use your connection string from the `.env` file
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

export default pool;

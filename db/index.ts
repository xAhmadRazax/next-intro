// // db/index.js
import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres"
import pg from "pg"
import * as schema from "./schema"
const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const db = drizzle({ client: pool, schema })

// import "dotenv/config"
// import { drizzle } from "drizzle-orm/neon-http"
// import { neon } from "@neondatabase/serverless"

// const sql = neon(process.env.DATABASE_URL!)
// export const db = drizzle(sql, { schema })

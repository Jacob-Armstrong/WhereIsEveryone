import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { rows } = await pool.query("SELECT * FROM locations ORDER BY id ASC");
      return res.status(200).json(rows);
    } catch (err) {
      console.error(err);
      // Diagnostic queries to help debug missing table / search_path issues
      try {
        const db = await pool.query("SELECT current_database() as current_database, current_schema() as current_schema, current_user as current_user");
        const searchPath = await pool.query("SELECT current_setting('search_path') as search_path");
        const tables = await pool.query("SELECT schemaname, tablename FROM pg_catalog.pg_tables WHERE schemaname NOT IN ('pg_catalog','information_schema') ORDER BY schemaname, tablename");

        return res.status(500).json({
          error: err.message,
          diagnostics: {
            db: db.rows[0],
            search_path: searchPath.rows[0].search_path,
            tables: tables.rows,
          },
        });
      } catch (diagErr) {
        console.error('Diagnostic query failed', diagErr);
        return res.status(500).json({ error: err.message, diagnostic_error: diagErr.message });
      }
    }
  }

  if (req.method === "POST") {
    try {
      const { name, location, longitude, latitude, date } = req.body;
      const { rows } = await pool.query(
        "INSERT INTO locations(name, location, longitude, latitude, date) VALUES($1,$2,$3,$4,$5) RETURNING *",
        [name, location, longitude || null, latitude || null, date]
      );
      return res.status(201).json(rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

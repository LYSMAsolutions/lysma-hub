import { pool } from "@/lib/db";

export async function GET() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS request_lines (
        id SERIAL PRIMARY KEY,
        request_id INTEGER NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
        quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
        reference TEXT,
        designation TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    return Response.json({
      ok: true,
      message: "Table request_lines créée",
    });
  } catch (error: any) {
    return Response.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
import { pool } from "@/lib/db";

export async function GET() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS requests (
        id SERIAL PRIMARY KEY,
        tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE SET NULL,
        type TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'DRAFT',
        client_name TEXT,
        client_code TEXT,
        comment TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    return Response.json({
      ok: true,
      message: "Table requests créée",
    });
  } catch (error: any) {
    return Response.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
import { pool } from "@/lib/db";

export async function GET() {
  const result = await pool.query("SELECT * FROM requests ORDER BY id ASC");
  return Response.json({ ok: true, data: result.rows });
}
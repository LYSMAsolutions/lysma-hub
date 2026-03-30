import { pool } from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(
      "SELECT * FROM request_lines ORDER BY id ASC"
    );

    return Response.json({
      ok: true,
      data: result.rows,
    });
  } catch (error: any) {
    return Response.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
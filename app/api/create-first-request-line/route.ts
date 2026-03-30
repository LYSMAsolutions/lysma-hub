import { pool } from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(
      `
      INSERT INTO request_lines (
        request_id,
        quantity,
        reference,
        designation
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [1, 2, "L12345", "Filtre à huile"]
    );

    return Response.json({
      ok: true,
      data: result.rows[0],
    });
  } catch (error: any) {
    return Response.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
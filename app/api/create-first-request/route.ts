import { pool } from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(
      `
      INSERT INTO requests (
        tenant_id,
        user_id,
        type,
        status,
        client_name,
        client_code,
        comment
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [1, 1, "ORDER", "DRAFT", "Garage Martin", "C001", "Premier bon de test"]
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
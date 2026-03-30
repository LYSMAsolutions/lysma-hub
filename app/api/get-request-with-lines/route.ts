import { pool } from "@/lib/db";

export async function GET() {
  try {
    const requestResult = await pool.query(
      "SELECT * FROM requests WHERE id = $1",
      [1]
    );

    const linesResult = await pool.query(
      "SELECT * FROM request_lines WHERE request_id = $1",
      [1]
    );

    const request = requestResult.rows[0];

    const response = {
      ...request,
      lines: linesResult.rows,
    };

    return Response.json({
      ok: true,
      data: response,
    });
  } catch (error: any) {
    return Response.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}
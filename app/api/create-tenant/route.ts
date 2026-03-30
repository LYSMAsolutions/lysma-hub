import { pool } from "@/lib/db";

export async function GET() {
  try {
    await pool.query(
      `INSERT INTO tenants (name, slug) VALUES ($1, $2)`,
      ["AAI", "aai"]
    );

    return Response.json({
      ok: true,
      message: "Tenant AAI créé",
    });
  } catch (error: any) {
    return Response.json(
      {
        ok: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
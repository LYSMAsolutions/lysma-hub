import { pool } from "@/lib/db";

export async function GET() {
  try {
    await pool.query(
      `
      INSERT INTO users (
        tenant_id,
        first_name,
        last_name,
        email,
        password_hash,
        role
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [1, "Mathieu", "Joseph", "admin@aai.local", "temp123", "TENANT_ADMIN"]
    );

    return Response.json({
      ok: true,
      message: "Utilisateur admin créé",
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
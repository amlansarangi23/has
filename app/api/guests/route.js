import pool from "@/lib/db";

// Create a guest
export async function POST(req) {
  try {
    const { name, contact, frequent_guest_id, loyalty_points } =
      await req.json();
    const [result] = await pool.query(
      "INSERT INTO guests (name, contact, frequent_guest_id, loyalty_points) VALUES (?, ?, ?, ?)",
      [name, contact, frequent_guest_id, loyalty_points]
    );
    return Response.json({
      message: "Guest created successfully",
      guestId: result.insertId,
    });
  } catch (error) {
    return Response.json(
      { message: "Error creating guest", error: error.message },
      { status: 500 }
    );
  }
}

// Update loyalty points for a frequent guest
export async function PUT(req) {
  try {
    const { frequent_guest_id, loyalty_points } = await req.json();
    await pool.query(
      "UPDATE guests SET loyalty_points = ? WHERE frequent_guest_id = ?",
      [loyalty_points, frequent_guest_id]
    );
    return Response.json({ message: "Loyalty points updated successfully" });
  } catch (error) {
    return Response.json(
      { message: "Error updating loyalty points", error: error.message },
      { status: 500 }
    );
  }
}

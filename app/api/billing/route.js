import pool from "@/lib/db";

// Get final bill details for a reservation
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token_number = searchParams.get("token_number"); // Retrieve token_number from query params

    if (!token_number) {
      return Response.json(
        { message: "Token number is required" },
        { status: 400 }
      );
    }

    // Fetch reservation details
    const [reservation] = await pool.query(
      "SELECT r.room_id, ro.base_rate FROM reservations r JOIN rooms ro ON r.room_id = ro.id WHERE r.token_number = ?",
      [token_number]
    );

    if (!reservation || reservation.length === 0) {
      throw new Error("Reservation not found for the provided token number");
    }

    const { base_rate } = reservation[0];

    // Fetch catering charges based on token number
    const [cateringItems] = await pool.query(
      "SELECT SUM(quantity * price) AS catering_charges FROM catering WHERE token_number = ?",
      [token_number]
    );

    const catering_charges = cateringItems[0].catering_charges || 0;

    // Ensure both base_rate and catering_charges are treated as numbers
    const total_amount = parseFloat(base_rate) + parseFloat(catering_charges);

    // Fetch billing details for the reservation
    const [billing] = await pool.query(
      "SELECT * FROM billing WHERE reservation_id IN (SELECT id FROM reservations WHERE token_number = ?)",
      [token_number]
    );

    return Response.json({
      message: "Billing details fetched successfully",
      billing: {
        total_amount: total_amount.toFixed(2), // Ensure total amount is shown as a fixed decimal value
        feedback: billing[0]?.feedback,
        isPaid: billing[0]?.isPaid,
      },
    });
  } catch (error) {
    return Response.json(
      { message: "Error fetching billing details", error: error.message },
      { status: 500 }
    );
  }
}

// Toggle isPaid status in the billing table
export async function PUT(req) {
  try {
    const { token_number, isPaid } = await req.json();

    // Check if token_number and isPaid are provided
    if (!token_number || isPaid === undefined) {
      return Response.json(
        { message: "Token number and isPaid status are required" },
        { status: 400 }
      );
    }

    // Update the billing table with the new isPaid status
    const [result] = await pool.query(
      "UPDATE billing SET isPaid = ? WHERE reservation_id IN (SELECT id FROM reservations WHERE token_number = ?)",
      [isPaid, token_number]
    );

    if (result.affectedRows > 0) {
      return Response.json({
        message: `Billing status updated to ${isPaid ? "Paid" : "Unpaid"}`,
      });
    } else {
      return Response.json({ message: "Billing entry not found" }, { status: 404 });
    }
  } catch (error) {
    return Response.json(
      { message: "Error updating billing status", error: error.message },
      { status: 500 }
    );
  }
}

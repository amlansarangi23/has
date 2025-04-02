import pool from "@/lib/db";

// Check-in (Create a reservation and corresponding billing entry)
export async function POST(req) {
  try {
    const { guest_id, room_id, check_in_date, token_number } = await req.json();

    // Fetch the base rate from the rooms table based on the room_id
    const [room] = await pool.query(
      "SELECT base_rate FROM rooms WHERE id = ?",
      [room_id]
    );

    if (!room || room.length === 0) {
      return Response.json({ message: "Room not found" }, { status: 404 });
    }

    const base_rate = room[0].base_rate;

    // Insert the reservation into the reservations table (without advance_paid)
    const [result] = await pool.query(
      "INSERT INTO reservations (guest_id, room_id, check_in_date, token_number) VALUES (?, ?, ?, ?)",
      [guest_id, room_id, check_in_date, token_number]
    );

    // Insert a new entry in the billing table with the base_rate as the total_amount initially
    await pool.query(
      "INSERT INTO billing (reservation_id, total_amount, feedback, isPaid) VALUES (?, ?, ?, ?)",
      [result.insertId, base_rate, null, false]
    );

    // Mark the room as occupied
    await pool.query("UPDATE rooms SET is_occupied = true WHERE id = ?", [
      room_id,
    ]);

    return Response.json({
      message: "Reservation created successfully",
      reservationId: result.insertId,
      baseRate: base_rate,
    });
  } catch (error) {
    return Response.json(
      { message: "Error creating reservation", error: error.message },
      { status: 500 }
    );
  }
}

// Check-out (Update check-out date)
export async function PUT(req) {
  try {
    const { token_number, check_out_date } = await req.json();

    // Fetch the room ID for the provided token number
    const [reservation] = await pool.query(
      "SELECT room_id FROM reservations WHERE token_number = ?",
      [token_number]
    );

    if (!reservation || reservation.length === 0) {
      return Response.json(
        { message: "Reservation not found" },
        { status: 404 }
      );
    }

    const room_id = reservation[0].room_id;

    // Update reservation with check-out date
    await pool.query(
      "UPDATE reservations SET check_out_date = ? WHERE token_number = ?",
      [check_out_date, token_number]
    );

    // Mark the room as available
    await pool.query("UPDATE rooms SET is_occupied = false WHERE id = ?", [
      room_id,
    ]);

    return Response.json({
      message: "Check-out successful",
    });
  } catch (error) {
    return Response.json(
      { message: "Error during check-out", error: error.message },
      { status: 500 }
    );
  }
}

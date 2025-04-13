import pool from "@/lib/db";

// Create a room
export async function POST(req) {
  try {
    const { room_type, is_ac, base_rate } = await req.json();

    console.log("Creating room with data:", { room_type, is_ac, base_rate });

    const [result] = await pool.query(
      "INSERT INTO rooms (room_type, is_ac, base_rate) VALUES (?, ?, ?)",
      [room_type, is_ac, base_rate]
    );

    // Check if the room was successfully inserted
    if (result && result.insertId) {
      console.log("Room created with ID:", result.insertId); // Log the generated ID
      return new Response(
        JSON.stringify({
          message: "Room created successfully",
          roomId: result.insertId,
        }),
        { status: 201 }
      );
    } else {
      console.error("Room insertion failed");
      return new Response(
        JSON.stringify({
          message: "Room creation failed, no ID returned",
        }),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating room:", error.message);
    return new Response(
      JSON.stringify({ message: "Error creating room", error: error.message }),
      { status: 500 }
    );
  }
}

// Fetch all rooms
export async function GET(req) {
  try {
    const [rooms] = await pool.query("SELECT * FROM rooms");

    return Response.json({
      message: "Rooms fetched successfully",
      rooms: rooms,
    });
  } catch (error) {
    return Response.json(
      { message: "Error fetching rooms", error: error.message },
      { status: 500 }
    );
  }
}

// Delete a room
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    // Ensure id is provided
    if (!id) {
      return new Response(JSON.stringify({ message: "Room ID is required" }), {
        status: 400,
      });
    }

    const [reservations] = await pool.query(
      "SELECT * FROM reservations WHERE room_id = ?",
      [id]
    );
    if (reservations.length > 0) {
      return new Response(
        JSON.stringify({
          message: "Cannot delete room. It has active reservations.",
        }),
        { status: 400 }
      );
    }

    const [result] = await pool.query("DELETE FROM rooms WHERE id = ?", [id]);

    if (result.affectedRows > 0) {
      return new Response(
        JSON.stringify({ message: "Room deleted successfully" }),
        { status: 200 }
      );
    } else {
      return new Response(JSON.stringify({ message: "Room not found" }), {
        status: 404,
      });
    }
  } catch (error) {
    console.error("Error deleting room:", error.message);
    return new Response(
      JSON.stringify({ message: "Error deleting room", error: error.message }),
      { status: 500 }
    );
  }
}

// Update room to toggle is_occupied status
export async function PUT(req) {
  try {
    const { id, is_occupied } = await req.json();

    if (!id || is_occupied === undefined) {
      return new Response(
        JSON.stringify({
          message: "Room ID and occupancy status are required",
        }),
        { status: 400 }
      );
    }

    const [result] = await pool.query(
      "UPDATE rooms SET is_occupied = ? WHERE id = ?",
      [is_occupied, id]
    );

    if (result.affectedRows > 0) {
      return new Response(
        JSON.stringify({
          message: "Room occupancy status updated successfully",
        }),
        { status: 200 }
      );
    } else {
      return new Response(JSON.stringify({ message: "Room not found" }), {
        status: 404,
      });
    }
  } catch (error) {
    console.error("Error updating room occupancy:", error.message);
    return new Response(
      JSON.stringify({
        message: "Error updating room occupancy",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

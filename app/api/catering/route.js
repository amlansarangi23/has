import pool from "@/lib/db";

// Add catering entry and update billing
export async function POST(req) {
  try {
    const { token_number, items } = await req.json();
    let total_amount = 0;

    // Insert catering items and calculate total catering charges
    for (let item of items) {
      const { item_name, quantity, price } = item;
      total_amount += quantity * price;

      // Insert each catering item into the database
      await pool.query(
        "INSERT INTO catering (token_number, item_name, quantity, price) VALUES (?, ?, ?, ?)",
        [token_number, item_name, quantity, price]
      );
    }

    // Ensure total_amount is treated as a number (convert to float)
    total_amount = parseFloat(total_amount);

    // Update billing with total catering charges (ensure that total_amount is added correctly)
    await pool.query(
      "UPDATE billing SET total_amount = total_amount + ? WHERE reservation_id IN (SELECT id FROM reservations WHERE token_number = ?)",
      [total_amount, token_number]
    );

    return Response.json({ message: "Catering added and billing updated" });
  } catch (error) {
    return Response.json(
      { message: "Error adding catering", error: error.message },
      { status: 500 }
    );
  }
}

import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    return NextResponse.json({ message: "Connected!", result: rows[0].result });
  } catch (error) {
    return NextResponse.json(
      { message: "Database connection failed", error: error.message },
      { status: 500 }
    );
  }
}

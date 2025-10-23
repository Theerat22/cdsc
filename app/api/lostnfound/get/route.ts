import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

export interface Thing {
  name: string;
  description: string;
  found_place: string;
  image_url: string;
}

export async function GET() {
  try {
    const sql = `
      SELECT * FROM lost_and_found
    `;

    const [rows] = await mysqlPool.query(sql);
    return NextResponse.json(rows as Thing[]);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sports data" },
      { status: 500 }
    );
  }
}

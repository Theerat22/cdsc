import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

export interface PortfolioData {
  name: string;
  nickname: string;
  cd: number;
  faculty: string;
  university: string;
  link: string;
  image: string;
}

export async function GET() {
  try {
    const sql = `
      SELECT * FROM portfolio
    `;

    const [rows] = await mysqlPool.query(sql);
    return NextResponse.json(rows as PortfolioData[]);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sports data" },
      { status: 500 }
    );
  }
}
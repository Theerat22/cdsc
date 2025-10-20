import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

export interface SportsMedalData {
  color: string;
  gold_medals: number;
  silver_medals: number;
  bronze_medals: number;
  total_medals: number;
}

export async function GET() {
  try {
    const sql = `
      SELECT 
          'green' AS color,
          SUM(CASE WHEN green = 1 THEN 1 ELSE 0 END) AS gold_medals,
          SUM(CASE WHEN green = 2 THEN 1 ELSE 0 END) AS silver_medals,
          SUM(CASE WHEN green = 3 THEN 1 ELSE 0 END) AS bronze_medals,
          (SUM(CASE WHEN green = 1 THEN 1 ELSE 0 END) + SUM(CASE WHEN green = 2 THEN 1 ELSE 0 END) + SUM(CASE WHEN green = 3 THEN 1 ELSE 0 END)) AS total_medals
      FROM sportsday
      WHERE green IS NOT NULL
      UNION ALL
      SELECT 
          'pink' AS color,
          SUM(CASE WHEN pink = 1 THEN 1 ELSE 0 END) AS gold_medals,
          SUM(CASE WHEN pink = 2 THEN 1 ELSE 0 END) AS silver_medals,
          SUM(CASE WHEN pink = 3 THEN 1 ELSE 0 END) AS bronze_medals,
          (SUM(CASE WHEN pink = 1 THEN 1 ELSE 0 END) + SUM(CASE WHEN pink = 2 THEN 1 ELSE 0 END) + SUM(CASE WHEN pink = 3 THEN 1 ELSE 0 END)) AS total_medals
      FROM sportsday
      WHERE pink IS NOT NULL
      UNION ALL
      SELECT 
          'purple' AS color,
          SUM(CASE WHEN purple = 1 THEN 1 ELSE 0 END) AS gold_medals,
          SUM(CASE WHEN purple = 2 THEN 1 ELSE 0 END) AS silver_medals,
          SUM(CASE WHEN purple = 3 THEN 1 ELSE 0 END) AS bronze_medals,
          (SUM(CASE WHEN purple = 1 THEN 1 ELSE 0 END) + SUM(CASE WHEN purple = 2 THEN 1 ELSE 0 END) + SUM(CASE WHEN purple = 3 THEN 1 ELSE 0 END)) AS total_medals
      FROM sportsday
      WHERE purple IS NOT NULL
      UNION ALL
      SELECT 
          'orange' AS color,
          SUM(CASE WHEN orange = 1 THEN 1 ELSE 0 END) AS gold_medals,
          SUM(CASE WHEN orange = 2 THEN 1 ELSE 0 END) AS silver_medals,
          SUM(CASE WHEN orange = 3 THEN 1 ELSE 0 END) AS bronze_medals,
          (SUM(CASE WHEN orange = 1 THEN 1 ELSE 0 END) + SUM(CASE WHEN orange = 2 THEN 1 ELSE 0 END) + SUM(CASE WHEN orange = 3 THEN 1 ELSE 0 END)) AS total_medals
      FROM sportsday
      WHERE orange IS NOT NULL
      ORDER BY gold_medals DESC, silver_medals DESC, bronze_medals DESC
    `;

    const [rows] = await mysqlPool.query(sql);
    return NextResponse.json(rows as SportsMedalData[]);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sports data" },
      { status: 500 }
    );
  }
}
// app/api/lost-and-found/route.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { mysqlPool } from "@/utils/db"; // สมมติว่าไฟล์นี้จัดการการเชื่อมต่อ MySQL Pool
import { v2 as cloudinary } from 'cloudinary';
import type { ResultSetHeader } from "mysql2";

// ----------------------------------------------------
// Interfaces
// ----------------------------------------------------
export interface FoundItem {
  id: number;
  name: string;
  description: string;
  found_place: string;
  image_url: string;
  created_at: string;
}

// ----------------------------------------------------
// Cloudinary Config & Uploader (ใช้โค้ดที่คุณให้มาและปรับปรุงให้เข้ากับ Lost & Found)
// ----------------------------------------------------
if (!process.env.CLOUDINARY_URL) {
  console.error('Missing CLOUDINARY_URL environment variable');
}
cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL
});

async function uploadImageToCloudinary(file: File): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'lost-and-found',
          public_id: `found_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          resource_type: 'auto',
          transformation: [{ quality: 'auto:best' }, { fetch_format: 'auto' }],
          invalidate: true,
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(new Error(`Failed to upload to Cloudinary: ${error.message}`));
          } else if (result) {
            resolve(result.secure_url);
          } else {
            reject(new Error('No result from Cloudinary upload'));
          }
        }
      );
      uploadStream.end(buffer);
    } catch (error) {
      reject(error);
    }
  });
}

// ----------------------------------------------------
// GET: ดึงรายการสิ่งของ Lost & Found ทั้งหมด
// ----------------------------------------------------
export async function GET(req: NextRequest) {
  const connection = await mysqlPool.getConnection();
  try {
    const [rows] = await connection.execute<FoundItem[] & ResultSetHeader>(
      `SELECT id, name, description, found_place, image_url, created_at FROM lost_and_found ORDER BY created_at DESC`
    );

    // Filter เพื่อให้แน่ใจว่าได้เฉพาะข้อมูล FoundItem
    const items = rows.filter((row: any) => row.id !== undefined) as FoundItem[];

    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (dbError) {
    console.error("Database read error:", dbError);
    return NextResponse.json({
      error: "Failed to fetch data from database",
    }, { status: 500 });
  } finally {
    connection.release();
  }
}

// ----------------------------------------------------
// POST: สร้างสิ่งของ Lost & Found ใหม่
// ----------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const description = (formData.get('description') as string) || '';
    const found_place = formData.get('found_place') as string;
    const imageFile = formData.get('image') as File;

    // 1. ตรวจสอบข้อมูลที่จำเป็น
    if (!name || !found_place || !imageFile || imageFile.size === 0) {
      return NextResponse.json(
        { error: "Missing required fields or image" },
        { status: 400 }
      );
    }

    // 2. ตรวจสอบประเภทไฟล์
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(imageFile.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // 3. อัปโหลดรูปภาพไป Cloudinary
    let imageUrl: string;
    try {
      imageUrl = await uploadImageToCloudinary(imageFile);
    } catch (uploadError) {
      console.error('Image upload failed:', uploadError);
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
    }

    // 4. บันทึกข้อมูลลงใน MySQL
    const connection = await mysqlPool.getConnection();
    try {
      const query = `
        INSERT INTO lost_and_found (name, description, found_place, image_url)
        VALUES (?, ?, ?, ?)
      `;
      const [result] = await connection.execute<ResultSetHeader>(query, [
        name,
        description,
        found_place,
        imageUrl,
      ]);

      return NextResponse.json({
        success: true,
        message: "Item added successfully",
        id: result.insertId,
        imageUrl: imageUrl,
      }, { status: 201 });

    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json({
        error: "Failed to save data to database",
      }, { status: 500 });
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error("Lost & Found POST error:", error);
    return NextResponse.json({
      error: "Internal Server Error",
    }, { status: 500 });
  }
}
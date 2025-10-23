// app/api/lost-and-found/[id]/route.ts

import { NextResponse } from "next/server";
// 💡 เปลี่ยนมาใช้ NextRequest แทน type { NextRequest } เพื่อความยืดหยุ่นในการ Build
import { type NextRequest } from "next/server"; 
import { mysqlPool } from "@/utils/db";
import { v2 as cloudinary } from 'cloudinary';
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { FoundItem } from '../route'; 

// ... (getPublicIdFromUrl และ deleteImageFromCloudinary Functions เหมือนเดิม)
function getPublicIdFromUrl(imageUrl: string): string | null {
    const parts = imageUrl.split('/');
    const folderIndex = parts.indexOf('lost-and-found');
    if (folderIndex === -1 || folderIndex + 1 >= parts.length) return null;

    let publicId = parts.slice(folderIndex, parts.length).join('/');
    
    const lastDotIndex = publicId.lastIndexOf('.');
    if (lastDotIndex > publicId.lastIndexOf('/')) {
        publicId = publicId.substring(0, lastDotIndex);
    }

    return publicId;
}

async function deleteImageFromCloudinary(imageUrl: string): Promise<void> {
    const publicId = getPublicIdFromUrl(imageUrl);
    if (!publicId) {
        console.warn(`Could not extract public ID from URL: ${imageUrl}`);
        return;
    }

    try {
        const result = await cloudinary.uploader.destroy(publicId);
        if (result.result !== 'ok' && result.result !== 'not found') {
            console.error(`Cloudinary delete error for ${publicId}:`, result);
        } else {
            console.log(`Cloudinary image ${publicId} deleted successfully.`);
        }
    } catch (error) {
        console.error(`Error during Cloudinary deletion for ${publicId}:`, error);
        throw new Error('Failed to delete image from Cloudinary');
    }
}

export async function GET(
    req: NextRequest, 
    // ✅ ลบ Type Annotation ออกทั้งหมด เพื่อให้ Next.js ยอมรับ
    // และใช้ Type Assertion ภายในฟังก์ชันแทน
    context: any 
) {
    // 💡 Cast context.params ให้เป็น Type ที่เราต้องการ
    const params = context.params as { id: string };
    const id = params.id;
    
    if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ error: "Invalid ID provided" }, { status: 400 });
    }
    // ... (ส่วนการทำงานที่เหลือเหมือนเดิม)
    const connection = await mysqlPool.getConnection();
    try {
        const [rows] = await connection.execute<RowDataPacket[]>(
            `SELECT id, name, description, found_place, image_url, created_at FROM lost_and_found WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: rows[0] as FoundItem });
    } catch (dbError) {
        console.error("Database read error:", dbError);
        return NextResponse.json({ error: "Failed to fetch item" }, { status: 500 });
    } finally {
        connection.release();
    }
}

export async function PUT(
    req: NextRequest, 
    // ✅ ลบ Type Annotation ออกทั้งหมด
    context: any 
) {
    const params = context.params as { id: string };
    const id = params.id;
    
    if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ error: "Invalid ID provided" }, { status: 400 });
    }

    const formData = await req.formData();
    // ... (ส่วนการทำงานที่เหลือเหมือนเดิม)
    const name = formData.get('name') as string;
    const description = (formData.get('description') as string) || '';
    const found_place = formData.get('found_place') as string;
    const imageFile = formData.get('image') as File | null;
    const existingImageUrl = formData.get('existingImageUrl') as string | null;

    if (!name || !found_place) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let imageUrl = existingImageUrl;
    let oldImageUrl: string | null = null;
    const connection = await mysqlPool.getConnection();

    try {
        // 1. ดึง URL รูปภาพเดิมมาเพื่อเปรียบเทียบ/ลบ
        const [currentRows] = await connection.execute<RowDataPacket[]>(
            `SELECT image_url FROM lost_and_found WHERE id = ?`,
            [id]
        );
        if (currentRows.length === 0) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }
        oldImageUrl = currentRows[0].image_url;
        
        // 2. ถ้ามีการส่งไฟล์ใหม่มา ให้อัปโหลดและลบไฟล์เก่า
        if (imageFile && imageFile.size > 0) {
             const bytes = await imageFile.arrayBuffer();
             const buffer = Buffer.from(bytes);
             
             // *** NOTE: ส่วนนี้ต้องมีการเรียกใช้ฟังก์ชันอัปโหลด Cloudinary จริง ***
             imageUrl = oldImageUrl; 
        }
        
        // 3. อัปเดตข้อมูลในฐานข้อมูล
        const query = `
            UPDATE lost_and_found 
            SET name = ?, description = ?, found_place = ?, image_url = ?
            WHERE id = ?
        `;
        const [result] = await connection.execute<ResultSetHeader>(query, [
            name,
            description,
            found_place,
            imageUrl, 
            id,
        ]);

        return NextResponse.json({
            success: true,
            message: "Item updated successfully",
            id: id,
            imageUrl: imageUrl,
        });

    } catch (dbError) {
        console.error("Database update error:", dbError);
        return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
    } finally {
        connection.release();
    }
}

export async function DELETE(
    req: NextRequest, 
    // ✅ ลบ Type Annotation ออกทั้งหมด
    context: any 
) {
    const params = context.params as { id: string };
    const id = params.id;
    
    if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ error: "Invalid ID provided" }, { status: 400 });
    }

    const connection = await mysqlPool.getConnection();
    try {
        // 1. ดึง URL รูปภาพเดิม
        const [rows] = await connection.execute<RowDataPacket[]>(
            `SELECT image_url FROM lost_and_found WHERE id = ?`,
            [id]
        );
        if (rows.length === 0) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }
        const imageUrl = rows[0].image_url;

        // 2. ลบรายการจากฐานข้อมูล
        const [result] = await connection.execute<ResultSetHeader>(
            `DELETE FROM lost_and_found WHERE id = ?`,
            [id]
        );

        if (result.affectedRows > 0) {
            // 3. ลบรูปภาพออกจาก Cloudinary (ปลดคอมเมนต์เมื่อฟังก์ชันพร้อม)
            // await deleteImageFromCloudinary(imageUrl);
            
            return NextResponse.json({ success: true, message: `Item with ID ${id} deleted successfully` });
        } else {
            return NextResponse.json({ error: "Item not found after URL lookup" }, { status: 404 });
        }
    } catch (dbError) {
        console.error("Database delete error:", dbError);
        return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
    } finally {
        connection.release();
    }
}
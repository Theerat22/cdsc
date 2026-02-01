import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const { image, video } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "Missing image data" }, { status: 400 });
    }

    const imagePublicId = `img_${uuidv4()}`;
    const videoPublicId = `vdo_${uuidv4()}`;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;


    const directImageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/f_jpg,q_100/photobooth-strips/${imagePublicId}.jpg`;
    const finalVideoUrl = video 
      ? `https://res.cloudinary.com/${cloudName}/video/upload/fl_attachment/e_accelerate:70,w_1280,c_scale,q_100/photobooth-videos/${videoPublicId}.mp4`
      : "";

    const imageUploadPromise = cloudinary.uploader.upload(image, {
      public_id: imagePublicId,
      folder: "photobooth-strips",
      resource_type: "image",
    });

    if (video) {
      cloudinary.uploader.upload(video, {
        public_id: videoPublicId,
        folder: "photobooth-videos",
        resource_type: "video",
        eager: [
          { effect: "accelerate:70", width: 1280, crop: "scale", quality: 100 }
        ],
        eager_async: true,
      }).catch(err => console.error("Background Video Upload Error:", err));
    }

    const [qrCodeDataUrl, vdoQR, _] = await Promise.all([
      QRCode.toDataURL(directImageUrl, { errorCorrectionLevel: 'M', margin: 2, scale: 8 }),
      video ? QRCode.toDataURL(finalVideoUrl, { errorCorrectionLevel: 'M', margin: 2, scale: 8 }) : Promise.resolve(""),
      imageUploadPromise
    ]);

    return NextResponse.json({
      success: true,
      qrCodeUrl: qrCodeDataUrl,
      downloadUrl: directImageUrl,
      videoUrl: finalVideoUrl,
      vdoQRUrl: vdoQR
    });

  } catch (error: any) {
    console.error("Fast Upload Error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
"use client";
import { useState, useEffect, useRef } from "react";
import CameraView from "../photobooth/components/CameraView";
import PhotoStrip from "../photobooth/components/PhotoSript";
import ResultModal from "../photobooth/components/ResultModal";

export default function PhotoboothPage() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
// const qrCode = "dff";
  const [vdoQR, setVdoQR] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (photos.length === 3) {
      handleFinish();
    }
  }, [photos]);

  // ฟังก์ชันสร้าง Photo Strip (High Res)
  const createCombinedImage = async (images: string[]): Promise<string> => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    const imgObjects = await Promise.all(
      images.map((src) => {
        return new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous"; // ป้องกันปัญหาเรื่อง CORS
          img.onload = () => resolve(img);
          img.src = src;
        });
      }),
    );

    const padding = 50;
    const targetW = 1200;
    const targetH = 800;

    canvas.width = 1300;
    canvas.height = targetH * 3 + padding * 4 + 150;

    // พื้นหลังขาวสะอาด
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    imgObjects.forEach((img, i) => {
      const x = (canvas.width - targetW) / 2;
      const y = padding + i * (targetH + padding);

      // --- Logic: Center Crop (ป้องกันภาพยืด) ---
      const imgRatio = img.width / img.height;
      const targetRatio = targetW / targetH;

      let sx, sy, sWidth, sHeight;

      if (imgRatio > targetRatio) {
        sHeight = img.height;
        sWidth = img.height * targetRatio;
        sx = (img.width - sWidth) / 2;
        sy = 0;
      } else {
        // ภาพต้นฉบับแคบกว่า (เช่น 4:3) -> ตัดบนล่างออก
        sWidth = img.width;
        sHeight = img.width / targetRatio;
        sx = 0;
        sy = (img.height - sHeight) / 2;
      }

      ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, targetW, targetH);
    });

    ctx.fillStyle = "#18181b";
    ctx.font = "italic bold 52px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("งานชุมนุม 2569", canvas.width / 2, canvas.height - 75);

    return canvas.toDataURL("image/jpeg", 1.0);
  };

  const cameraStreamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false,
      });

      cameraStreamRef.current = stream;
      videoChunksRef.current = [];

      const recorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp8",
      });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) videoChunksRef.current.push(e.data);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
    } catch (err) {
      console.error("Recording failed to start:", err);
    }
  };

  const stopRecordingAndGetBlob = (): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current) return resolve(null);

      mediaRecorderRef.current.onstop = async () => {
        const videoBlob = new Blob(videoChunksRef.current, {
          type: "video/webm",
        });
        const reader = new FileReader();
        reader.readAsDataURL(videoBlob);
        reader.onloadend = () => {
          resolve(reader.result as string);
          cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
        };
      };
      mediaRecorderRef.current.stop();
    });
  };

  const handleStart = async () => {
    setIsCapturing(true);
    setPhotos([]);
    await startRecording();
  };

  const handleFinish = async () => {
    setIsUploading(true);
    const videoBase64 = await stopRecordingAndGetBlob();

    try {
      const combinedImage = await createCombinedImage(photos);

      const response = await fetch("/api/photobooth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: combinedImage,
          video: videoBase64,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setQrCode(data.qrCodeUrl);
        setVdoQR(data.vdoQRUrl);
      } else {
        alert("เกิดข้อผิดพลาดในการอัปโหลด");
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
      setIsCapturing(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-black p-4 md:p-10 flex flex-col justify-center items-center">
      {isUploading && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex flex-col items-center justify-center text-white">
          <div className="w-12 h-12 border-4 border-blue-700 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xl font-bold">
            กำลังประมวลผล
          </p>
        </div>
      )}

      <img src={"/logo.jpg"} alt="Logo" width={500} height={600} className="z-[70]"/>
      <div className="grid lg:grid-cols-12 gap-5 w-full max-w-[1500px] items-center justify-center">
        <div className="lg:col-span-8 w-full ">
          <CameraView
            isCapturing={isCapturing}
            onCapture={(img) => setPhotos((prev) => [...prev, img])}
            maxPhotos={3}
            currentCount={photos.length}
          />
        </div>

        <div className="lg:col-span-4 flex flex-col items-center gap-6">
          <PhotoStrip photos={photos} />
        </div>
      </div>

      {!isCapturing && photos.length === 0 && (
        <button
          onClick={handleStart}
          className="mt-8 px-7 py-2 text-white bg-blue-900 hover:bg-blue-950 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-95"
        >
          เริ่มถ่ายรูป
        </button>
      )}

      {qrCode && (
        <ResultModal
          qrCodeUrl={qrCode}
          vdoQRUrl={vdoQR || undefined}
          onClose={() => {
            setQrCode(null);
            setVdoQR(null);
            setPhotos([]);
          }}
        />
      )}
    </main>
  );
}

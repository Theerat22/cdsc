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
  const imgRef = useRef<HTMLImageElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);


//   useEffect(() => {
//     if (photos.length === 3) {
//       handleFinish();
//     }
//   }, [photos]);

  const createCombinedImage = async (
    images: string[],
    bgSrc: string,
  ): Promise<string> => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    canvas.width = 1300;
    canvas.height = 2750;

    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    };

    try {
      const [bgImg, ...imgObjects] = await Promise.all([
        loadImage(bgSrc),
        ...images.map(loadImage),
      ]);

      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      const targetW = 1195;
      const targetH = 690;
      const marginTop = 280;
      const spacing = 60;
      const borderSize = 0;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      imgObjects.forEach((img, i) => {
        const x = (canvas.width - targetW) / 2;
        const y = marginTop + i * (targetH + spacing);

        ctx.save();
        // ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
        // ctx.shadowBlur = 25;
        // ctx.shadowOffsetY = 12;
        
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(x, y, targetW, targetH);
        ctx.restore();

        // --- Center Crop Logic ---
        // คำนวณ Ratio โดยหักพื้นที่กรอบออกเพื่อให้รูปอยู่ข้างในพอดี
        const drawW = targetW - borderSize * 2;
        const drawH = targetH - borderSize * 2;
        
        const imgRatio = img.width / img.height;
        const targetRatio = drawW / drawH;
        let sx, sy, sWidth, sHeight;

        if (imgRatio > targetRatio) {
          sHeight = img.height;
          sWidth = img.height * targetRatio;
          sx = (img.width - sWidth) / 2;
          sy = 0;
        } else {
          sWidth = img.width;
          sHeight = img.width / targetRatio;
          sx = 0;
          sy = (img.height - sHeight) / 2;
        }

        // วาดรูปลงไปบนกรอบ (ขยับตำแหน่งตาม borderSize)
        ctx.drawImage(
          img,
          sx, sy, sWidth, sHeight,
          x + borderSize,
          y + borderSize,
          drawW,
          drawH
        );
      });

      return canvas.toDataURL("image/jpeg", 0.95);
    } catch (error) {
      console.error("Error loading images:", error);
      return "";
    }
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

  const handleGenerateImage = async () => {
    const imagesToCombine = [
      "/test.jpg",
      "/test.jpg",
      "/test.jpg",
    ];
    const backgroundTemplate = "/photobooth/cd-black.jpg";

    setIsGenerating(true); // เปิด Loading (ถ้ามี state นี้)

    try {
        const resultDataUrl = await createCombinedImage(
          imagesToCombine,
          backgroundTemplate,
        );

        if (imgRef.current) {
            imgRef.current.src = resultDataUrl;
        } else {
            console.error("หา Element img ไม่เจอผ่าน ref");
        }
    } catch (error) {
        console.error("สร้างรูปภาพไม่สำเร็จ:", error);
    } finally {
        setIsGenerating(false); // ปิด Loading
    }
};

//   const handleFinish = async () => {
//     setIsUploading(true);
//     const videoBase64 = await stopRecordingAndGetBlob();

//     try {
//       const combinedImage = await createCombinedImage(photos, "/chitralada.jpg");

//       const response = await fetch("/api/photobooth", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           image: combinedImage,
//           video: videoBase64,
//         }),
//       });

//       const data = await response.json();
//       if (data.success) {
//         setQrCode(data.qrCodeUrl);
//         setVdoQR(data.vdoQRUrl);
//       } else {
//         alert("เกิดข้อผิดพลาดในการอัปโหลด");
//       }
//     } catch (error) {
//       console.error("Upload failed:", error);
//     } finally {
//       setIsUploading(false);
//       setIsCapturing(false);
//     }
//   };

  return (
    // <main className="min-h-screen bg-white text-black p-4 md:p-10 flex flex-col justify-center items-center">
    //   {isUploading && (
    //     <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex flex-col items-center justify-center text-white">
    //       <div className="w-12 h-12 border-4 border-blue-700 border-t-transparent rounded-full animate-spin mb-4"></div>
    //       <p className="text-xl font-bold">
    //         กำลังประมวลผล
    //       </p>
    //     </div>
    //   )}

    //   <img src={"/logo.jpg"} alt="Logo" width={500} height={600} className="z-[70]"/>
    //   <div className="grid lg:grid-cols-12 gap-5 w-full max-w-[1500px] items-center justify-center">
    //     <div className="lg:col-span-8 w-full ">
    //       <CameraView
    //         isCapturing={isCapturing}
    //         onCapture={(img) => setPhotos((prev) => [...prev, img])}
    //         maxPhotos={3}
    //         currentCount={photos.length}
    //       />
    //     </div>

    //     <div className="lg:col-span-4 flex flex-col items-center gap-6">
    //       <PhotoStrip photos={photos} />
    //     </div>
    //   </div>

    //   {!isCapturing && photos.length === 0 && (
    //     <button
    //       onClick={handleStart}
    //       className="mt-8 px-7 py-2 text-white bg-blue-900 hover:bg-blue-950 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-95"
    //     >
    //       เริ่มถ่ายรูป
    //     </button>
    //   )}

    //   {qrCode && (
    //     <ResultModal
    //       qrCodeUrl={qrCode}
    //       vdoQRUrl={vdoQR || undefined}
    //       onClose={() => {
    //         setQrCode(null);
    //         setVdoQR(null);
    //         setPhotos([]);
    //       }}
    //     />
    //   )}
    // </main>

    <div>
      <button onClick={handleGenerateImage} disabled={isGenerating}>
        {isGenerating ? "กำลังสร้างรูป..." : "สร้างรูปภาพ"}
      </button>

      <div className="mt-4">
        <img
          ref={imgRef}
          alt="Combined Result"
          style={{ width: "100%", maxWidth: "400px", height: "auto" }}
        />
      </div>
    </div>
  );
}


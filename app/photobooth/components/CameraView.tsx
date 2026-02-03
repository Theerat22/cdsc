"use client";
import Webcam from "react-webcam";
import { useRef, useState, useEffect } from "react";

interface Props {
  isCapturing: boolean;
  onCapture: (img: string) => void;
  maxPhotos: number;
  currentCount: number;
}

export default function CameraView({ isCapturing, onCapture, maxPhotos, currentCount }: Props) {
  const webcamRef = useRef<Webcam>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  // --- ส่วนที่เพิ่ม: โหลดเสียงแยกตามหมายเลข ---
  const audioNumbers = useRef<Record<number, HTMLAudioElement>>({});
  const shutterSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // โหลดเสียง 1, 2, 3 เตรียมไว้
    [1, 2, 3].forEach((num) => {
      audioNumbers.current[num] = new Audio(`/sounds/${num}.mp3`);
    });
    shutterSound.current = new Audio("/sounds/shutter.mp3");
  }, []);

  const playNumberSound = (num: number) => {
    const sound = audioNumbers.current[num];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch((e) => console.log("Audio play blocked", e));
    }
  };

  const playShutter = () => {
    if (shutterSound.current) {
      shutterSound.current.currentTime = 0;
      shutterSound.current.play().catch((e) => console.log("Audio play blocked", e));
    }
  };

  useEffect(() => {
    if (isCapturing && currentCount < maxPhotos && !isWaiting && countdown === null) {
      runSequence();
    }
  }, [isCapturing, currentCount]);

  const runSequence = async () => {
    if (currentCount > 0) {
      setIsWaiting(true);
      await new Promise((resolve) => setTimeout(resolve, 2500));
      setIsWaiting(false);
    }

    let timer = 5;
    setCountdown(timer);
    playNumberSound(timer); // เล่นเสียงเลข 3 ทันทีที่เริ่ม

    const interval = setInterval(() => {
      timer--;
      if (timer <= 0) {
        clearInterval(interval);
        setCountdown(null);
        executeCapture();
      } else {
        setCountdown(timer);
        playNumberSound(timer); // เล่นเสียงตามเลขที่เปลี่ยนไป (2 และ 1)
      }
    }, 1000);
  };

  const executeCapture = () => {
    setShowFlash(true);
    playShutter(); // เสียงแชะ!
    
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
    }

    setTimeout(() => setShowFlash(false), 150);
  };

  return (
    <div className="relative aspect-video flex items-center justify-center bg-black overflow-hidden rounded-2xl">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: "user" }}
        className="w-full h-full object-cover scale-x-[-1]"
      />

      {/* UI ส่วนแสดงผลเหมือนเดิม */}
      {showFlash && (
        <div className="absolute inset-0 bg-white animate-out fade-out duration-300 z-50" />
      )}

      {countdown !== null && (
        <div className="absolute inset-0 flex items-center justify-center z-40">
          <span className="text-[12rem] font-black text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] animate-in zoom-in duration-200">
            {countdown}
          </span>
        </div>
      )}

      {isWaiting && (
        <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-md z-30 animate-in fade-in">
          <div className="bg-white text-blue-600 px-6 py-2 rounded-full font-bold text-xl mb-4 shadow-xl">
            เตรียมตัว
          </div>
          <p className="text-white text-2xl font-black italic uppercase tracking-widest animate-pulse">
            ถ่ายรูปที่ {currentCount + 1}
          </p>
        </div>
      )}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <div className="bg-black/50 backdrop-blur-md border border-white/20 px-4 py-1 rounded-full text-sm font-medium text-white">
         ถ่ายไปแล้ว {currentCount} / {maxPhotos} 
        </div>
      </div>
    </div>
  );
}
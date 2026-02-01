"use client";

import { useEffect } from "react";

interface ResultModalProps {
  qrCodeUrl: string;
  downloadUrl?: string;
  vdoQRUrl?: string;
  onClose: () => void;
}

export default function ResultModal({
  qrCodeUrl,
  downloadUrl,
  vdoQRUrl,
  onClose,
}: ResultModalProps) {
  // ป้องกันการ Scroll หน้าจอหลักเมื่อเปิด Modal
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={onClose} // คลิกพื้นที่ว่างเพื่อปิด
    >
      <div
        className="bg-white p-8 rounded-[2.5rem] max-w-lg max-h-lg text-center flex flex-col items-center shadow-2xl animate-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()} // ป้องกันการปิดเมื่อคลิกตัว Modal เอง
      >


        <h2 className="text-2xl font-black text-zinc-900 mb-1">
          ถ่ายรูปสำเร็จ
        </h2>
        <p className="text-zinc-500 text-sm mb-6">
          สแกน QR Code ด้านล่างเพื่อโหลดรูปเข้ามือถือ
        </p>

        {/* ส่วนแสดง QR Code */}
        <div className="flex flex-cols-2 gap-3">
          <div>
            <h1 className="font-bold">รูปภาพ</h1>
            <img
              src={qrCodeUrl}
              alt="Scan to download"
              className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
            />
          </div>

          <div>
            <h1 className="font-bold">วิดีโอ</h1>
            <img
              src={vdoQRUrl}
              alt="Scan to download"
              className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
            />
          </div>
        </div>

        {/* Link สำหรับกดดูรูปโดยตรง (กรณีถ่ายด้วยเครื่องตัวเอง) */}
        <div className="w-full grid grid-cols-1 gap-3 mt-8">
          <button
            onClick={onClose}
            className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold text-lg transition-all hover:bg-zinc-800 active:scale-95 shadow-lg"
          >
            ถ่ายใหม่
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 text-zinc-400 font-medium text-sm hover:text-zinc-600 transition-colors"
          >
            ปิดหน้าต่างนี้
          </button>
        </div>
      </div>
    </div>
  );
}

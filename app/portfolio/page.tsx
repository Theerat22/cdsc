"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// 1. ปรับ Interface ให้ยืดหยุ่น (ใช้ ? เพื่อกัน Error กรณีข้อมูลจาก API มาไม่ครบ)
interface PortfolioData {
  name?: string;
  nickname?: string | number;
  cd?: number | string;
  faculty?: string;
  university?: string;
  link?: string;
  image?: string;
}

export default function Portfolio() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/portfolio");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // ตรวจสอบว่า data เป็น Array หรือไม่ก่อน set state
        if (Array.isArray(data)) {
          setPortfolioData(data);
        } else {
          throw new Error("Data format is not an array");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-gray-500 font-medium">กำลังโหลดพอร์ตโฟลิโอ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">เกิดข้อผิดพลาด</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-blue-600 mb-4">
            พอร์ตพี่มีให้ดู
          </h1>
          <div className="h-1 w-20 bg-yellow-400 mx-auto rounded-full"></div>
        </div>

        {/* Grid System */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioData.map((item, index) => (
            <div
              key={index}
              className="group flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Image Container - ครอบด้วย Link แค่ส่วนเดียวเพื่อกัน Error */}
              <Link href={item.link || "#"} target="_blank" className="relative w-full h-56 block overflow-hidden">
                <Image
                  src={item.image || ""}
                  alt={item.name || ""}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              </Link>

              {/* Content Section */}
              <div className="flex flex-col p-6 flex-grow">
                <h4 className="text-xl font-bold text-gray-800 mb-3 truncate">
                  {item.name} 
                  {item.nickname && (
                    <span className="text-blue-500 font-medium text-lg ml-2">
                      (พี่{item.nickname})
                    </span>
                  )}
                </h4>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-1 h-6 bg-blue-400 rounded-full" />
                    <p className="text-gray-600 leading-snug">
                      <span className="font-bold text-gray-900">คณะ/มหาลัย:</span><br />
                      {item.faculty} <span className="font-bold">{item.university}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Section */}
              <div className="p-6 pt-0 mt-auto">
                <Link
                  href={item.link || "#"}
                  target="_blank"
                  className="flex items-center justify-center w-full py-3 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-colors duration-200"
                >
                  ดูพอร์ต
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {portfolioData.length === 0 && !loading && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">ยังไม่มีข้อมูลพอร์ตโฟลิโอในขณะนี้</p>
          </div>
        )}
      </div>
    </div>
  );
}
"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
interface Thing {
  name: string;
  description: string;
  found_place: string;
  image_url: string;
}
export default function LostAndFound() {
  const [things, setThings] = useState<Thing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/lostnfound/get");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setThings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-500 text-xl font-semibold mb-2">
            เกิดข้อผิดพลาด
          </div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-12 border-b border-gray-200 pb-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-2 text-blue-600 mt-2">
            Lost & Found
          </h1>
          <p>
            สามารถติดต่อรับได้ที่{" "}
            <span className="font-bold text-blue-600">ห้อง 1013</span>
          </p>
        </div>

        <div className="container mx-auto p-4 lg:p-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8">
            {things.map((thing, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1"
              >
                <div className="relative w-full h-48 sm:h-56 lg:h-64">
                  <Image
                    src={thing.image_url}
                    alt={thing.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover"
                  />
                </div>

                <div className="p-4 flex flex-col justify-between h-auto">
                  <h2 className="font-extrabold text-xl text-gray-900  truncate">
                    {thing.name}
                  </h2>

                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {thing.description}
                  </p>

                  <div className="mt-auto pt-2 border-t border-gray-100">
                    <p className="text-sm font-semibold text-blue-600">
                      <span className="text-gray-500 font-normal">
                        สถานที่เจอ:{" "}
                      </span>
                      {thing.found_place}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

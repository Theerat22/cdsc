// app/admin/components/ItemList.tsx
"use client";

import Image from 'next/image';
import Link from 'next/link';

export interface FoundItem {
  id: number;
  name: string;
  description: string;
  found_place: string;
  image_url: string;
  created_at: string;
}

export interface FormData {
  name: string;
  description: string;
  found_place: string;
  image: File | null;
}

export type View = 'list' | 'add';

interface ItemListProps {
  items: FoundItem[];
  loading: boolean;
  error: string | null;
  onDeleteSuccess: () => void;
}

export function ItemList({ items, loading, error, onDeleteSuccess }: ItemListProps) {
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Increased precision in formatting for better UX
    return date.toLocaleDateString('th-TH', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDeleteItem = async (id: number) => {
    if (!confirm(`ต้องการลบรายการนี้หรือไม่? ID: ${id}`)) {
        return;
    }
    try {
        const response = await fetch(`/api/lostnfound/add/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete item');
        }

        alert('ลบรายการสำเร็จ!');
        onDeleteSuccess();
    } catch (err) {
        console.error("Delete error:", err);
        alert(`เกิดข้อผิดพลาดในการลบ: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-10 bg-white rounded-xl shadow-lg">
        <p className="text-xl text-gray-600 flex justify-center items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          กำลังโหลดข้อมูล...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10 bg-red-50 rounded-xl shadow-lg border border-red-300">
        <p className="text-xl text-red-600">⚠️ {error}</p>
      </div>
    );
  }

  return (
    <>
      {items.length === 0 ? (
        <div className="text-center p-10 bg-white rounded-xl shadow-lg border border-gray-200">
          <p className="text-lg text-gray-500">
            ไม่พบรายการสิ่งของ Lost & Found ในขณะนี้ 🧐
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                  รูป
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ชื่อสิ่งของ
                </th>
                {/* Hidden on small screens for better responsiveness */}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  สถานที่พบ
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  วันที่เพิ่ม
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50 transition duration-100">
                  <td className="px-4 py-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <div className="text-sm font-semibold text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500 truncate">{item.description}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                    {item.found_place}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                    {formatDate(item.created_at)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                    <button 
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-600 hover:text-red-800 mx-1.5 p-1 rounded hover:bg-red-50 transition duration-150"
                      aria-label={`ลบ ${item.name}`}
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
// app/admin/components/AddItemForm.tsx
"use client";

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
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

export function AddItemForm({ onSubmissionSuccess }: { onSubmissionSuccess: () => void }) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    found_place: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setFormData((prev) => ({ ...prev, image: file }));
    
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  }, [previewUrl]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!formData.image) {
      setError("กรุณาเลือกรูปภาพของสิ่งของที่พบ");
      setLoading(false);
      return;
    }
    
    if (!formData.name || !formData.found_place) {
        setError("กรุณากรอกชื่อสิ่งของและสถานที่ที่พบ");
        setLoading(false);
        return;
    }

    try {
      const apiFormData = new window.FormData();
      apiFormData.append("name", formData.name);
      apiFormData.append("description", formData.description);
      apiFormData.append("found_place", formData.found_place);
      apiFormData.append("image", formData.image); 

      const response = await fetch("/api/lostnfound/add", {
        method: "POST",
        body: apiFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.status} ${response.statusText}`);
      }

      alert("บันทึกข้อมูลสำเร็จ! ✅");
      onSubmissionSuccess(); 
      
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setFormData({ name: "", description: "", found_place: "", image: null });
      setPreviewUrl(null);

    } catch (err) {
      console.error("Submission error:", err);
      setError(`ไม่สามารถบันทึกข้อมูลได้: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl transition duration-300 hover:shadow-3xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
          แบบฟอร์มเพิ่มสิ่งของ
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">ชื่อสิ่งของ <span className="text-red-500">*</span></label>
              <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 transition duration-150"/>
            </div>
            <div>
              <label htmlFor="found_place" className="block text-sm font-medium text-gray-700">สถานที่ที่พบ <span className="text-red-500">*</span></label>
              <input type="text" name="found_place" id="found_place" required value={formData.found_place} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 transition duration-150"/>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">รายละเอียด</label>
            <textarea name="description" id="description" rows={3} value={formData.description} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 transition duration-150"/>
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">รูปภาพสิ่งของ <span className="text-red-500">*</span></label>
            <input type="file" name="image" id="image" accept="image/jpeg,image/png,image/webp" required={!formData.image} onChange={handleFileChange} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition duration-150"/>
            
            {/* Image Preview - Responsive sizing */}
            {previewUrl && (
              <div className="mt-4 max-w-xs h-40 relative rounded-lg overflow-hidden border-2 border-dashed border-gray-300 shadow-md">
                <Image src={previewUrl} alt="Image Preview" fill className="object-cover" sizes="(max-width: 768px) 100vw, 300px" />
              </div>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg" role="alert">
              <p className="font-semibold">ข้อผิดพลาด</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-lg text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out disabled:bg-gray-400 disabled:shadow-none">
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                กำลังอัปโหลด...
              </>
            ) : (
              "บันทึกสิ่งของที่พบ"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
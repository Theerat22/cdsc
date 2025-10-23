// app/admin/page.tsx
"use client";

import { useEffect, useState, useCallback } from 'react';
import { AddItemForm } from './components/AddItem';
import { ItemList } from './components/ItemList';

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

export default function AdminLostAndFound() {
  const [currentView, setCurrentView] = useState<View>('list');
  const [items, setItems] = useState<FoundItem[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [errorList, setErrorList] = useState<string | null>(null);

  // ดึงข้อมูลรายการสิ่งของ
  const fetchItems = useCallback(async () => {
    try {
      setLoadingList(true);
      const response = await fetch('/api/lostnfound/add', {
        method: 'GET',
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setItems(Array.isArray(data.data) ? data.data : []);
      setErrorList(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setErrorList('ไม่สามารถดึงข้อมูลสิ่งของ Lost & Found ได้');
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleItemAdded = () => {
    setCurrentView('list');
    fetchItems();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 px-2 sm:px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 border-b pb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 sm:mb-0">
            Lost & Found Admin Dashboard 
          </h1>
          <div className="flex flex-wrap justify-center space-x-2">
            <button
              onClick={() => setCurrentView('list')}
              className={`py-2 px-4 rounded-lg font-medium transition duration-150 text-sm sm:text-base ${
                currentView === 'list'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-300'
              }`}
            >
              รายการสิ่งของ ({items.length})
            </button>
            <button
              onClick={() => setCurrentView('add')}
              className={`py-2 px-4 rounded-lg font-medium transition duration-150 text-sm sm:text-base ${
                currentView === 'add'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-300'
              }`}
            >
              + เพิ่มรายการใหม่
            </button>
          </div>
        </div>

        <div className="mt-8">
          {currentView === 'list' && (
            <ItemList 
              items={items} 
              loading={loadingList} 
              error={errorList} 
              onDeleteSuccess={fetchItems} 
            />
          )}
          {currentView === 'add' && (
            <AddItemForm onSubmissionSuccess={handleItemAdded} />
          )}
        </div>
      </div>
    </div>
  );
}
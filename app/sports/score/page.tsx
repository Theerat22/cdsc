"use client";

import React, { useState, useEffect } from "react";
import {
  MedalIcon,
  getTeamBgClass,
  getTeamTextClass,
} from "@/app/components/sport/MedalIcon";

export interface SportEvent {
  id: number;
  event_name: string;
  green: number | null;
  pink: number | null;
  purple: number | null;
  orange: number | null;
  created_at: string;
}

export interface UpdateResultsRequest {
  id: number;
  green: number | null;
  pink: number | null;
  purple: number | null;
  orange: number | null;
}

export default function SportsDayPage() {
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<SportEvent | null>(null);
  const [saving, setSaving] = useState(false);

  const teamNames = {
    green: "สีเขียว",
    pink: "สีชมพู",
    purple: "สีม่วง",
    orange: "สีส้م",
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/sport_edit");
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event: SportEvent) => {
    setEditingEvent({ ...event });
  };

  const handleCancel = () => {
    setEditingEvent(null);
  };

  const handleSave = async () => {
    if (!editingEvent) return;

    setSaving(true);
    try {
      const updateData: UpdateResultsRequest = {
        id: editingEvent.id,
        green: editingEvent.green,
        pink: editingEvent.pink,
        purple: editingEvent.purple,
        orange: editingEvent.orange,
      };

      const response = await fetch("/api/sport_edit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        await fetchEvents();
        setEditingEvent(null);
        alert("บันทึกผลการแข่งขันเรียบร้อย");
      } else {
        const error = await response.json();
        alert(`เกิดข้อผิดพลาด: ${error.error}`);
      }
    } catch (error) {
      console.error("Error updating event:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setSaving(false);
    }
  };

  const handlePositionChange = (team: keyof SportEvent, value: string) => {
    if (!editingEvent) return;

    const numValue = value === "" ? null : parseInt(value);
    setEditingEvent({
      ...editingEvent,
      [team]: numValue,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">

        {/* Edit Modal */}
        {editingEvent && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
              <div className="bg-white text-black p-6 rounded-t-2xl">
                <h3 className="text-2xl font-semibold">
                  การแข่งขัน: {editingEvent.event_name}
                </h3>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(
                    Object.keys(teamNames) as Array<keyof typeof teamNames>
                  ).map((team) => (
                    <div
                      key={team}
                      className={`p-4 rounded-xl  ${getTeamBgClass(team)}`}
                    >
                      <label
                        className={`block text-sm font-bold mb-2 ${getTeamTextClass(
                          team
                        )}`}
                      >
                        {teamNames[team]}
                      </label>
                      <select
                        value={editingEvent[team] || ""}
                        onChange={(e) =>
                          handlePositionChange(team, e.target.value)
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="">-</option>
                        <option value="1">🥇 เหรียญทอง</option>
                        <option value="2">🥈 เหรียญเงิน</option>
                        <option value="3">🥉 เหรียญทองแดง</option>
                      </select>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex-1 bg-red-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 bg-green-600 text-white py-3 px-6 rounded-xl font-bold hover:gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {saving ? "กำลังบันทึก..." : "บันทึก"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-white text-black p-6">
            <h2 className="text-2xl font-semibold sm:text-lg">🏆 ผลการแข่งขันกีฬาสี (รอบเก็บคะแนน)</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                    ประเภทกีฬา
                  </th>
                  <th className="px-3 py-4 text-center text-sm font-semibold text-green-700">
                    เขียว
                  </th>
                  <th className="px-3 py-4 text-center text-sm font-semibold text-pink-700">
                    ชมพู
                  </th>
                  <th className="px-3 py-4 text-center text-sm font-semibold text-purple-700">
                    ม่วง
                  </th>
                  <th className="px-3 py-4 text-center text-sm font-semibold text-orange-700">
                    แสด
                  </th>
                  {/* <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    จัดการ
                  </th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {events.map((event, index) => (
                  <tr
                    key={event.id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-50 transition-colors duration-200`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {event.event_name}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <MedalIcon position={event.green} className="text-2xl" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <MedalIcon position={event.pink} className="text-2xl" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <MedalIcon position={event.purple} className="text-2xl" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <MedalIcon position={event.orange} className="text-2xl" />
                    </td>
                    {/* <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleEdit(event)}
                        className="bg-gray-500 text-white text-bold px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium"
                      >
                        แก้ไข
                      </button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {events.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-4xl mb-4">🏃‍♂️</div>
              <p className="text-gray-500 text-lg">ยังไม่มีข้อมูลการแข่งขัน</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
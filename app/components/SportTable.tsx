import React, { useState, useEffect } from 'react';
import { Trophy, Award } from 'lucide-react';

interface SportsMedalData {
  color: string;
  gold_medals: number;
  silver_medals: number;
  bronze_medals: number;
  total_medals: number;
}

const getColorClasses = (color: string) => {
  const colorMap = {
    green: 'from-emerald-500 to-emerald-300',
    pink: 'from-pink-500 to-pink-300',
    purple: 'from-purple-500 to-purple-300',
    orange: 'from-amber-500 to-amber-300'
  };
  return colorMap[color as keyof typeof colorMap] || 'from-gray-500 to-gray-300';
};

const getColor = (color: string) => {
  const colorMap = {
    green: 'text-emerald-500',
    pink: 'text-pink-500',
    purple: 'text-purple-500',
    orange: 'text-amber-500'
  };
  return colorMap[color as keyof typeof colorMap] || 'from-gray-500 to-gray-300';
};
const getColorName = (color: string) => {
  const nameMap = {
    green: 'สีเขียว',
    pink: 'สีชมพู',
    purple: 'สีม่วง',
    orange: 'สีแสด'
  };
  return nameMap[color as keyof typeof nameMap] || color;
};

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
  if (rank === 2) return <Award className="w-6 h-6 text-gray-400" />;
  if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
  return <Award className="w-6 h-6 text-amber-800" />;
};

export default function SportsDashboard() {
  const [sportsData, setSportsData] = useState<SportsMedalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sports');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setSportsData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
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
          <div className="text-red-500 text-xl font-semibold mb-2">เกิดข้อผิดพลาด</div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        {/* <div className="text-center my-5">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 font-kanit">
            ตารางสรุปคะแนน
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div> */}

        {/* Main Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden mx-2 sm:mx-0">
          <div className="bg-amber-500 px-4 sm:px-8 py-4 sm:py-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-white text-center">ตารางคะแนนรวม</h2>
          </div>

          <div className="p-4 sm:p-8">
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-6 text-gray-700 font-semibold text-lg">อันดับ</th>
                    <th className="text-left py-4 px-6 text-gray-700 font-semibold text-lg">สี</th>
                    <th className="text-center py-4 px-6 text-gray-700 font-semibold text-lg">
                      <div className="flex items-center justify-center gap-2">
                        <span>🥇</span>
                        <span>ทอง</span>
                      </div>
                    </th>
                    <th className="text-center py-4 px-6 text-gray-700 font-semibold text-lg">
                      <div className="flex items-center justify-center gap-2">
                        <span>🥈</span>
                        <span>เงิน</span>
                      </div>
                    </th>
                    <th className="text-center py-4 px-6 text-gray-700 font-semibold text-lg">
                      <div className="flex items-center justify-center gap-2">
                        <span>🥉</span>
                        <span>ทองแดง</span>
                      </div>
                    </th>
                    <th className="text-center py-4 px-6 text-gray-700 font-semibold text-lg">รวม</th>
                  </tr>
                </thead>
                <tbody>
                  {sportsData.map((team, index) => (
                    <tr 
                      key={team.color} 
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="py-6 px-6">
                        <div className="flex items-center gap-3">
                          {getRankIcon(index + 1)}
                          <span className="font-semibold text-gray-700 text-xl">
                            {index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <div className="flex items-center gap-4">
                          <div 
                            className={`w-10 h-10 rounded-full bg-gradient-to-r ${getColorClasses(team.color)} shadow-lg`}
                          ></div>
                          <span className="font-bold text-gray-800 text-lg">
                            {getColorName(team.color)}
                          </span>
                        </div>
                      </td>
                      <td className="py-6 px-6 text-center">
                        <span className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full font-bold text-yellow-800 text-lg">
                          {team.gold_medals}
                        </span>
                      </td>
                      <td className="py-6 px-6 text-center">
                        <span className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full font-bold text-gray-800 text-lg">
                          {team.silver_medals}
                        </span>
                      </td>
                      <td className="py-6 px-6 text-center">
                        <span className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full font-bold text-amber-800 text-lg">
                          {team.bronze_medals}
                        </span>
                      </td>
                      <td className="py-6 px-6 text-center">
                        <span className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full font-bold text-indigo-800 text-lg">
                          {team.total_medals}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden space-y-4">
              {sportsData.map((team, index) => (
                <div 
                  key={team.color}
                  className="bg-gray-50 rounded-xl p-4 sm:p-6 border-l-4"
                  style={{borderLeftColor: team.color === 'green' ? '#10b981' : team.color === 'pink' ? '#ec4899' : team.color === 'purple' ? '#8b5cf6' : '#f59e0b'}}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getRankIcon(index + 1)}
                      <span className="text-lg sm:text-xl font-bold text-gray-700">#{index + 1}</span>
                      {/* <div 
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r ${getColorClasses(team.color)} shadow-lg`}
                      ></div> */}
                      <span className={`font-semibold ${getColorClasses(team.color)} text-lg sm:text-xl`}>
                        {getColorName(team.color)}
                      </span>
                    </div>
                  </div>

                  {/* Medals Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <div className="text-center">
                      {/* <div className="text-2xl mb-1">🥇</div> */}
                      <div className="text-2xl sm:text-3xl font-bold text-yellow-600">{team.gold_medals}</div>
                      <div className="text-xs sm:text-sm text-gray-600">ทอง</div>
                    </div>
                    <div className="text-center">
                      {/* <div className="text-2xl mb-1">🥈</div> */}
                      <div className="text-2xl sm:text-3xl font-bold text-gray-600">{team.silver_medals}</div>
                      <div className="text-xs sm:text-sm text-gray-600">เงิน</div>
                    </div>
                    <div className="text-center">
                      {/* <div className="text-2xl mb-1">🥉</div> */}
                      <div className="text-2xl sm:text-3xl font-bold text-amber-600">{team.bronze_medals}</div>
                      <div className="text-xs sm:text-sm text-gray-600">ทองแดง</div>
                    </div>
                    <div className="text-center">
                      {/* <div className="text-2xl mb-1">🏆</div> */}
                      <div className="text-2xl sm:text-3xl font-bold text-indigo-600">{team.total_medals}</div>
                      <div className="text-xs sm:text-sm text-gray-600">รวม</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Cards - Desktop Only */}
        <div className="hidden xl:grid grid-cols-4 gap-6 mt-8">
          {sportsData.map((team, index) => (
            <div 
              key={team.color}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div 
                  className={`w-8 h-8 rounded-full bg-gradient-to-r ${getColorClasses(team.color)}`}
                ></div>
                <div className="text-sm text-gray-500">อันดับ {index + 1}</div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {getColorName(team.color)}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">เหรียญทอง:</span>
                  <span className="font-semibold text-yellow-600">{team.gold_medals}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">เหรียญเงิน:</span>
                  <span className="font-semibold text-gray-600">{team.silver_medals}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">เหรียญทองแดง:</span>
                  <span className="font-semibold text-amber-600">{team.bronze_medals}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-base font-bold">
                  <span className="text-gray-800">รวม:</span>
                  <span className="text-indigo-600">{team.total_medals}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
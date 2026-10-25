import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { BarChart3, TrendingUp, CheckCircle, Flame } from 'lucide-react';
import { useLevelora } from '../context/LeveloraContext';
import { getPastNDays } from '../utils/dates';
import { PandaMascot } from '../components/common/PandaMascot';

const COLORS = ['#F6B8A8', '#F3A6B7', '#A7B89A', '#74865B', '#F5E6A8', '#DCE8D2'];

export const Analytics: React.FC = () => {
  const { state, currentStreak, longestStreak } = useLevelora();
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');

  // Past 7 or 14 days data for XP & Quests
  const days = getPastNDays(timeRange === '7d' ? 7 : 14);

  const xpOverTimeData = days.map(d => {
    // Sum XP from transactions on this date
    const dayXp = state.xpTransactions
      .filter(tx => tx.timestamp.startsWith(d.dateStr))
      .reduce((sum, tx) => sum + (tx.amount > 0 ? tx.amount : 0), 0);

    const completedQuestsCount = state.completionHistory
      .filter(c => c.dateStr === d.dateStr && !c.reversed)
      .length;

    return {
      day: d.dayShort,
      date: d.dateStr,
      xp: dayXp,
      quests: completedQuestsCount,
    };
  });

  // Calculate actual XP earned in the last 7 days
  const last7DaysDateStrs = new Set(getPastNDays(7).map(d => d.dateStr));
  const xpThisWeek = state.xpTransactions
    .filter(tx => last7DaysDateStrs.has(tx.timestamp.slice(0, 10)) && tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Category performance from actual verified completions
  const categoryCountMap: Record<string, number> = {};
  state.completionHistory.forEach(c => {
    const q = state.quests.find(item => item.id === c.questId);
    const cat = q ? q.category : 'health';
    categoryCountMap[cat] = (categoryCountMap[cat] || 0) + 1;
  });

  const categoryData = Object.entries(categoryCountMap).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  // Skills level comparison
  const skillsData = state.skills.map(s => ({
    name: s.name.split(' ')[0],
    level: s.level,
    xp: s.currentXp,
  }));

  return (
    <div className="space-y-6 text-[#FFF5E8] pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#FFF5E8] tracking-tight flex items-center gap-2">
            <BarChart3 size={24} className="text-[#A7B89A]" />
            Growth Analytics
          </h1>
          <p className="text-xs text-[#DCE8D2] mt-0.5 font-medium">
            Visual metrics documenting your real-world habit consistency, XP gains, and skill balance.
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-black/20 text-xs font-bold">
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              timeRange === '7d' ? 'bg-[#74865B] text-white' : 'text-[#DCE8D2]/70 hover:text-white'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              timeRange === '30d' ? 'bg-[#74865B] text-white' : 'text-[#DCE8D2]/70 hover:text-white'
            }`}
          >
            Last 14 Days
          </button>
        </div>
      </div>

      {/* Stats KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#A7B89A] block mb-1">
            Total XP Earned
          </span>
          <div className="text-2xl font-black text-[#FFF5E8]">
            {state.profile.lifetimeXp} <span className="text-xs text-[#F5E6A8]">XP</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#A7B89A] mt-1 font-semibold">
            <TrendingUp size={12} /> +{xpThisWeek} this week
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#A7B89A] block mb-1">
            Quests Completed
          </span>
          <div className="text-2xl font-black text-[#FFF5E8]">
            {state.completionHistory.length}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#A7B89A] mt-1 font-semibold">
            <CheckCircle size={12} /> 100% verified
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#F6B8A8] block mb-1">
            Active Streak
          </span>
          <div className="text-2xl font-black text-[#FFF5E8]">
            {currentStreak} <span className="text-xs text-[#A7B89A]">days</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#F6B8A8] mt-1 font-semibold">
            <Flame size={12} className="fill-[#F6B8A8]" /> Keep it up!
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#F5E6A8] block mb-1">
            Best Streak
          </span>
          <div className="text-2xl font-black text-[#FFF5E8]">
            {longestStreak} <span className="text-xs text-[#A7B89A]">days</span>
          </div>
          <div className="text-[11px] text-[#A7B89A] mt-1 font-semibold">
            Personal Record
          </div>
        </div>
      </div>

      {/* Main Charts: XP Over Time & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* XP Progress Area Chart (2 Columns) */}
        <div className="lg:col-span-2 p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-[#FFF5E8] mb-1">
              XP Velocity &amp; Momentum
            </h3>
            <p className="text-xs text-[#A7B89A] mb-4">Daily experience earned through quests and habits</p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={xpOverTimeData}>
                  <defs>
                    <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F6B8A8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#A7B89A" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="day" 
                    stroke="#DCE8D2" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={{ stroke: 'rgba(255,255,255,0.15)' }} 
                  />
                  <YAxis 
                    stroke="#DCE8D2" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={{ stroke: 'rgba(255,255,255,0.15)' }} 
                    domain={[0, (dataMax: number) => Math.max(100, dataMax)]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E3320',
                      borderColor: 'rgba(255,255,255,0.2)',
                      borderRadius: '16px',
                      color: '#FFF5E8',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="xp"
                    name="XP Gained"
                    stroke="#F6B8A8"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#xpGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Category Breakdown Donut Chart (1 Column) */}
        <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-[#FFF5E8] mb-1">
              Category Focus
            </h3>
            <p className="text-xs text-[#A7B89A] mb-4">Distribution of completed quests</p>

            {categoryData.length === 0 ? (
              <div className="h-52 w-full flex flex-col items-center justify-center text-center p-3">
                <div className="w-16 h-16 rounded-2xl bg-black/20 flex items-center justify-center p-2 mb-2">
                  <PandaMascot pose="sleeping" size={50} />
                </div>
                <p className="text-xs font-bold text-[#FFF5E8]">No Quests Completed Yet</p>
                <p className="text-[10px] text-[#A7B89A] max-w-[190px] mt-0.5">
                  Complete your first quest to unlock your category focus distribution!
                </p>
              </div>
            ) : (
              <>
                <div className="h-52 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {categoryData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1E3320',
                          borderColor: 'rgba(255,255,255,0.2)',
                          borderRadius: '16px',
                          color: '#FFF5E8',
                          fontSize: '12px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend Chips */}
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  {categoryData.slice(0, 5).map((item, idx) => (
                    <div key={item.name} className="flex items-center gap-1.5 text-[11px] text-[#DCE8D2]">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                      />
                      <span>{item.name} ({item.value})</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

      </div>

      {/* Skills Comparison Bar Chart */}
      <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm">
        <h3 className="text-base font-extrabold text-[#FFF5E8] mb-1">
          Skill Garden Levels
        </h3>
        <p className="text-xs text-[#A7B89A] mb-4">Relative mastery across all cultivated disciplines</p>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={skillsData}>
              <XAxis 
                dataKey="name" 
                stroke="#DCE8D2" 
                fontSize={11} 
                tickLine={false} 
                axisLine={{ stroke: 'rgba(255,255,255,0.15)' }} 
              />
              <YAxis 
                stroke="#DCE8D2" 
                fontSize={11} 
                tickLine={false} 
                axisLine={{ stroke: 'rgba(255,255,255,0.15)' }} 
                domain={[0, 5]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E3320',
                  borderColor: 'rgba(255,255,255,0.2)',
                  borderRadius: '16px',
                  color: '#FFF5E8',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="level" name="Skill Level" fill="#A7B89A" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

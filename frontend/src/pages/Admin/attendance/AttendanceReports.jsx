import { BiLineChart } from "react-icons/bi";
import { AiOutlineAreaChart } from "react-icons/ai";
import { MdTimer } from "react-icons/md";
import { FaCalendarXmark } from "react-icons/fa6";
import { FaCalendarMinus } from "react-icons/fa6";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { GoCheck } from "react-icons/go";
import {
  FiDownload, FiFilter, FiCalendar, FiUsers, FiClock, FiBarChart2,
  FiPieChart,  FiTarget, FiAward
} from "react-icons/fi";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadialBarChart, RadialBar
} from 'recharts';
import { useTheme, getThemeClasses } from "../../../contexts/ThemeContext";

const AttendanceReports = () => {
  const [reportType, setReportType] = useState("daily");
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const darkMode = useTheme();
  const themeClasses = getThemeClasses(darkMode);

  const departments = [
    { id: "all", name: "All Departments" },
    { id: "IT", name: "IT" },
    { id: "HR", name: "HR" },
    { id: "Finance", name: "Finance" },
    { id: "Marketing", name: "Marketing" },
  ];

  const [reportStats, setReportStats] = useState({
    totalEmployees: 0,
    averageAttendance: 0,
    totalLateArrivals: 0,
    totalAbsences: 0,
    totalLeaves: 0,
    totalOvertime: 0,
  });

  const [departmentStats, setDepartmentStats] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [trendData, setTrendData] = useState([]);

  // Daily attendance pattern (Mock for now as backend doesn't support hourly yet)
  const dailyPatternData = [
    { hour: "9 AM", attendance: 85, late: 15 },
    { hour: "10 AM", attendance: 95, late: 5 },
    { hour: "11 AM", attendance: 98, late: 2 },
    { hour: "12 PM", attendance: 92, late: 8 },
    { hour: "1 PM", attendance: 88, late: 12 },
    { hour: "2 PM", attendance: 96, late: 4 },
    { hour: "3 PM", attendance: 94, late: 6 },
    { hour: "4 PM", attendance: 90, late: 10 },
    { hour: "5 PM", attendance: 82, late: 18 },
  ];

  // Attendance distribution (Derived from stats)
  const attendanceDistribution = [
    { name: "Present", value: Number(reportStats.averageAttendance) || 0, color: "#10b981" },
    { name: "Late", value: 5, color: "#f59e0b" }, // Mock data for now
    { name: "Absent", value: Math.max(0, 100 - (Number(reportStats.averageAttendance) || 0) - 5), color: "#ef4444" },
    { name: "Leave", value: 0, color: "#3b82f6" },
  ];

  // Overtime comparison (Mock for now)
  const overtimeData = [
    { department: "IT", hours: 15 },
    { department: "HR", hours: 8 },
    { department: "Finance", hours: 12 },
    { department: "Marketing", hours: 10 },
  ];

  // Weekly performance (Mock for now)
  const weeklyPerformance = [
    { day: "Mon", attendance: 91, target: 95 },
    { day: "Tue", attendance: 93, target: 95 },
    { day: "Wed", attendance: 94, target: 95 },
    { day: "Thu", attendance: 92, target: 95 },
    { day: "Fri", attendance: 90, target: 95 },
    { day: "Sat", attendance: 88, target: 90 },
    { day: "Sun", attendance: 85, target: 85 },
  ];

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

  const generateReport = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const query = new URLSearchParams({
        start: dateRange.start,
        end: dateRange.end,
        department: departmentFilter
      }).toString();

      const res = await fetch(`/api/reports/analytics/attendance?${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Failed to fetch report");

      const data = await res.json();

      setReportStats(data.reportStats);
      setTrendData(data.trendData);
      setDepartmentStats(data.departmentStats);
      setTopPerformers(data.topPerformers);

      toast.success("Report generated successfully");

    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (format) => {
    // PDF Handling
    if (format === "pdf") {
      window.print();
      return;
    }

    // Excel/CSV Handling
    if (format === "csv" || format === "excel") {
      try {
        toast.loading("Exporting report...");
        const token = localStorage.getItem("token");

        // Pass current filters
        const query = new URLSearchParams({
          start: dateRange.start,
          end: dateRange.end,
          department: departmentFilter
        }).toString();

        const res = await fetch(`/api/reports/attendance?${query}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Export failed");

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `attendance_report_${dateRange.start}_to_${dateRange.end}.${format === 'excel' ? 'csv' : 'csv'}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        toast.dismiss();
        toast.success("Export successful");
      } catch (err) {
        console.error("Export failed:", err);
        toast.dismiss();
        toast.error("Failed to export report");
      }
    }
  };

  useEffect(() => {
    generateReport();
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`${themeClasses.bg.primary} p-3 rounded-lg border ${themeClasses.border.primary}`}>
          <p className={themeClasses.text.primary}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-3xl font-bold ${themeClasses.text.primary}`}>
              Attendance Analytics
            </h1>
            <p className={themeClasses.text.secondary}>
              Comprehensive attendance reports and visual analytics dashboard
            </p>
          </div>
          <FiBarChart2 className="w-12 h-12 text-purple-700" />
        </div>
      </div>

      {/* Report Controls */}
      <div className={`${themeClasses.bg.secondary} rounded-xl p-6 border ${themeClasses.border.primary} mb-8`}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          

          {/* Date Range */}
          <div>
            <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className={`w-full px-4 py-3 ${themeClasses.input.bg} border ${themeClasses.input.border} ${themeClasses.input.text} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
              End Date
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className={`w-full px-4 py-3 ${themeClasses.input.bg} border ${themeClasses.input.border} ${themeClasses.input.text} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
            />
          </div>

          {/* Department Filter */}
          <div>
            <label className={`block text-sm font-medium ${themeClasses.text.primary} mb-2`}>
              Department
            </label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className={`w-full px-4 py-3 ${themeClasses.input.bg} border ${themeClasses.input.border} ${themeClasses.input.text} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
            >
              {departments.map(dept => (
                <option key={dept.id} value={dept.id} className={darkMode ? 'bg-gray-900' : 'bg-white'}>{dept.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={generateReport}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
          >
            <FiFilter className="w-5 h-5" />
            Generate Report
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => exportReport("pdf")}
              className={`flex items-center gap-2 px-4 py-3 ${themeClasses.input.bg} border ${themeClasses.input.border} ${themeClasses.text.primary} rounded-lg hover:${darkMode ? 'bg-gray-800' : 'bg-gray-200'} font-medium`}
            >
              <FiDownload className="w-4 h-4" />
              PDF
            </button>
            <button
              onClick={() => exportReport("excel")}
              className={`flex items-center gap-2 px-4 py-3 ${themeClasses.input.bg} border ${themeClasses.input.border} ${themeClasses.text.primary} rounded-lg hover:${darkMode ? 'bg-gray-800' : 'bg-gray-200'} font-medium`}
            >
              <FiDownload className="w-4 h-4" />
              Excel
            </button>
            <button
              onClick={() => exportReport("csv")}
              className={`flex items-center gap-2 px-4 py-3 ${themeClasses.input.bg} border ${themeClasses.input.border} ${themeClasses.text.primary} rounded-lg hover:${darkMode ? 'bg-gray-800' : 'bg-gray-200'} font-medium`}
            >
              <FiDownload className="w-4 h-4" />
              CSV
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
  {[
    { label: "Total Employees", value: reportStats.totalEmployees, icon: FiUsers, color: "purple" },
    { label: "Avg Attendance", value: `${reportStats.averageAttendance}%`, icon: FiCalendar, color: "emerald"  },
    { label: "Late Arrivals", value: reportStats.totalLateArrivals, icon: MdTimer, color: "amber",  },
    { label: "Total Absences", value: reportStats.totalAbsences, icon: FaCalendarXmark, color: "rose"  },
    { label: "Leave Days", value: reportStats.totalLeaves, icon: FaCalendarMinus, color: "cyan",  },
    { label: "Overtime Hours", value: `${reportStats.totalOvertime}h`, icon: FiClock, color: "purple",},
  ].map((metric, index) => (
    <div key={index} className={`${themeClasses.bg.secondary} p-5 rounded-xl border ${themeClasses.border.primary}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm ${
            darkMode 
              ? metric.color === 'purple' ? 'text-purple-400' :
                metric.color === 'emerald' ? 'text-emerald-400' :
                metric.color === 'amber' ? 'text-amber-400' :
                metric.color === 'rose' ? 'text-rose-400' :
                'text-cyan-400'
              : metric.color === 'purple' ? 'text-purple-700' :
                metric.color === 'emerald' ? 'text-emerald-700' :
                metric.color === 'amber' ? 'text-amber-700' :
                metric.color === 'rose' ? 'text-rose-700' :
                'text-cyan-700'
          }`}>
            {metric.label}
          </p>

          <div className="flex items-baseline gap-1">
            <h3 className={`text-2xl font-bold mt-1 ${
              darkMode 
                ? metric.color === 'purple' ? 'text-purple-400' :
                  metric.color === 'emerald' ? 'text-emerald-400' :
                  metric.color === 'amber' ? 'text-amber-400' :
                  metric.color === 'rose' ? 'text-rose-400' :
                  'text-cyan-400'
                : metric.color === 'purple' ? 'text-purple-600' :
                  metric.color === 'emerald' ? 'text-emerald-600' :
                  metric.color === 'amber' ? 'text-amber-600' :
                  metric.color === 'rose' ? 'text-rose-600' :
                  'text-cyan-700'
            }`}>
              {metric.value}
            </h3>

            {metric.trend === 'up' && (
              <GoCheck className={`w-4 h-4 ${
                darkMode 
                  ? metric.color === 'purple' ? 'text-purple-400' :
                    metric.color === 'emerald' ? 'text-emerald-400' :
                    metric.color === 'amber' ? 'text-amber-400' :
                    metric.color === 'rose' ? 'text-rose-400' :
                    'text-cyan-400'
                  : metric.color === 'purple' ? 'text-purple-700' :
                    metric.color === 'emerald' ? 'text-emerald-700' :
                    metric.color === 'amber' ? 'text-amber-700' :
                    metric.color === 'rose' ? 'text-rose-700' :
                    'text-cyan-700'
              }`} />
            )}

            {metric.trend === 'down' && (
              <GoCheck className={`w-4 h-4 ${
                darkMode 
                  ? metric.color === 'purple' ? 'text-purple-400' :
                    metric.color === 'emerald' ? 'text-emerald-400' :
                    metric.color === 'amber' ? 'text-amber-400' :
                    metric.color === 'rose' ? 'text-rose-400' :
                    'text-cyan-400'
                  : metric.color === 'purple' ? 'text-purple-700' :
                    metric.color === 'emerald' ? 'text-emerald-700' :
                    metric.color === 'amber' ? 'text-amber-700' :
                    metric.color === 'rose' ? 'text-rose-700' :
                    'text-cyan-700'
              }`} />
            )}
          </div>
        </div>

        <metric.icon className={`w-8 h-8 ${
          darkMode 
            ? metric.color === 'purple' ? 'text-purple-400' :
              metric.color === 'emerald' ? 'text-emerald-400' :
              metric.color === 'amber' ? 'text-amber-400' :
              metric.color === 'rose' ? 'text-rose-400' :
              'text-cyan-400'
            : metric.color === 'purple' ? 'text-purple-700' :
              metric.color === 'emerald' ? 'text-emerald-700' :
              metric.color === 'amber' ? 'text-amber-700' :
              metric.color === 'rose' ? 'text-rose-700' :
              'text-cyan-700'
        }`} />
      </div>
    </div>
  ))}
</div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Trend Chart - Only spacing improved */}
        <div className={`${themeClasses.bg.secondary} rounded-xl p-6 border ${themeClasses.border.primary}`}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>Monthly Attendance Trend</h3>
              <p className={`text-sm ${themeClasses.text.secondary} mt-1`}>Last 6 months performance</p>
            </div>
            <AiOutlineAreaChart className="w-6 h-6 text-purple-400" />
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart 
                data={trendData}
                margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                <XAxis 
                  dataKey="month" 
                  stroke={darkMode ? "#9ca3af" : "#4b5563"}
                  tick={{ fill: darkMode ? '#9ca3af' : '#4b5563', fontSize: 12 }}
                  label={{ 
                    value: 'Month', 
                    position: 'insideBottom', 
                    offset: -10,
                    fill: darkMode ? '#9ca3af' : '#4b5563',
                    fontSize: 12
                  }}
                />
                <YAxis 
                  stroke={darkMode ? "#9ca3af" : "#4b5563"}
                  tick={{ fill: darkMode ? '#9ca3af' : '#4b5563', fontSize: 12 }}
                  label={{ 
                    value: 'Percentage (%)', 
                    angle: -90, 
                    position: 'insideLeft',
                    offset: 10,
                    fill: darkMode ? '#9ca3af' : '#4b5563',
                    fontSize: 12,
                    dy: 30
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  wrapperStyle={{
                    paddingBottom: '10px',
                    fontSize: '12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="attendance"
                  name="Attendance %"
                  stroke="#10b981"
                  fill="url(#colorAttendance)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="late"
                  name="Late Arrivals"
                  stroke="#f59e0b"
                  fill="url(#colorLate)"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorLate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Legend/Stats below chart - Added for spacing */}
          <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className={`text-sm ${themeClasses.text.secondary}`}>Average Attendance</span>
              <span className={`ml-auto text-sm font-semibold ${themeClasses.text.primary}`}>
                {trendData.length > 0 ? Math.round(trendData.reduce((acc, curr) => acc + curr.attendance, 0) / trendData.length) : 0}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className={`text-sm ${themeClasses.text.secondary}`}>Average Late</span>
              <span className={`ml-auto text-sm font-semibold ${themeClasses.text.primary}`}>
                {trendData.length > 0 ? Math.round(trendData.reduce((acc, curr) => acc + curr.late, 0) / trendData.length) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Attendance Distribution */}
        <div className={`${themeClasses.bg.secondary} rounded-xl p-6 border ${themeClasses.border.primary}`}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>Attendance Distribution</h3>
              <p className={themeClasses.text.secondary}>Current month breakdown</p>
            </div>
            <FiPieChart className="w-6 h-6 text-purple-400" />
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={attendanceDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {attendanceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            {attendanceDistribution.map((item, index) => (
              <div key={index} className={`flex items-center gap-2 p-2 rounded-lg ${themeClasses.bg.tertiary}`}>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className={`text-sm ${themeClasses.text.primary}`}>{item.name}</span>
                <span className={`ml-auto text-sm font-medium ${themeClasses.text.primary}`}>{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Performance - Only spacing improved */}
      <div className={`${themeClasses.bg.secondary} rounded-xl p-6 border ${themeClasses.border.primary} mb-8`}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>Weekly Performance vs Target</h3>
            <p className={`text-sm ${themeClasses.text.secondary} mt-1`}>Current week attendance vs goals</p>
          </div>
          <BiLineChart className="w-6 h-6 text-purple-400" />
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <LineChart 
              data={weeklyPerformance}
              margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
              <XAxis 
                dataKey="day" 
                stroke={darkMode ? "#9ca3af" : "#4b5563"}
                tick={{ fill: darkMode ? '#9ca3af' : '#4b5563', fontSize: 12 }}
                label={{ 
                  value: 'Day of Week', 
                  position: 'insideBottom', 
                  offset: -10,
                  fill: darkMode ? '#9ca3af' : '#4b5563',
                  fontSize: 14
                }}
              />
              <YAxis 
                stroke={darkMode ? "#9ca3af" : "#4b5563"}
                tick={{ fill: darkMode ? '#9ca3af' : '#4b5563', fontSize: 12 }}
                label={{ 
                  value: 'Attendance Rate (%)', 
                  angle: -90, 
                  position: 'insideLeft',
                  offset: 10,
                  fill: darkMode ? '#9ca3af' : '#4b5563',
                  fontSize: 14,
                  dy: 30
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                height={36}
                wrapperStyle={{
                  paddingBottom: '10px',
                  fontSize: '12px'
                }}
              />
              <Line
                type="monotone"
                dataKey="attendance"
                name="Actual Attendance"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4, fill: "#3b82f6" }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="target"
                name="Target"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3, fill: "#10b981" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Summary - Added for spacing */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className={`text-sm ${themeClasses.text.muted}`}>Best Day</p>
            <p className={`text-sm font-semibold ${themeClasses.text.primary}`}>
              {weeklyPerformance.reduce((max, day) => day.attendance > max.attendance ? day : max).day}
            </p>
            <p className="text-sm text-emerald-500">
              {weeklyPerformance.reduce((max, day) => day.attendance > max.attendance ? day : max).attendance}%
            </p>
          </div>
          
          <div className="text-center">
            <p className={`text-sm ${themeClasses.text.muted}`}>Average</p>
            <p className={`text-sm font-semibold ${themeClasses.text.primary}`}>
              {Math.round(weeklyPerformance.reduce((acc, day) => acc + day.attendance, 0) / weeklyPerformance.length)}%
            </p>
            <p className="text-sm text-blue-500">vs {weeklyPerformance[0]?.target}% target</p>
          </div>
          <div className="text-center">
            <p className={`text-sm ${themeClasses.text.muted}`}>Gap to Target</p>
            <p className={`text-sm font-semibold ${Math.round(weeklyPerformance.reduce((acc, day) => acc + (day.target - day.attendance), 0) / weeklyPerformance.length) > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
              {Math.round(weeklyPerformance.reduce((acc, day) => acc + (day.target - day.attendance), 0) / weeklyPerformance.length)}%
            </p>
            <p className="text-sm text-gray-500">average deficit</p>
          </div>
        </div>
      </div>

      {/* Department Performance Table */}
<div className={`${themeClasses.bg.secondary} rounded-xl p-6 border ${themeClasses.border.primary} mb-8`}>
  <h3 className={`text-lg font-semibold ${themeClasses.text.primary} mb-6 text-center`}>Department Performance</h3>
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className={themeClasses.bg.tertiary}>
        <tr>
          <th className={`p-4 text-left text-sm font-semibold ${themeClasses.text.secondary}`}>Department</th>
          <th className={`p-4 text-center text-sm font-semibold ${themeClasses.text.secondary}`}>Employees</th>
          <th className={`p-4 text-center text-sm font-semibold ${themeClasses.text.secondary}`}>Attendance Rate</th>
          <th className={`p-4 text-center text-sm font-semibold ${themeClasses.text.secondary}`}>Late Arrivals</th>
          <th className={`p-4 text-center text-sm font-semibold ${themeClasses.text.secondary}`}>Absences</th>
          <th className={`p-4 text-center text-sm font-semibold ${themeClasses.text.secondary}`}>Performance</th>
        </tr>
      </thead>
      <tbody>
        {departmentStats.map((dept, index) => (
          <tr key={index} className={`hover:${themeClasses.bg.tertiary}/50 transition-colors border-t ${themeClasses.border.primary}`}>
            <td className="p-4">
              <div className="flex items-center justify-left gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-purple-400 flex items-center justify-center text-white font-bold">
                  {dept.name.charAt(0)}
                </div>
                <div>
                  <p className={`font-medium ${themeClasses.text.primary} text-center`}>{dept.name} Department</p>
                </div>
              </div>
            </td>
            <td className="p-4 text-center">
              <span className={`font-bold ${themeClasses.text.primary}`}>{dept.employees}</span>
            </td>
            <td className="p-4 text-center">
              <div className="flex items-center justify-center gap-3">
                <div className="flex-1 max-w-[150px]">
                  <div className={`h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded-full overflow-hidden`}>
                    <div
                      className={`h-full rounded-full ${dept.attendance >= 95 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                        dept.attendance >= 90 ? 'bg-gradient-to-r from-amber-500 to-amber-400' : 'bg-gradient-to-r from-rose-500 to-rose-400'
                        }`}
                      style={{ width: `${dept.attendance}%` }}
                    ></div>
                  </div>
                </div>
                <span className={`font-bold ${themeClasses.text.primary}`}>{dept.attendance}%</span>
              </div>
            </td>
            <td className="p-4 text-center">
              <span className="font-bold text-amber-400">{dept.late}</span>
            </td>
            <td className="p-4 text-center">
              <span className="font-bold text-rose-400">{dept.absent}</span>
            </td>
            <td className="p-4 text-center">
              <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${dept.attendance >= 95 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                dept.attendance >= 90 ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                }`}>
                {dept.attendance >= 95 ? 'Excellent' :
                  dept.attendance >= 90 ? 'Good' : 'Needs Improvement'}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

      {/* Top Performers & Overtime Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Performers */}
        <div className={`${themeClasses.bg.secondary} rounded-xl p-6 border ${themeClasses.border.primary}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>Top Performers</h3>
            <FiAward className="w-6 h-6 text-purple-400" />
          </div>

          <div className="space-y-4">
            {topPerformers.map((emp, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg hover:${themeClasses.bg.tertiary}/50 transition-colors border ${themeClasses.border.primary}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 flex items-center justify-center text-white font-bold">
                    {emp.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className={`font-medium ${themeClasses.text.primary}`}>{emp.name}</p>
                    <p className={themeClasses.text.secondary}>{emp.department}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-400">{emp.attendance}%</p>
                  <p className={`text-xs ${themeClasses.text.muted}`}>Attendance Rate</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overtime Comparison - Only spacing improved */}
        <div className={`${themeClasses.bg.secondary} rounded-xl p-6 border ${themeClasses.border.primary}`}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className={`text-lg font-semibold ${themeClasses.text.primary}`}>Overtime Hours by Department</h3>
              <p className={`text-sm ${themeClasses.text.secondary} mt-1`}>Monthly overtime distribution</p>
            </div>
            <FiClock className="w-6 h-6 text-purple-500" />
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart 
                data={overtimeData}
                margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                <XAxis 
                  dataKey="department" 
                  stroke={darkMode ? "#9ca3af" : "#4b5563"}
                  tick={{ fill: darkMode ? '#9ca3af' : '#4b5563', fontSize: 12 }}
                  label={{ 
                    value: 'Department', 
                    position: 'insideBottom', 
                    offset: -10,
                    fill: darkMode ? '#9ca3af' : '#4b5563',
                    fontSize: 14
                  }}
                />
                <YAxis 
                  stroke={darkMode ? "#9ca3af" : "#4b5563"}
                  tick={{ fill: darkMode ? '#9ca3af' : '#4b5563', fontSize: 12 }}
                  label={{ 
                    value: 'Overtime Hours', 
                    angle: -90, 
                    position: 'insideLeft',
                    offset: 10,
                    fill: darkMode ? '#9ca3af' : '#4b5563',
                    fontSize: 14,
                    dy: 30
                  }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                    border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    padding: '8px 12px'
                  }}
                  labelStyle={{ color: darkMode ? '#f3f4f6' : '#111827', fontWeight: 600 }}
                />
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  wrapperStyle={{
                    paddingBottom: '10px',
                    fontSize: '12px'
                  }}
                />
                <Bar
                  dataKey="hours"
                  name="Overtime Hours"
                  fill="#f87d7d"
                  radius={[4, 4, 0, 0]}
                  label={{
                    position: 'top',
                    fill: darkMode ? '#9ca3af' : '#4b5563',
                    fontSize: 11,
                    formatter: (value) => `${value}h`
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Overtime Statistics - Added for spacing */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className={`text-sm ${themeClasses.text.muted}`}>Total Overtime</p>
              <p className={`text-lg font-bold ${themeClasses.text.primary}`}>
                {overtimeData.reduce((acc, dept) => acc + dept.hours, 0)}h
              </p>
            </div>
            <div className="text-center">
              <p className={`text-sm ${themeClasses.text.muted}`}>Highest</p>
              <p className={`text-lg font-bold text-amber-500`}>
                {Math.max(...overtimeData.map(d => d.hours))}h
              </p>
              <p className={`text-sm ${themeClasses.text.muted}`}>
                {overtimeData.find(d => d.hours === Math.max(...overtimeData.map(d => d.hours)))?.department}
              </p>
            </div>
            <div className="text-center">
              <p className={`text-sm ${themeClasses.text.muted}`}>Lowest</p>
              <p className={`text-lg font-bold text-emerald-500`}>
                {Math.min(...overtimeData.map(d => d.hours))}h
              </p>
              <p className={`text-sm ${themeClasses.text.muted}`}>
                {overtimeData.find(d => d.hours === Math.min(...overtimeData.map(d => d.hours)))?.department}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReports;
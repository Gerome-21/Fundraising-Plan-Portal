import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { 
  FiDollarSign, 
  FiUsers, 
  FiTarget, 
  FiTrendingUp,
  FiCalendar,
  FiAward,
  FiHeart,
  FiStar
} from 'react-icons/fi';

const Homepage = () => {
  // Mock data based on typical tool inputs
  const fundraisingData = [
    { month: 'Jan', target: 50000, actual: 45000, prospects: 120 },
    { month: 'Feb', target: 55000, actual: 52000, prospects: 135 },
    { month: 'Mar', target: 60000, actual: 58000, prospects: 150 },
    { month: 'Apr', target: 65000, actual: 62000, prospects: 165 },
    { month: 'May', target: 70000, actual: 68000, prospects: 180 },
    { month: 'Jun', target: 75000, actual: 72000, prospects: 200 },
  ];

  const donorPyramidData = [
    { name: 'High-Level', value: 15, color: '#FFD700' },
    { name: 'Medium-Level', value: 35, color: '#4169E1' },
    { name: 'Low-Level', value: 50, color: '#32CD32' },
  ];

  const donorWarmthData = [
    { name: 'HOT', value: 25, color: '#EF4444' },
    { name: 'WARM', value: 45, color: '#F97316' },
    { name: 'COLD', value: 30, color: '#3B82F6' },
  ];

  const giftRangeData = [
    { range: '₱1M+', count: 5, amount: 5000000 },
    { range: '₱500k', count: 12, amount: 6000000 },
    { range: '₱250k', count: 25, amount: 6250000 },
    { range: '₱100k', count: 40, amount: 4000000 },
    { range: '₱50k', count: 60, amount: 3000000 },
    { range: '₱25k', count: 80, amount: 2000000 },
  ];

  const programNeedsData = [
    { name: 'Program A', required: 150000, committed: 95000, gap: 55000 },
    { name: 'Program B', required: 200000, committed: 120000, gap: 80000 },
    { name: 'Program C', required: 120000, committed: 80000, gap: 40000 },
    { name: 'Program D', required: 180000, committed: 60000, gap: 120000 },
  ];

  const metricsCards = [
    { 
      title: 'Total Fundraising Target', 
      value: '₱ 3.2M', 
      change: '+15%', 
      icon: FiTarget, 
      color: 'bg-blue-500' 
    },
    { 
      title: 'Committed Funds', 
      value: '₱ 2.1M', 
      change: '+8%', 
      icon: FiDollarSign, 
      color: 'bg-green-500' 
    },
    { 
      title: 'Funding Gap', 
      value: '₱ 1.1M', 
      change: '-3%', 
      icon: FiTrendingUp, 
      color: 'bg-orange-500' 
    },
    { 
      title: 'Active Donors', 
      value: '128', 
      change: '+12', 
      icon: FiUsers, 
      color: 'bg-purple-500' 
    },
    { 
      title: 'HOT Prospects', 
      value: '25', 
      change: '+5', 
      icon: FiHeart, 
      color: 'bg-red-500' 
    },
    { 
      title: 'Programs Funded', 
      value: '8/12', 
      change: '66%', 
      icon: FiAward, 
      color: 'bg-indigo-500' 
    },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border">
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: ₱ {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#001033]">Fundraising Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's your fundraising overview</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
          <FiCalendar className="text-[#22864D]" />
          <span className="text-sm font-medium">March 2025</span>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metricsCards.map((metric, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div className={`${metric.color} w-10 h-10 rounded-lg flex items-center justify-center text-white`}>
                <metric.icon size={20} />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {metric.change}
              </span>
            </div>
            <div className="mt-3">
              <p className="text-sm text-gray-500">{metric.title}</p>
              <p className="text-xl font-bold text-gray-800">{metric.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fundraising Progress */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-800">Fundraising Progress</h2>
            <select className="text-xs border rounded-lg px-2 py-1">
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={fundraisingData}>
              <defs>
                <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22864D" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#22864D" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="actual" 
                stroke="#22864D" 
                fillOpacity={1} 
                fill="url(#colorTarget)" 
                name="Actual"
              />
              <Line type="monotone" dataKey="target" stroke="#FF8042" strokeDasharray="5 5" name="Target" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Donor Pyramid Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-800">Donor Pyramid Distribution</h2>
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">By Level</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={donorPyramidData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {donorPyramidData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {donorPyramidData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{item.value}</span>
                    <span className="text-xs text-gray-400">donors</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gift Range Chart */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-800">Gift Range Analysis</h2>
            <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full">By Amount</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={giftRangeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="range" />
              <YAxis yAxisId="left" orientation="left" stroke="#22864D" />
              <YAxis yAxisId="right" orientation="right" stroke="#FF8042" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="count" fill="#22864D" name="No. of Gifts" />
              <Bar yAxisId="right" dataKey="amount" fill="#FF8042" name="Amount (₱)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Donor Warmth Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-800">Donor Engagement</h2>
            <span className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-full">By Warmth</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={donorWarmthData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                >
                  {donorWarmthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col justify-center space-y-4">
              {donorWarmthData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-lg">{item.value}</span>
                    <span className="text-xs text-gray-400">donors</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Program Needs Overview */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Program Funding Status</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Program</th>
                <th className="text-right py-3">Required</th>
                <th className="text-right py-3">Committed</th>
                <th className="text-right py-3">Gap</th>
                <th className="text-right py-3">Progress</th>
              </tr>
            </thead>
            <tbody>
              {programNeedsData.map((program, index) => {
                const percentage = (program.committed / program.required) * 100;
                return (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-medium">{program.name}</td>
                    <td className="text-right">₱ {program.required.toLocaleString()}</td>
                    <td className="text-right">₱ {program.committed.toLocaleString()}</td>
                    <td className="text-right text-orange-600 font-medium">
                      ₱ {program.gap.toLocaleString()}
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-[#22864D] h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs">{percentage.toFixed(0)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">Top Opportunity</h3>
          <p className="text-sm text-gray-600">High-level donors show 40% higher conversion rate. Focus on building relationships with 5 new corporate prospects.</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
          <h3 className="font-semibold text-green-800 mb-2">Funding Gap Alert</h3>
          <p className="text-sm text-gray-600">Program D has the largest funding gap (₱120k). Consider reallocating resources from Conference budget.</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
          <h3 className="font-semibold text-orange-800 mb-2">Next Actions</h3>
          <p className="text-sm text-gray-600">Follow up with 12 HOT prospects this week. Prioritize the 3 major donors in the ₱1M+ range.</p>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
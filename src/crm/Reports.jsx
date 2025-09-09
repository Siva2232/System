import React, { useState, useEffect, useContext } from "react";
import { BookingContext } from "../context/BookingContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend,LineChart,Line, } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Users, Home, Calendar, Filter, MoreHorizontal,Download } from "lucide-react";

const StatCard = ({ title, value, change, icon: Icon }) => {
  const isPositive = change >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${
          title.includes('Revenue') ? 'from-green-400 to-green-600' :
          title.includes('Bookings') ? 'from-blue-400 to-blue-600' :
          title.includes('Rooms') ? 'from-purple-400 to-purple-600' :
          'from-pink-400 to-pink-600'
        } text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={24} />
        </div>
        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
          isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <TrendIcon size={14} />
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-xs text-gray-500">vs last period</p>
    </div>
  );
};

const AnimatedChart = ({ children, title, subtitle }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`bg-white rounded-3xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-500 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="flex space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <Download size={16} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <MoreHorizontal size={16} className="text-gray-600" />
          </button>
        </div>
      </div>
      <div style={{ height: '300px' }}>
        {children}
      </div>
    </div>
  );
};

const Reports = () => {
  const { bookings } = useContext(BookingContext);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Filter bookings by selected period
  const getFilteredBookings = () => {
    const now = new Date();
    let startDate;
    switch (selectedPeriod) {
      case '7d':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case '30d':
        startDate = new Date(now.setDate(now.getDate() - 30));
        break;
      case '90d':
        startDate = new Date(now.setDate(now.getDate() - 90));
        break;
      default:
        startDate = new Date(0);
    }
    return bookings.filter((b) => new Date(b.checkIn) >= startDate);
  };

  const filteredBookings = getFilteredBookings();

  // Prepare data for charts
  const roomTypeData = ["Standard", "Deluxe", "Suite"].map((type) => {
    const bookingsForType = filteredBookings.filter((b) => b.roomType === type);
    const count = bookingsForType.length;
    const totalRevenue = bookingsForType.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    return { room: type, count, totalRevenue };
  });

  const statusData = ["Booked", "checked-in", "confirmed", "pending"].map((status) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1).replace("-", " "),
    value: filteredBookings.filter((b) => b.status === status).length,
    color: status === "Booked" ? "#f72585" :
           status === "checked-in" ? "#22c55e" :
           status === "confirmed" ? "#3b82f6" :
           "#eab308"
  }));

  const revenueByMonth = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthName = date.toLocaleString('default', { month: 'short' });
    const monthBookings = filteredBookings.filter((b) => {
      const checkIn = new Date(b.checkIn);
      return checkIn.getMonth() === date.getMonth() && checkIn.getFullYear() === date.getFullYear();
    });
    return {
      name: monthName,
      revenue: monthBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
    };
  }).reverse();

  const avgStayByMonth = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthName = date.toLocaleString('default', { month: 'short' });
    const monthBookings = filteredBookings.filter((b) => {
      const checkIn = new Date(b.checkIn);
      return checkIn.getMonth() === date.getMonth() && checkIn.getFullYear() === date.getFullYear();
    });
    const avgStay = monthBookings.length
      ? monthBookings.reduce(
          (sum, b) => sum + Math.ceil((new Date(b.checkOut) - new Date(b.checkIn)) / (1000 * 60 * 60 * 24)),
          0
        ) / monthBookings.length
      : 0;
    return { name: monthName, avgStay: avgStay.toFixed(1) };
  }).reverse();

  const getStatusBadge = (status) => {
    const styles = {
      Booked: 'bg-pink-100 text-pink-800',
      "checked-in": 'bg-green-100 text-green-800',
      confirmed: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  // Calculate stats for cards
  const totalRevenue = filteredBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const totalBookings = filteredBookings.length;
  const uniqueGuests = new Set(filteredBookings.map((b) => b.name)).size;
  const occupiedRooms = new Set(filteredBookings.map((b) => b.roomNumber)).size;

  // Mock change percentages (replace with real data comparison in a production app)
  const revenueChange = totalRevenue > 0 ? 12.5 : 0; // Placeholder
  const bookingsChange = totalBookings > 0 ? 8.2 : 0;
  const guestsChange = uniqueGuests > 0 ? 15.8 : 0;
  const roomsChange = occupiedRooms > 0 ? -3.1 : 0;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 md:p-10 transition-all duration-1000 ${
      isLoaded ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-full shadow-md">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2V9a2 2 0 00-2-2h-2a2 2 0 00-2 2v10m0 0a2 2 0 002-2V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent">
                Booking Analytics
              </h1>
              <p className="text-gray-600 mt-2">Real-time insights into hotel booking performance</p>
            </div>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl">
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          change={revenueChange}
          icon={DollarSign}
        />
        <StatCard
          title="Total Bookings"
          value={totalBookings}
          change={bookingsChange}
          icon={Calendar}
        />
        <StatCard
          title="Unique Guests"
          value={uniqueGuests}
          change={guestsChange}
          icon={Users}
        />
        <StatCard
          title="Occupied Rooms"
          value={occupiedRooms}
          change={roomsChange}
          icon={Home}
        />
      </div>

      {/* Charts Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <AnimatedChart
          title="Revenue by Month"
          subtitle="Monthly booking revenue trends"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueByMonth}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" opacity={0.6} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#1f2937', fontSize: 12, fontWeight: 500 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#1f2937', fontSize: 12, fontWeight: 500 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  padding: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorRevenue)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </AnimatedChart>

        <AnimatedChart
          title="Average Stay Duration"
          subtitle="Average nights per booking by month"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={avgStayByMonth}>
              <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" opacity={0.6} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#1f2937', fontSize: 12, fontWeight: 500 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#1f2937', fontSize: 12, fontWeight: 500 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  padding: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="avgStay"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#22c55e', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </AnimatedChart>

        <AnimatedChart
          title="Bookings by Room Type"
          subtitle="Distribution of bookings across room types"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={roomTypeData}>
              <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" opacity={0.6} />
              <XAxis
                dataKey="room"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#1f2937', fontSize: 12, fontWeight: 500 }}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#1f2937', fontSize: 12, fontWeight: 500 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  padding: '12px',
                }}
              />
              <Legend
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#1f2937',
                }}
              />
              <Bar
                dataKey="count"
                name="Bookings"
                fill="#f72585"
                radius={[6, 6, 0, 0]}
                barSize={50}
              />
              <Bar
                dataKey="totalRevenue"
                name="Revenue (₹)"
                fill="#3b82f6"
                radius={[6, 6, 0, 0]}
                barSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </AnimatedChart>

        <AnimatedChart
          title="Booking Status Distribution"
          subtitle="Breakdown of booking statuses"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  padding: '12px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </AnimatedChart>
      </div>

      {/* Recent Bookings Table */}
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
              <p className="text-sm text-gray-500 mt-1">Latest guest bookings and details</p>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
              <span>View All</span>
            </button>
          </div>
        </div>
        {filteredBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-gray-50">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg font-semibold text-gray-600">No Bookings Available</p>
            <p className="text-sm text-gray-400 mt-2">Add bookings to see details here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-In</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.slice(0, 5).map((booking) => (
                  <tr key={booking.id} className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      BKG-{booking.id.toString().padStart(3, '0')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                          {booking.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{booking.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {booking.roomNumber} ({booking.roomType})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ₹{booking.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).replace("-", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(booking.checkIn).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
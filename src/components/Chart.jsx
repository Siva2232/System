import React, { useContext } from "react";
import { BookingContext } from "../context/BookingContext"; // Adjust path as needed
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Chart as ChartJS } from "chart.js/auto"; // Ensure Chart.js is registered for recharts

const Chart = () => {
  const { bookings } = useContext(BookingContext);

  // Prepare data for chart: bookings count and total revenue per room type
  const data = ["Standard", "Deluxe", "Suite"].map((type) => {
    const bookingsForType = bookings.filter((b) => b.roomType === type);
    const count = bookingsForType.length;
    const totalRevenue = bookingsForType.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    return { room: type, count, totalRevenue };
  });

  // Custom Tooltip for better styling
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 bg-opacity-95 text-white p-4 rounded-xl shadow-lg border border-gray-700 transition-all duration-200">
          <p className="font-semibold text-pink-400 text-lg">{label}</p>
          <p className="text-sm mt-1">Bookings: <span className="font-bold">{payload[0].value}</span></p>
          <p className="text-sm">Revenue: <span className="font-bold">₹{payload[1].value.toLocaleString()}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 md:p-10 transform transition-all duration-300 hover:shadow-3xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-full shadow-md">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2V9a2 2 0 00-2-2h-2a2 2 0 00-2 2v10m0 0a2 2 0 002-2V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">Booking Analytics</h3>
              <p className="text-sm text-gray-500 mt-1">Real-time insights into room bookings and revenue</p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-full shadow-md hover:shadow-lg transition-shadow duration-200">
            <span className="text-sm font-semibold">Total Bookings: {bookings.length}</span>
          </div>
        </div>

        {/* Chart or Empty State */}
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-2xl border border-gray-200 shadow-inner">
            <svg className="w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-xl font-semibold text-gray-600">No Bookings Available</p>
            <p className="text-sm text-gray-400 mt-2">Add bookings to visualize analytics here</p>
          </div>
        ) : (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 30, right: 40, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" opacity={0.6} />
                <XAxis
                  dataKey="room"
                  tick={{ fill: "#1f2937", fontSize: 14, fontWeight: 600 }}
                  axisLine={{ stroke: "#d1d5db" }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "#1f2937", fontSize: 14, fontWeight: 600 }}
                  axisLine={{ stroke: "#d1d5db" }}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f3f4f6", fillOpacity: 0.3 }} />
                <Legend
                  wrapperStyle={{
                    paddingTop: "20px",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#1f2937",
                  }}
                />
                <Bar
                  dataKey="count"
                  name="Bookings"
                  fill="#f72585"
                  radius={[6, 6, 0, 0]}
                  barSize={50}
                  animationDuration={1200}
                  animationEasing="ease-in-out"
                />
                <Bar
                  dataKey="totalRevenue"
                  name="Revenue (₹)"
                  fill="#3b82f6"
                  radius={[6, 6, 0, 0]}
                  barSize={50}
                  animationDuration={1200}
                  animationEasing="ease-in-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Additional Stats */}
        {bookings.length > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {data.map((item) => (
              <div
                key={item.room}
                className="bg-gradient-to-r from-gray-50 to-blue-50 p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <h4 className="font-semibold text-gray-800 text-lg mb-3">{item.room} Rooms</h4>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-medium">Bookings: {item.count}</span>
                  <span className="text-sm font-bold text-blue-700">₹{item.totalRevenue.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chart;
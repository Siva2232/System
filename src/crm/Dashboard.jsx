import React, { useContext, useState, useMemo,useEffect} from "react";
import { BookingContext } from "../context/BookingContext";
import {
  FaBed,
  FaUsers,
  FaCheck,
  FaMoneyBillWave,
  FaSearch,
  FaDownload,
  FaEye,
  FaTimes,
  FaCalendarAlt,
  FaPhone,
  FaIdCard,
  FaChartLine,
  FaStar,
} from "react-icons/fa";

const Dashboard = () => {
  const { rooms = [], bookings = [] } = useContext(BookingContext); // Default to empty arrays
  const [search, setSearch] = useState("");
  const [modalImage, setModalImage] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Stats calculation
  const totalRooms = rooms.length;
  const bookedRooms = rooms.filter((r) => r.booked).length;
  const availableRooms = totalRooms - bookedRooms;
  const occupancyRate = totalRooms ? Math.round((bookedRooms / totalRooms) * 100) : 0;

  // Total revenue from bookings
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const avgRating = bookings.length
    ? bookings.reduce((sum, b) => sum + (b.rating || 0), 0) / bookings.length
    : 0;

  // Filter bookings
  const filteredBookings = useMemo(() => {
    let filtered = bookings;

    if (selectedFilter !== "all") {
      filtered = filtered.filter((b) => (b.status || "") === selectedFilter);
    }

    if (search) {
      filtered = filtered.filter((b) =>
        [b.name || "", b.phone || "", b.aadhaar || "", b.roomType || ""]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    return filtered;
  }, [bookings, search, selectedFilter]);

  const getStatusBadge = (status) => {
    const badges = {
      "checked-in": "bg-green-100 text-green-800 border-green-200",
      upcoming: "bg-blue-100 text-blue-800 border-blue-200",
      completed: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return badges[status] || badges.completed;
  };

  const handleDownload = (file) => {
    console.log(`Downloading ${file?.name || "unknown file"}`);
  };

  const handleViewDocument = () => {
    const mockImage =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkRvY3VtZW50IFByZXZpZXc8L3RleHQ+PC9zdmc+";
    setModalImage(mockImage);
  };

 useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Hotel CRM Dashboard
          </h1>
          <p className="text-gray-600">Manage your hotel operations with ease</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Rooms</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{totalRooms}</p>
                <p className="text-blue-600 text-xs mt-1">{occupancyRate}% Occupied</p>
              </div>
              <div className="text-blue-500 text-2xl sm:text-3xl bg-blue-50 p-2 sm:p-3 rounded-lg">
                <FaBed />
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Booked Rooms</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{bookedRooms}</p>
                <p className="text-green-600 text-xs mt-1">Active Bookings</p>
              </div>
              <div className="text-green-500 text-2xl sm:text-3xl bg-green-50 p-2 sm:p-3 rounded-lg">
                <FaUsers />
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Available Rooms</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{availableRooms}</p>
                <p className="text-purple-600 text-xs mt-1">Ready to Book</p>
              </div>
              <div className="text-purple-500 text-2xl sm:text-3xl bg-purple-50 p-2 sm:p-3 rounded-lg">
                <FaCheck />
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 border-l-4 border-amber-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  ₹{totalRevenue ? totalRevenue.toLocaleString() : "0"}
                </p>
                <div className="flex items-center mt-1">
                  <FaStar className="text-yellow-400 text-xs mr-1" />
                  <p className="text-amber-600 text-xs">{avgRating.toFixed(1)} Avg Rating</p>
                </div>
              </div>
              <div className="text-amber-500 text-2xl sm:text-3xl bg-amber-50 p-2 sm:p-3 rounded-lg">
                <FaMoneyBillWave />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FaChartLine className="mr-2 text-blue-600" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button className="flex items-center justify-center p-3 sm:p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 border border-blue-200 text-sm sm:text-base">
              <FaUsers className="mr-2 text-blue-600" />
              <span className="text-blue-700 font-medium">New Booking</span>
            </button>
            <button className="flex items-center justify-center p-3 sm:p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200 border border-green-200 text-sm sm:text-base">
              <FaCheck className="mr-2 text-green-600" />
              <span className="text-green-700 font-medium">Check-in</span>
            </button>
            <button className="flex items-center justify-center p-3 sm:p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200 border border-purple-200 text-sm sm:text-base">
              <FaCalendarAlt className="mr-2 text-purple-600" />
              <span className="text-purple-700 font-medium">Schedule</span>
            </button>
            <button className="flex items-center justify-center p-3 sm:p-4 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors duration-200 border border-amber-200 text-sm sm:text-base">
              <FaChartLine className="mr-2 text-amber-600" />
              <span className="text-amber-700 font-medium">Reports</span>
            </button>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                <FaUsers className="mr-3 text-blue-600" />
                Guest Bookings
              </h2>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search guests, phone, or room..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-full"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-full sm:w-auto"
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                >
                  <option value="all">All Bookings</option>
                  <option value="checked-in">Checked In</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <FaUsers className="mx-auto text-gray-300 text-4xl mb-4" />
                <p className="text-gray-500 text-lg">No bookings found</p>
                <p className="text-gray-400">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <>
                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <div key={booking.id} className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-gray-900">{booking.name || "N/A"}</div>
                          <div className="text-xs text-gray-500 flex items-center mt-1">
                            <FaIdCard className="mr-1" />
                            {booking.aadhaar || "N/A"}
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                            booking.status ? getStatusBadge(booking.status) : "bg-gray-100 text-gray-800 border-gray-200"
                          }`}
                        >
                          {booking.status
                            ? booking.status.charAt(0).toUpperCase() +
                              booking.status.slice(1).replace("-", " ")
                            : "N/A"}
                        </span>
                      </div>
                      <div className="text-sm text-gray-900 flex items-center">
                        <FaPhone className="mr-2 text-gray-400" />
                        {booking.phone || "N/A"}
                      </div>
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center mb-1">
                          <FaCalendarAlt className="mr-1 text-gray-400" />
                          {booking.checkIn || "N/A"} to {booking.checkOut || "N/A"}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          Room {booking.roomNumber || "N/A"} ({booking.roomType || "N/A"})
                        </div>
                        <div className="text-xs text-blue-600">
                          ₹{booking.roomRate ? booking.roomRate.toLocaleString() : "N/A"}/night
                        </div>
                      </div>
                      <div className="text-sm font-bold text-gray-900">
                        Total: ₹{booking.totalAmount ? booking.totalAmount.toLocaleString() : "N/A"}
                      </div>
                      <div className="flex items-center">
                        <FaStar className="text-yellow-400 mr-1" />
                        <span className="text-sm font-medium text-gray-900">
                          {booking.rating ? booking.rating.toFixed(1) : "N/A"}
                        </span>
                      </div>
                      {booking.document && (
                        <div className="flex space-x-2">
                          <button
                            onClick={handleViewDocument}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                            title="View Document"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleDownload(booking.document)}
                            className="text-green-600 hover:text-green-800 p-1 rounded transition-colors"
                            title="Download Document"
                          >
                            <FaDownload />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <table className="hidden md:table min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                        { key: "guest", label: "Guest Details" },
                        { key: "contact", label: "Contact" },
                        { key: "dates", label: "Stay Period" },
                        { key: "room", label: "Room Details" },
                        { key: "amount", label: "Amount" },
                        { key: "status", label: "Status" },
                        { key: "document", label: "Document" },
                        { key: "rating", label: "Rating" },
                      ].map((header) => (
                        <th
                          key={header.key}
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                          {header.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {booking.name || "N/A"}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center mt-1">
                              <FaIdCard className="mr-1" />
                              {booking.aadhaar || "N/A"}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center">
                            <FaPhone className="mr-2 text-gray-400" />
                            {booking.phone || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center mb-1">
                              <FaCalendarAlt className="mr-1 text-gray-400" />
                              {booking.checkIn || "N/A"}
                            </div>
                            <div className="text-xs text-gray-500">
                              to {booking.checkOut || "N/A"}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            Room {booking.roomNumber || "N/A"}
                          </div>
                          <div className="text-xs text-gray-500">{booking.roomType || "N/A"}</div>
                          <div className="text-xs text-blue-600">
                            ₹{booking.roomRate ? booking.roomRate.toLocaleString() : "N/A"}/night
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">
                            ₹{booking.totalAmount ? booking.totalAmount.toLocaleString() : "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                              booking.status ? getStatusBadge(booking.status) : "bg-gray-100 text-gray-800 border-gray-200"
                            }`}
                          >
                            {booking.status
                              ? booking.status.charAt(0).toUpperCase() +
                                booking.status.slice(1).replace("-", " ")
                              : "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {booking.document && (
                              <>
                                <button
                                  onClick={handleViewDocument}
                                  className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                                  title="View Document"
                                >
                                  <FaEye />
                                </button>
                                <button
                                  onClick={() => handleDownload(booking.document)}
                                  className="text-green-600 hover:text-green-800 p-1 rounded transition-colors"
                                  title="Download Document"
                                >
                                  <FaDownload />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaStar className="text-yellow-400 mr-1" />
                            <span className="text-sm font-medium text-gray-900">
                              {booking.rating ? booking.rating.toFixed(1) : "N/A"}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-500 text-center">
          Showing {filteredBookings.length} of {bookings.length} bookings
        </div>
      </div>

      {/* Modal for document preview */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setModalImage(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh]">
            <button
              onClick={() => setModalImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 text-2xl"
            >
              <FaTimes />
            </button>
            <img
              src={modalImage}
              alt="Document Preview"
              className="w-full h-auto max-h-[90vh] rounded-lg shadow-2xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
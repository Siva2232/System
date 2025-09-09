import React, { useContext, useState, useMemo } from "react";
import { BookingContext } from "../context/BookingContext"; // Import the real BookingContext
import { Search, Download, Eye, X, Calendar, Phone, CreditCard, Home, DollarSign, FileText, LogOut, Mail } from "lucide-react";

const BookingList = () => {
  const { bookings, releaseRoom } = useContext(BookingContext); // Use real context
  const [search, setSearch] = useState("");
  const [modalImage, setModalImage] = useState(null);
  const [sortBy, setSortBy] = useState("checkIn");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterStatus, setFilterStatus] = useState("all");

  const handleDownload = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name || "file";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "checked-in":
        return "bg-green-100 text-green-800 border-green-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Booked": // Support status from BookingProvider
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredAndSortedBookings = useMemo(() => {
    let filtered = bookings.filter((b) => {
      const matchesSearch = [b.name, b.email, b.phone, b.aadhaar, b.roomType, b.roomNumber]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus = filterStatus === "all" || b.status === filterStatus;

      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === "roomRate" || sortBy === "totalAmount") {
        aVal = Number(aVal);
        bVal = Number(bVal);
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }, [bookings, search, sortBy, sortOrder, filterStatus]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Booking Management</h1>
              <p className="text-slate-600">Manage and track all room reservations</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                <span className="text-sm font-medium text-blue-800">Total Bookings: {bookings.length}</span>
              </div>
              <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                <span className="text-sm font-medium text-green-800">
                  Active: {bookings.filter((b) => b.status === "checked-in" || b.status === "Booked").length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, phone, Aadhaar, or room..."
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="md:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">All Status</option>
                <option value="Booked">Booked</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {filteredAndSortedBookings.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No bookings found</h3>
              <p className="text-slate-600">Try adjusting your search criteria or filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th
                      className="px-6 py-4 text-left text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-2">
                        <span>Guest Details</span>
                        {sortBy === "name" && (
                          <span className="text-blue-600">{sortOrder === "asc" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort("checkIn")}
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Duration</span>
                        {sortBy === "checkIn" && (
                          <span className="text-blue-600">{sortOrder === "asc" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort("roomNumber")}
                    >
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4" />
                        <span>Room</span>
                        {sortBy === "roomNumber" && (
                          <span className="text-blue-600">{sortOrder === "asc" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort("roomRate")}
                    >
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>Rate</span>
                        {sortBy === "roomRate" && (
                          <span className="text-blue-600">{sortOrder === "asc" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>Document</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredAndSortedBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="font-semibold text-slate-900">{booking.name}</div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail className="w-3 h-3" />
                            <span>{booking.email || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone className="w-3 h-3" />
                            <span>{booking.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <CreditCard className="w-3 h-3" />
                            <span>{booking.aadhaar}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-slate-900">
                            {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}
                          </div>
                          <div className="text-xs text-slate-500">
                            {Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24))} nights
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="font-semibold text-slate-900">Room {booking.roomNumber}</div>
                          <div className="text-sm text-slate-600">{booking.roomType}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="font-semibold text-slate-900">₹{booking.roomRate.toLocaleString()}</div>
                          <div className="text-xs text-slate-500">per night</div>
                          <div className="text-sm text-blue-600">Total: ₹{Number(booking.totalAmount || 0).toLocaleString()}</div>
                          <div className="text-sm text-blue-600">GST: ₹{Number(booking.tax || 0).toLocaleString()}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {booking.document ? (
                          <div className="flex items-center gap-2">
                            {booking.document.type && booking.document.type.startsWith("image/") ? (
                              <button
                                onClick={() => setModalImage(URL.createObjectURL(booking.document))}
                                className="group relative"
                              >
                                <img
                                  src={URL.createObjectURL(booking.document)}
                                  alt="Document preview"
                                  className="h-12 w-12 object-cover rounded-lg border border-slate-200 group-hover:shadow-md transition-shadow"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg flex items-center justify-center transition-all">
                                  <Eye className="w-4 h-4 text-white opacity-0 group-hover:opacity-100" />
                                </div>
                              </button>
                            ) : (
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <FileText className="w-4 h-4" />
                                <span>{booking.document.name || "Document"}</span>
                              </div>
                            )}
                            <button
                              onClick={() => handleDownload(booking.document)}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Download document"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400">No document</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                          {booking.status?.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "Unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => releaseRoom(booking.roomNumber)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                          <LogOut className="w-4 h-4" />
                          Release Room
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Results summary */}
        {filteredAndSortedBookings.length > 0 && (
          <div className="mt-6 text-center text-sm text-slate-600">
            Showing {filteredAndSortedBookings.length} of {bookings.length} bookings
          </div>
        )}
      </div>

      {/* Image Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setModalImage(null)}
        >
          <div className="relative max-h-full max-w-full">
            <button
              onClick={() => setModalImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={modalImage}
              alt="Document preview"
              className="max-h-full max-w-full rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingList;
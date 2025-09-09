import React, { useContext, useState } from "react";
import { BookingContext } from "../context/BookingContext";
import Bill from "../components/Bill";
import { Calendar, MapPin, User, Clock, ChevronRight, Search } from "lucide-react";

const BookingList = () => {
  const { bookings } = useContext(BookingContext);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter bookings based on search query
  const filteredBookings = bookings.filter((booking) =>
    [booking.name || "Guest", booking.roomNumber || "TBD", booking.status || ""]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  if (!bookings || bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Bookings</h1>
            <p className="text-slate-600">Manage your hotel reservations</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No bookings yet</h3>
            <p className="text-slate-600">Your bookings will appear here once you make a reservation.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Bookings</h1>
              <p className="text-slate-600">Manage your hotel reservations</p>
            </div>
            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
              {filteredBookings.length} {filteredBookings.length === 1 ? 'Booking' : 'Bookings'}
            </div>
          </div>
          {/* Search Bar */}
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, room number, or status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm text-slate-800 placeholder-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Bookings Grid */}
        <div className="space-y-6">
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No matching bookings</h3>
              <p className="text-slate-600">Try adjusting your search query.</p>
            </div>
          ) : (
            filteredBookings.map((booking, index) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-300 group"
              >
                {/* Booking Header */}
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        {booking.name ? booking.name.charAt(0).toUpperCase() : 'G'}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {booking.name || 'Guest'}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-slate-600 mt-1">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>Room {booking.roomNumber || 'TBD'}</span>
                          </div>
                          {booking.checkIn && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(booking.checkIn).toLocaleDateString()}</span>
                            </div>
                          )}
                          {booking.status && (
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                  </div>
                </div>

                {/* Booking Details & Bill */}
                <div className="p-6 bg-slate-50">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-slate-700">Billing Information</span>
                  </div>
                  
                  {/* Bill Component with enhanced styling */}
                  <div className="bg-white rounded-xl p-4 border border-slate-200">
                    <Bill bookingId={booking.id} />
                  </div>
                </div>

                {/* Additional booking details if available */}
                {(booking.guests || booking.nights || booking.roomType) && (
                  <div className="px-6 pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      {booking.guests && (
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <User className="w-4 h-4" />
                          <span>{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</span>
                        </div>
                      )}
                      {booking.nights && (
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <Clock className="w-4 h-4" />
                          <span>{booking.nights} {booking.nights === 1 ? 'Night' : 'Nights'}</span>
                        </div>
                      )}
                      {booking.roomType && (
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <MapPin className="w-4 h-4" />
                          <span>{booking.roomType}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 text-sm">
            Need help with your booking? <span className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">Contact Support</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingList;
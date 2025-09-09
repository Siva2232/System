import React, { useState, useEffect, useContext } from "react";
import { BookingContext } from "../context/BookingContext";
import { Calendar, User, Phone, CreditCard, Upload, Hotel, Check, X } from "lucide-react";

const BookingForm = () => {
  const { rooms, addBooking } = useContext(BookingContext); // Access context

  const [form, setForm] = useState({
    name: "",
    phone: "",
    aadhaar: "",
    checkIn: "",
    checkOut: "",
    roomType: "Standard",
    roomNumber: "",
    roomRate: 2500, // Default to Standard rate
    document: null,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Update roomRate when roomType changes
  useEffect(() => {
    const roomRates = {
      Standard: 2500,
      Deluxe: 3500,
      Suite: 5000,
    };
    setForm((prev) => ({
      ...prev,
      roomRate: roomRates[form.roomType],
      roomNumber: "", // Reset roomNumber when roomType changes
    }));
  }, [form.roomType]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.phone.match(/^\d{10}$/)) newErrors.phone = "Enter a valid 10-digit phone number";
    if (!form.aadhaar.match(/^\d{12}$/)) newErrors.aadhaar = "Enter a valid 12-digit Aadhaar number";
    if (!form.checkIn) newErrors.checkIn = "Check-in date is required";
    if (!form.checkOut) newErrors.checkOut = "Check-out date is required";
    if (!form.roomNumber) newErrors.roomNumber = "Please select a room";
    if (form.checkIn && form.checkOut && new Date(form.checkOut) <= new Date(form.checkIn)) {
      newErrors.checkOut = "Check-out date must be after check-in date";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    // Submit booking to context
    addBooking(form);

    // Simulate API call
    setTimeout(() => {
      setShowSuccess(true);
      setIsSubmitting(false);

      // Reset form after showing success
      setTimeout(() => {
        setShowSuccess(false);
        setForm({
          name: "",
          phone: "",
          aadhaar: "",
          checkIn: "",
          checkOut: "",
          roomType: "Standard",
          roomNumber: "",
          roomRate: 2500, // Reset to Standard rate
          document: null,
        });
        setErrors({});
      }, 3000);
    }, 2000);
  };

  const calculateNights = () => {
    if (form.checkIn && form.checkOut) {
      const checkInDate = new Date(form.checkIn);
      const checkOutDate = new Date(form.checkOut);
      const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
      return nights > 0 ? nights : 0;
    }
    return 0;
  };

  const totalAmount = form.roomRate * calculateNights();

  // Filter available rooms based on roomType and booked status
  const availableRooms = rooms.filter((r) => !r.booked && r.type === form.roomType);

  if (showSuccess) {
    return (
      <div className="max-w-lg mx-auto bg-white shadow-2xl rounded-2xl p-8 my-6 border border-gray-100">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4 animate-bounce">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">Your reservation has been successfully submitted.</p>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <p className="text-sm text-green-800">
              {/* You will receive a confirmation email shortly with your booking details. */}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-6 px-4">
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
          <div className="flex items-center space-x-3">
            <Hotel className="h-8 w-8 text-white" />
            <div>
              <h1 className="text-2xl font-bold text-white">Hotel Reservation</h1>
              <p className="text-blue-100">Book your perfect stay</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Guest Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center border-b border-gray-200 pb-2">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Guest Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    errors.name ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                  }`}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <X className="h-4 w-4 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    name="phone"
                    type="text"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="10-digit phone number"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      errors.phone ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                    }`}
                    maxLength="10"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <X className="h-4 w-4 mr-1" />
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar Number *</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  name="aadhaar"
                  type="text"
                  value={form.aadhaar}
                  onChange={handleChange}
                  placeholder="12-digit Aadhaar number"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    errors.aadhaar ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                  }`}
                  maxLength="12"
                />
              </div>
              {errors.aadhaar && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <X className="h-4 w-4 mr-1" />
                  {errors.aadhaar}
                </p>
              )}
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center border-b border-gray-200 pb-2">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Booking Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date *</label>
                <input
                  type="date"
                  name="checkIn"
                  value={form.checkIn}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    errors.checkIn ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                  }`}
                />
                {errors.checkIn && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <X className="h-4 w-4 mr-1" />
                    {errors.checkIn}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date *</label>
                <input
                  type="date"
                  name="checkOut"
                  value={form.checkOut}
                  onChange={handleChange}
                  min={form.checkIn || new Date().toISOString().split("T")[0]}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    errors.checkOut ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                  }`}
                />
                {errors.checkOut && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <X className="h-4 w-4 mr-1" />
                    {errors.checkOut}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Type *</label>
                <select
                  name="roomType"
                  value={form.roomType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 border-gray-300 hover:border-gray-400 bg-white"
                >
                  <option value="Standard">Standard Room - ₹2,500/night</option>
                  <option value="Deluxe">Deluxe Room - ₹3,500/night</option>
                  <option value="Suite">Suite - ₹5,000/night</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Number *</label>
                <select
                  name="roomNumber"
                  value={form.roomNumber}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white ${
                    errors.roomNumber ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <option value="">Select Available Room</option>
                  {availableRooms.map((room) => (
                    <option key={room.number} value={room.number}>
                      Room {room.number}
                    </option>
                  ))}
                </select>
                {errors.roomNumber && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <X className="h-4 w-4 mr-1" />
                    {errors.roomNumber}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Document (Optional)</label>
              <div className="relative">
                <Upload className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="file"
                  name="document"
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 border-gray-300 hover:border-gray-400"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Supported formats: PDF, JPG, PNG (Max 5MB)</p>
            </div>
          </div>

          {/* Booking Summary */}
          {form.checkIn && form.checkOut && form.roomNumber && calculateNights() > 0 && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Room Type:</span>
                  <span className="font-medium text-gray-900">{form.roomType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Room Number:</span>
                  <span className="font-medium text-gray-900">#{form.roomNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium text-gray-900">{calculateNights()} night(s)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Rate per night:</span>
                  <span className="font-medium text-gray-900">₹{form.roomRate.toLocaleString()}</span>
                </div>
                <div className="border-t border-blue-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                    <span className="text-xl font-bold text-blue-600">₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-600 flex items-center">
                <X className="h-4 w-4 mr-2" />
                {errors.submit}
              </p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg active:scale-95"
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing Booking...
              </div>
            ) : (
              "Confirm Reservation"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
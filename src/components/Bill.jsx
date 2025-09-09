import React, { useContext, useState, useRef } from "react";
import { FileText, Edit, Printer, Building2, User, Phone, CreditCard, Bed, Clock, Receipt, Percent, IndianRupee } from "lucide-react";
import { BookingContext } from "../context/BookingContext"; // Adjust path as needed

const Bill = ({ bookingId }) => {
  const { bookings, saveBooking } = useContext(BookingContext);
  const booking = bookings.find((b) => b.id === bookingId) || null;

  if (!booking) {
    return (
      <div className="max-w-md mx-auto mt-4">
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-2" />
          <h3 className="text-base font-semibold text-gray-900 mb-1">No Booking Found</h3>
          <p className="text-gray-500 text-sm">Please provide a valid booking ID.</p>
        </div>
      </div>
    );
  }

  const [invoice, setInvoice] = useState(booking);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoice((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    saveBooking(invoice);
    setIsEditing(false);
  };

  const grandTotal = (Number(invoice.totalAmount) || 0) - (Number(invoice.discount) || 0);
// (Number(invoice.tax) || 0)
  const billRef = useRef();
  const handlePrint = () => {
    if (billRef.current) {
      const printContent = billRef.current.innerHTML;
      const originalContent = document.body.innerHTML;
      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-white/20 p-2 rounded-lg">
                <Receipt className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Invoice</h1>
                <p className="text-blue-100 text-xs">Hotel Paradise</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                className="bg-white/20 hover:bg-white/30 transition-colors duration-200 px-3 py-1 rounded-md flex items-center space-x-1 text-xs font-medium"
              >
                <Edit className="h-3 w-3" />
                <span>{isEditing ? "Save" : "Edit"}</span>
              </button>
              <button
                onClick={handlePrint}
                className="bg-green-500 hover:bg-green-600 transition-colors duration-200 px-3 py-1 rounded-md flex items-center space-x-1 text-xs font-medium"
              >
                <Printer className="h-3 w-3" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>

        {/* Invoice Content */}
        <div ref={billRef} className="p-4">
          {/* Company Header for Print */}
          <div className="hidden print:block mb-4 text-center border-b pb-4">
            <h1 className="text-xl font-bold text-gray-800 mb-1">Hotel Paradise</h1>
            <p className="text-gray-600 text-sm">123 Main Street, City, State 12345</p>
            <p className="text-gray-600 text-sm">Phone: +91 98765 43210 | Email: info@hotelparadise.com</p>
          </div>

          {/* Invoice Details Header */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-base font-semibold text-gray-800 mb-2 flex items-center">
                  <User className="h-4 w-4 mr-1 text-blue-600" />
                  Customer Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <User className="h-3 w-3 text-gray-400 mr-2" />
                    <span className="font-medium text-gray-700">{invoice.name || "N/A"}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-3 w-3 text-gray-400 mr-2" />
                    <span className="text-gray-600">{invoice.phone || "N/A"}</span>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="h-3 w-3 text-gray-400 mr-2" />
                    <span className="text-gray-600">Aadhaar: {invoice.aadhaar || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-base font-semibold text-gray-800 mb-2 flex items-center">
                  <FileText className="h-4 w-4 mr-1 text-blue-600" />
                  Invoice Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Invoice No:</span>
                    <span className="font-semibold text-blue-600">#{invoice.id || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{invoice.createdAt || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-md text-xs font-medium">
                      {invoice.status || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Room Details */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 mb-4">
            <h3 className="text-base font-semibold text-gray-800 mb-2 flex items-center">
              <Building2 className="h-4 w-4 mr-1 text-amber-600" />
              Accommodation Details
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Bed className="h-4 w-4 text-amber-600" />
                <div>
                  <p className="text-xs text-gray-600">Room Type</p>
                  <p className="font-semibold text-sm">{invoice.roomType || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4 text-amber-600" />
                <div>
                  <p className="text-xs text-gray-600">Room Number</p>
                  <p className="font-semibold text-sm">#{invoice.roomNumber || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-amber-600" />
                <div>
                  <p className="text-xs text-gray-600">Duration</p>
                  <p className="font-semibold text-sm">{invoice.nights ? `${invoice.nights} nights` : "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <IndianRupee className="h-4 w-4 text-amber-600" />
                <div>
                  <p className="text-xs text-gray-600">Rate/Night</p>
                  <p className="font-semibold text-sm">₹{invoice.roomRate || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Billing Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-base font-semibold text-gray-800 mb-2 flex items-center">
              <Receipt className="h-4 w-4 mr-1 text-gray-600" />
              Billing Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-1 border-b border-gray-200">
                <span className="text-gray-600">
                  Room Charges ({invoice.nights || 0} nights × ₹{invoice.roomRate || 0})
                </span>
                <span className="font-medium">₹{invoice.totalAmount || 0}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-200">
                <span className="text-gray-600">Tax (12% GST)</span>
                <span className="font-medium">₹{invoice.tax || 0}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-200">
                <div className="flex items-center">
                  <Percent className="h-3 w-3 text-gray-400 mr-1" />
                  <span className="text-gray-600">Discount</span>
                </div>
                {isEditing ? (
                  <input
                    type="number"
                    name="discount"
                    value={invoice.discount || ""}
                    onChange={handleChange}
                    className="w-20 px-2 py-0.5 border border-gray-300 rounded-md text-right text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                ) : (
                  <span className="font-medium text-green-600">-₹{invoice.discount || 0}</span>
                )}
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-600">Payment Mode</span>
                {isEditing ? (
                  <select
                    name="paymentMode"
                    value={invoice.paymentMode || ""}
                    onChange={handleChange}
                    className="px-2 py-0.5 border border-gray-300 rounded-md text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="UPI">UPI</option>
                    <option value="Online">Online</option>
                  </select>
                ) : (
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md text-xs font-medium">
                    {invoice.paymentMode || "N/A"}
                  </span>
                )}
              </div>
            </div>
            {/* Grand Total */}
            <div className="mt-4 pt-2 border-t-2 border-gray-300">
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-gray-800">Grand Total</span>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">
                    ₹{grandTotal.toLocaleString("en-IN")}
                  </div>
                  <div className="text-xs text-gray-500">All taxes included</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gray-200 text-center text-gray-500 text-xs">
            <p>Thank you for choosing our services!</p>
            <p className="mt-1">Contact: info@hotelparadise.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bill;
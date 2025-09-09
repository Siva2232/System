import React, { useContext, useState,useEffect } from "react";
import { BookingContext } from "../context/BookingContext";
import { FaUpload, FaImage, FaTimes } from "react-icons/fa";

const Rooms = () => {
  const { rooms, updateRoom } = useContext(BookingContext);
  const [uploadingRoom, setUploadingRoom] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const categories = ["Standard", "Deluxe", "Suite"];
  
  // Default features for each room type
  const defaultFeatures = {
    Standard: ["Wi-Fi", "TV", "Mini Fridge"],
    Deluxe: ["Wi-Fi", "TV", "Mini Fridge", "Balcony", "Coffee Maker"],
    Suite: ["Wi-Fi", "TV", "Mini Fridge", "Balcony", "Coffee Maker", "Jacuzzi"]
  };

  const getStatusColor = (room) => {
    if (room.booked) return "border-red-200 bg-red-50";
    return "border-green-200 bg-green-50";
  };

  const getStatusIndicator = (room) => {
    if (room.booked) return "bg-red-500";
    return "bg-green-500";
  };

  const getRoomStats = () => {
    const total = rooms.length;
    const occupied = rooms.filter(r => r.booked).length;
    const available = total - occupied;
    const occupancyRate = total > 0 ? Math.round((occupied / total) * 100) : 0;
    
    return { total, occupied, available, occupancyRate };
  };

  const handleImageUpload = async (e, roomNumber) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    setUploadingRoom(roomNumber);
    try {
      // Convert file to ArrayBuffer for buffer-like handling
      const buffer = await file.arrayBuffer();
      // In a real app, you would send the buffer to a server
      // For client-side demo, we'll convert to data URL for display
      const reader = new FileReader();
      reader.onload = async () => {
        const imageData = reader.result; // Data URL for display
        await updateRoom(roomNumber, { 
          image: imageData, // Store data URL client-side (replace with server URL in production)
          imageBuffer: buffer // Store buffer for server-side use
        });
        setUploadingRoom(null);
      };
      reader.readAsDataURL(file); // For display purposes
    } catch (error) {
      console.error("Image upload failed:", error);
      setUploadingRoom(null);
      alert("Failed to upload image");
    }
  };

  const handleRemoveImage = async (roomNumber) => {
    if (window.confirm("Are you sure you want to remove this image?")) {
      await updateRoom(roomNumber, { image: null, imageBuffer: null });
    }
  };

  const handleImagePreview = (image) => {
    setPreviewImage(image);
  };

  const stats = getRoomStats();
 useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Room Management</h1>
          <p className="text-gray-600">Monitor room status, images, and features across all categories</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Rooms</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Occupied</p>
                <p className="text-2xl font-bold text-red-600">{stats.occupied}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-red-600 rounded"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-green-600">{stats.available}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-green-600 rounded"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.occupancyRate}%</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-gray-600 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Room Categories */}
        <div className="space-y-8">
          {categories.map((category) => {
            const roomsOfCategory = rooms
              .filter((r) => r.type === category)
              .sort((a, b) => a.number - b.number);

            const categoryStats = {
              total: roomsOfCategory.length,
              occupied: roomsOfCategory.filter(r => r.booked).length
            };

            return (
              <div key={category} className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Category Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <h2 className="text-lg font-semibold text-gray-900">{category} Rooms</h2>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>{categoryStats.occupied}/{categoryStats.total} occupied</span>
                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                        <span>{categoryStats.total - categoryStats.occupied} available</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Room Grid */}
                <div className="p-6">
                  {roomsOfCategory.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                      {roomsOfCategory.map((room) => (
                        <div
                          key={room.number}
                          className={`relative border-2 rounded-lg p-4 transition-all duration-200 hover:shadow-md cursor-pointer ${getStatusColor(room)}`}
                        >
                          {/* Status Indicator */}
                          <div className={`absolute top-3 right-3 w-3 h-3 rounded-full ${getStatusIndicator(room)}`}></div>
                          
                          {/* Room Image */}
                          <div className="mb-3">
                            {room.image ? (
                              <div className="relative">
                                <img
                                  src={room.image}
                                  alt={`Room ${room.number}`}
                                  className="w-full h-32 object-cover rounded-md cursor-pointer"
                                  onClick={() => handleImagePreview(room.image)}
                                />
                                <button
                                  className="absolute top-1 right-1 bg-white p-1 rounded-full shadow hover:bg-gray-100"
                                  onClick={() => handleRemoveImage(room.number)}
                                  title="Remove Image"
                                >
                                  <FaTimes className="text-red-500" />
                                </button>
                              </div>
                            ) : (
                              <div className="relative w-full h-32 bg-gray-100 rounded-md flex items-center justify-center">
                                <label
                                  htmlFor={`image-upload-${room.number}`}
                                  className="cursor-pointer flex flex-col items-center justify-center text-gray-500 hover:text-gray-700"
                                >
                                  <FaUpload className="text-xl" />
                                  <span className="text-xs mt-1">Upload Image</span>
                                </label>
                                <input
                                  id={`image-upload-${room.number}`}
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleImageUpload(e, room.number)}
                                  disabled={uploadingRoom === room.number}
                                />
                                {uploadingRoom === room.number && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Room Number */}
                          <div className="mb-3">
                            <h3 className="text-lg font-bold text-gray-900">{room.number}</h3>
                            <p className="text-sm text-gray-600">{room.type}</p>
                          </div>

                          {/* Status */}
                          <div className="space-y-2">
                            <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              room.booked 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {room.booked ? 'Occupied' : 'Available'}
                            </div>
                            
                            {room.booked && room.guest && (
                              <div className="text-xs text-gray-700">
                                <p className="font-medium truncate">{room.guest}</p>
                                {room.checkIn && room.checkOut && (
                                  <p className="text-gray-500">
                                    {new Date(room.checkIn).toLocaleDateString()} - {new Date(room.checkOut).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Room Features */}
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-700">Features:</p>
                            <ul className="text-xs text-gray-600 list-disc list-inside">
                              {(room.features || defaultFeatures[room.type] || []).map((feature, index) => (
                                <li key={index}>{feature}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <div className="w-8 h-8 bg-gray-400 rounded"></div>
                      </div>
                      <p className="text-gray-500">No {category.toLowerCase()} rooms configured</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Status Legend</h3>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Available for booking</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Currently occupied</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Under maintenance</span>
            </div>
          </div>
        </div>

        {/* Image Preview Modal */}
        {previewImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
            onClick={() => setPreviewImage(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh]">
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all"
              >
                <FaTimes className="text-gray-600" />
              </button>
              <img
                src={previewImage}
                alt="Room Preview"
                className="max-h-[85vh] max-w-full rounded-xl shadow-2xl"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms;
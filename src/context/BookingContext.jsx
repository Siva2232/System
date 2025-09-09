// import React, { createContext, useState } from "react";

// export const BookingContext = createContext();

// export const BookingProvider = ({ children }) => {
//   const totalRooms = Array.from({ length: 15 }, (_, i) => ({
//     number: i + 1,
//     booked: false,
//     type: i < 5 ? "Standard" : i < 10 ? "Deluxe" : "Suite",
//   }));

//   const [rooms, setRooms] = useState(totalRooms);
//   const [bookings, setBookings] = useState([]);

//   const addBooking = (booking) => {
//     // convert roomNumber to number, because form gives string
//     const selectedRoom = rooms.find(
//       (r) => r.number === Number(booking.roomNumber) && !r.booked
//     );

//     if (!selectedRoom) {
//       alert(`Room ${booking.roomNumber} is not available!`);
//       return;
//     }

//     // mark that exact room booked
//     setRooms((prev) =>
//       prev.map((r) =>
//         r.number === selectedRoom.number ? { ...r, booked: true } : r
//       )
//     );

//     // save booking
//     setBookings((prev) => [
//       ...prev,
//       { ...booking, id: prev.length + 1, roomNumber: selectedRoom.number },
//     ]);
//   };

//   const releaseRoom = (roomNumber) => {
//     setRooms((prev) =>
//       prev.map((r) =>
//         r.number === roomNumber ? { ...r, booked: false } : r
//       )
//     );
//     setBookings((prev) => prev.filter((b) => b.roomNumber !== roomNumber));
//   };

//   return (
//     <BookingContext.Provider
//       value={{ rooms, bookings, addBooking, releaseRoom }}
//     >
//       {children}
//     </BookingContext.Provider>
//   );
// };


import React, { createContext, useState } from "react";

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  // Define room rates for each room type
  const roomRates = {
    Standard: 2500,
    Deluxe: 3500,
    Suite: 5000,
  };

  const totalRooms = Array.from({ length: 15 }, (_, i) => ({
    number: i + 1,
    booked: false,
    type: i < 5 ? "Standard" : i < 10 ? "Deluxe" : "Suite",
    rate: i < 5 ? 2500 : i < 10 ? 3500 : 5000, // Add rate to rooms
  }));

  const [rooms, setRooms] = useState(totalRooms);
  const [bookings, setBookings] = useState([]);

  const addBooking = (booking) => {
    // Convert roomNumber to number, because form gives string
    const selectedRoom = rooms.find(
      (r) => r.number === Number(booking.roomNumber) && !r.booked
    );

    if (!selectedRoom) {
      alert(`Room ${booking.roomNumber} is not available!`);
      return;
    }

    // Calculate totalAmount based on stay duration and room rate
    const checkInDate = new Date(booking.checkIn);
    const checkOutDate = new Date(booking.checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalAmount = nights * (selectedRoom.rate || roomRates[selectedRoom.type]);

    // Create booking with all required properties
    const newBooking = {
      id: bookings.length + 1,
      roomNumber: selectedRoom.number,
      roomType: selectedRoom.type,
      roomRate: selectedRoom.rate || roomRates[selectedRoom.type],
      totalAmount,
      name: booking.name || "Unknown Guest",
      phone: booking.phone || "N/A",
      aadhaar: booking.aadhaar || "N/A",
      checkIn: booking.checkIn || new Date().toISOString().split("T")[0],
      checkOut: booking.checkOut || new Date().toISOString().split("T")[0],
      status: booking.status || "Booked",
      document: booking.document || null,
      rating: booking.rating || 0,
    };

    // Mark the room as booked
    setRooms((prev) =>
      prev.map((r) =>
        r.number === selectedRoom.number ? { ...r, booked: true } : r
      )
    );

    // Save booking
    setBookings((prev) => [...prev, newBooking]);
  };

  const releaseRoom = (roomNumber) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.number === roomNumber ? { ...r, booked: false } : r
      )
    );
    setBookings((prev) => prev.filter((b) => b.roomNumber !== roomNumber));
  };

  return (
    <BookingContext.Provider
      value={{ rooms, bookings, addBooking, releaseRoom }}
    >
      {children}
    </BookingContext.Provider>
  );
};
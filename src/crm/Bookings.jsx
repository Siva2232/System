import React,{useEffect} from "react";
import BookingList from "../components/BookingList";

const Bookings = () => {
   useEffect(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, []);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Bookings</h1>
      
      <BookingList />
    </div>
  );
};

export default Bookings;

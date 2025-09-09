import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-600 to-pink-400 text-white py-20 px-6 md:px-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Welcome to Hotel Management CRM
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Streamline your hotel bookings, track guests, and manage operations efficiently with our modern CRM system.
          </p>
          <Link
            to="/crm/dashboard"
            className="bg-white text-pink-600 font-semibold px-6 py-3 rounded shadow hover:bg-gray-100 transition"
          >
            Explore CRM
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 md:px-20 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-gray-50 p-6 rounded shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
            <p>Manage bookings efficiently with an intuitive interface and real-time updates.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Guest Management</h3>
            <p>Track guest information, preferences, and history in one place.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Reports & Analytics</h3>
            <p>Get insights into occupancy, revenue, and overall performance.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

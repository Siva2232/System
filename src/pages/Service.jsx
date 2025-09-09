import React from "react";

const Service = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-6 md:px-20 py-20">
      <section className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-12 text-center">Our Services</h1>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">Booking Management</h2>
            <p>Streamline guest reservations with an easy-to-use booking interface.</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">Guest Profiles</h2>
            <p>Keep detailed records of guest preferences, history, and stays.</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">Analytics & Reports</h2>
            <p>Get insights on occupancy, revenue, and guest trends in real-time.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Service;

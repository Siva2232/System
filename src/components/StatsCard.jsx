import React from "react";

const StatsCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white shadow rounded-lg p-5 flex items-center gap-4">
      <div className="text-pink-600 text-3xl">{icon}</div>
      <div>
        <p className="text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;

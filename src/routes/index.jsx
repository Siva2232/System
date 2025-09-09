import { createBrowserRouter } from "react-router-dom";

// Layouts
import Layout from "../layouts/Layout";
import CRMLayout from "../layouts/CRMLayout";

// Pages
// import Home from "../pages/Home";
// import About from "../pages/About";
// import Service from "../pages/Service";
// import Contact from "../pages/Contact";
import Login from "../pages/Login";

// CRM Pages
import Dashboard from "../crm/Dashboard";
import AddBooking from "../crm/AddBooking";
import Bookings from "../crm/Bookings";

import Reports from "../crm/Reports";
import Rooms from "../crm/Rooms";
import BookingList from "../crm/BookingList";

export const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "login", element: <Login /> },
  {
    path: "/crm",
    element: <CRMLayout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "rooms", element: <Rooms /> },   // ✅ fixed
      { path: "add-booking", element: <AddBooking /> },
      { path: "bill", element: <BookingList /> },
      { path: "bookings", element: <Bookings /> },
      { path: "reports", element: <Reports /> },
    ],
  },
  { 
    path: "*", 
    element: <h1 className="text-center mt-20 text-3xl">404 - Page Not Found</h1> 
  },
]);

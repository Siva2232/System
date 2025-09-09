import React, { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 md:px-20 py-20">
      <section className="max-w-2xl mx-auto bg-white shadow rounded-lg p-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-pink-500"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-pink-500"
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-pink-500"
            rows="5"
            required
          />
          <button className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition">
            Send Message
          </button>
        </form>
      </section>
    </div>
  );
};

export default Contact;

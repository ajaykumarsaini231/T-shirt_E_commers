"use client";

import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quary-messages/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

    
      const data = await res.json();

      if (res.ok) {
        setStatus("Message sent successfully!");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus(
          ` Error: ${data.errors ? data.errors.join(", ") : data.error || "Something went wrong"}`
        );
      }
    } catch (error) {
      setStatus("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 px-4 md:px-12">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md border">
        {/* Heading */}
        <div className="mb-8 text-center">
          <h3 className="text-sm font-semibold text-gray-500 tracking-wide uppercase">
            Leave a Message
          </h3>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mt-2">
            We love to hear from You
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <textarea
              name="message"
              placeholder="Your Message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none resize-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              required
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-8 py-3 bg-sky-600 text-white rounded-md font-semibold hover:bg-sky-700 transition-colors"
            >
              {loading ? "Sending..." : "Submit"}
            </button>
          </div>
        </form>

        {status && (
          <p className="text-center mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
            {status}
          </p>
        )}
      </div>
    </section>
  );
}

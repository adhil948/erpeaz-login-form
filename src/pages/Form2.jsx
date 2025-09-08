import React, { useState } from "react";
import axios from "axios";

const Form2 = () => {
  const [siteName, setSiteName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const id = localStorage.getItem("componyId");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!siteName.trim()) {
      setError("Site name is required!");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/addsiteurl/${id}`,
        { site_url: siteName }
      );
      console.log("sitename response", res);
      setMessage(res.data.message || "Site created successfully ✅");
    } catch (err) {
      console.log("error in sitename", err);
      setError(err.response?.data?.message || "Something went wrong ❌");
    }
  };

  return (
    <div className="flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center">
          <h2 className="font-bold text-lg text-center">Enter Site Name</h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 w-full">
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="siteName"
          >
            Site Name
          </label>
          <div className="mt-2 flex flex-col items-center gap-3">
            {/* ✅ Input with constant domain suffix */}
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-full max-w-md">
              <input
                id="siteName"
                name="site_url"
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="flex-1 px-3 py-2 focus:outline-none text-center"
                placeholder="sitename"
              />
              <span className="px-3 py-2 bg-gray-100 text-black-600 font-bold text-sm border-l">
                .webeaz.in
              </span>
            </div>

            {!siteName && !error && !message && (
    <p className="text-gray-500 text-sm mt-1 italic">
      Enter a site name (5-32 chars, lowercase letters, numbers, hyphens).
    </p>
  )}

              {/* ✅ Show messages under the field */}
          {error && (
            <p className="text-red-600 text-sm mt-2 font-medium">{error}</p>
          )}
          {message && !error && (
            <p className="text-green-600 text-sm mt-2 font-medium">{message}</p>
          )}

            {/* ✅ Centered Button */}
            <button
              type="submit"
              className="bg-[#0775BA] text-white px-2 py-1  rounded-lg hover:bg-sky-700 outline-sky-700 focus:outline-2 "
            >
              Check Availability
            </button>
          </div>        
        </form>
      </div>
    </div>
  );
};

export default Form2;

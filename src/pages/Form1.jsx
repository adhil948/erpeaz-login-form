import React, { useState, forwardRef, useImperativeHandle } from "react";
import axios from "axios"
import { GrFormView } from "react-icons/gr";


const Countrys = [
  { index: 0, value: "India" },
  { index: 1, value: "Uae" },
  { index: 2, value: "Saudi Arabia" },
  { index: 3, value: "Uk" },
  { index: 4, value: "Usa" },
  { index: 5, value: "Japan" }
];

const PLans = [
  { index: 0, value: "Basic" },
  { index: 1, value: "Professional" },
  { index: 2, value: "Premium" },
  { index: 3, value: "Ultimate" },
  { index: 4, value: "Enterprise" }
];

const users = [
  { index: 0, value: 1 },
  { index: 1, value: 3 },
  { index: 2, value: 5 },
  { index: 3, value: 10 },
  { index: 4, value: 12 },
  { index: 5, value: 15 }
];

const Form1 = forwardRef(({ onSubmit }, ref) => {
  const [formData, setFormData] = useState({
    name: "",
    user_name: "",
    company_name: "",
    email: "",
    password: "",
    country: "",
    phone_number: "",
    plan: "",
    user: "",
    company_address: ""
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);



  console.log("url0", `${import.meta.env.VITE_API_URL}`);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    console.log("Form data:", formData);
    const newError = {};
    if (!formData.name) {
      newError.name = "name is required"
    }
    if (!formData.user_name) {
      newError.user_name = "username  is required"
    }
    if (!formData.company_name) {
      newError.company_name = "compony name  is required"
    }
    if (!formData.email) {
      newError.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newError.email = 'Invalid email format';
    }
    if (!formData.password) {
      newError.password = "password is required"
    }
    if (!formData.phone_number) {
      newError.phone_number = "phone number is required"
    } else if (!/^\d{10}$/.test(formData.phone_number)) {
      newError.phone_number = "invalid phone number formate"
    }

    setErrors(newError);
    console.log("errr", newError);

    try {
      if (Object.keys(newError).length === 0) {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/addcompony`,
          formData
        );

        const companyId = response.data?.data?._id;
        if (companyId) {
          localStorage.setItem("componyId", companyId);
          console.log("Company added successfully", response.data);
        }


        if (onSubmit) {
          onSubmit(formData); // ✅ Pass data up to Registration
        }
      }

    } catch (error) {
      console.error("Error adding company:", error);
    }
  };

  // ✅ Only ONE useImperativeHandle
  useImperativeHandle(ref, () => ({
    submitForm: () => handleSubmit()
  }));

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };



  return (
    <>
      <h3 className="text-lg font-semibold text-left mb-4">Profile Information</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-left text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-sky-700 focus:outline-2 "
          />
          {errors.name && <p style={{ color: 'red', fontSize: "14px", textAlign: "left" }}>{errors.name}</p>}
        </div>

        {/* User Name */}
        <div>
          <label className="block text-sm font-medium text-left text-gray-700 mb-1">User Name</label>
          <input
            type="text"
            name="user_name"
            value={formData.user_name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-sky-700 focus:outline-2 "
          />
          {errors.name && <p style={{ color: 'red', fontSize: "14px", textAlign: "left" }}>{errors.user_name}</p>}

        </div>

        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-left text-gray-700 mb-1">Company Name</label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-sky-700 focus:outline-2 "
          />
          {errors.company_name && <p style={{ color: 'red', fontSize: "14px", textAlign: "left" }}>{errors.company_name}</p>}

        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-left text-gray-700 mb-1">E-mail</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-sky-700 focus:outline-2 "
          />
          {errors.email && <p style={{ color: 'red', fontSize: "14px", textAlign: "left" }}>{errors.email}</p>}

        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-left text-gray-700 mb-1">
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              onChange={handleChange}
              name="password"
              minLength="8"
              maxLength="20"
              value={formData.password}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 outline-sky-700 focus:outline-2"
            />

            <GrFormView onClick={handleTogglePasswordVisibility} className="font-size-lg flex justify-end p-0 absolute right-3 top-1/2 -translate-y-1/2" />

          </div>

          {errors.password && (
            <p style={{ color: 'red', fontSize: "14px", textAlign: "left" }}>
              {errors.password}
            </p>
          )}
        </div>


        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-left text-gray-700 mb-1">Country</label>
          <select onChange={handleChange} name="country" value={formData.country} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-sky-700 focus:outline-2 ">
            <option className="text-center" value="">Select Country</option>
            {Countrys.map((item, index) => (
              <option key={index} value={item.value}>
                {item.value}
              </option>
            ))}
          </select>
        </div>

        {/* Phone No */}
        <div>
          <label className="block text-sm font-medium text-left text-gray-700 mb-1">Phone No.</label>
          <input
            type="tel"
            onChange={handleChange}
            name="phone_number"
            value={formData.phone_number}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-sky-700 focus:outline-2 "
          />
          {errors.phone_number && <p style={{ color: 'red', fontSize: "14px", textAlign: "left" }}>{errors.phone_number}</p>}

        </div>

        {/* Plan */}
        <div>
          <label className="block text-sm font-medium text-left text-gray-700 mb-1">Plan</label>
          <select onChange={handleChange} name="plan" value={formData.plan} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-sky-700 focus:outline-2 ">
            <option className="text-center" value="">Select Plan</option>
            {PLans.map((item, index) => (
              <option key={index} value={item.value}>
                {item.value}
              </option>
            ))}
          </select>
        </div>

        {/* No. of Users */}
        <div>
          <label className="block text-sm font-medium text-left text-gray-700 mb-1">No. Of Users</label>
          <select onChange={handleChange} name="user" value={formData.users} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-sky-700 focus:outline-2 ">
            <option className="text-center" value="">Select Users</option>
            {users.map((item, index) => (
              <option key={index} value={item.value}>
                {item.value}
              </option>
            ))}
          </select>
        </div>




        {/* Company Address */}
        <div className="sm:col-span-2 lg:col-span-3">
          <label className="block text-sm font-medium text-left text-gray-700 mb-1">Company Address</label>
          <input
            type="text"
            onChange={handleChange}
            name="company_address"
            value={formData.company_address}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-sky-700 focus:outline-2 "
          />
        </div>
      </form>
    </>
  )
})


export default Form1
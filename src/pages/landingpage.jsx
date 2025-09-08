import React, { useState, useRef } from "react";
import { User, Globe, Building } from "lucide-react"; // ✅ using lucide-react icons
import Logo from "../assets/erp_logo_new.png";
import Form1 from "../pages/Form1";
import Form2 from "../pages/Form2";
import FinalForm from "../pages/finalForm";

const Registration = () => {
  const [step, setStep] = useState(0);
  const formRef = useRef();

  const steps = [
    { label: "Personal Details", icon: <User className="w-5 h-5" /> },
    { label: "Site Creation", icon: <Globe className="w-5 h-5" /> },
    { label: "Company Creation", icon: <Building className="w-5 h-5" /> },
  ];

  const handleFormSubmit = (formData) => {
    console.log("Form data received in landing page:", formData);
    setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
  };

  const nextStep = () => {
    if (step === 0) {
      if (formRef.current) {
        formRef.current.submitForm();
      }
    } else {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }
  };

  const prevStep = () => setStep((prev) => (prev > 0 ? prev - 1 : prev));

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 py-4 px-2 sm:px-6">
      <div className="bg-white shadow-lg rounded-lg sm:rounded-xl p-6 w-full max-w-5xl">
        {/* ✅ Logo */}
        <div className="flex items-center gap-4 mb-6">
          <img
            src={Logo}
            alt="ERP Logo"
            className="w-28 sm:w-32 md:w-36 h-auto"
          />
        </div>

        {/* ✅ Stepper Navigation */}
        <div className="flex border-b mb-6 overflow-x-auto">
          {steps.map((stepData, index) => (
            <div
              key={index}
              className={`flex-1 text-center py-2 border-b-2 cursor-pointer transition ${
                step === index
                  ? "border-orange-500 text-orange-500 font-semibold"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setStep(index)}
            >
              {/* 👇 Mobile → Only Icon */}
              <div className="flex justify-center sm:hidden">{stepData.icon}</div>

              {/* 👇 Desktop → Show Text */}
              <span className="hidden sm:inline">{stepData.label}</span>
            </div>
          ))}
        </div>

        {/* ✅ Dynamic Forms */}
        {step === 0 && <Form1 ref={formRef} onSubmit={handleFormSubmit} />}
        {step === 1 && <Form2 />}
        {step === 2 && (
          <FinalForm
          />
        )}

        {/* ✅ Navigation Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          {step > 0 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-4 sm:px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={nextStep}
            className="px-4 sm:px-4 py-2 bg-[#0775BA] text-white rounded-lg hover:bg-sky-700"
          >
            {step === steps.length - 1 ? "Finish" : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Registration;

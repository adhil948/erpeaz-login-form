import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, CheckCircle, Circle } from "lucide-react"; // spinner + icons


const topMessages = [
  "⚠️ Please don’t refresh the page, this is a one-time process.",
  "⏳ Site setup may take a few minutes.",
  "🔒 Do not close the tab until the setup completes.",
  "💡 Sit back and relax, your site is being prepared."
];


const stepsConfig = [
  {
    id: "site",
    label: "Site created",
    sub: [
      "Writing site_config.json…",
      "Provisioning tenant DB…",
      "Resolving assets manifest…",
    ],
  },
  {
    id: "company",
    label: "Company created",
    sub: [
      "Creating org structure…",
      "Registering domain entities…",
      "Linking internal records…",
    ],
  },
  {
    id: "apps",
    label: "Installing apps",
    sub: [
      "Fetching app registry…",
      "Extracting dependencies…",
      "Syncing modules…",
    ],
  },
  {
    id: "users",
    label: "Creating users",
    sub: [
      "Generating credentials…",
      "Assigning roles…",
      "Encrypting passwords…",
    ],
  },
  {
    id: "permissions",
    label: "Giving permissions",
    sub: [
      "Applying ACL rules…",
      "Propagating policies…",
      "Syncing permission matrix…",
    ],
  },
  {
    id: "done",
    label: "Setup successful!",
    sub: [],
  },
];

const FinalForm = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Starting site creation...");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [siteName, setSiteName] = useState(null);
  const [taskId, setTaskId] = useState(null);

  const [currentStep, setCurrentStep] = useState(0);
  const [currentSubtext, setCurrentSubtext] = useState("");

  const [currentTopMessage, setCurrentTopMessage] = useState(topMessages[0]);


  const id = localStorage.getItem("componyId");


  useEffect(() => {
  if (!loading) return;

  const interval = setInterval(() => {
    const random = topMessages[Math.floor(Math.random() * topMessages.length)];
    setCurrentTopMessage(random);
  }, 8000); // every 8 seconds

  return () => clearInterval(interval);
}, [loading]);


  // ⏳ Progress bar simulation
  useEffect(() => {
    if (!loading) return;

    let val = 0;
    const interval = setInterval(() => {
      if (val < 95) {
        val += 1;
        setProgress(val);
      }
    }, 3000); // ~3s per 1%, ~5min to reach 95%

    return () => clearInterval(interval);
  }, [loading]);

  // 🔄 Rotate subtexts
  useEffect(() => {
    if (!loading) return;

    const subInterval = setInterval(() => {
      const subs = stepsConfig[currentStep]?.sub || [];
      if (subs.length > 0) {
        const random = subs[Math.floor(Math.random() * subs.length)];
        setCurrentSubtext(random);
      }
    }, 3000); // change every 3s

    return () => clearInterval(subInterval);
  }, [currentStep, loading]);

  // 🚀 Start process on mount
  useEffect(() => {
    if (!id) {
      setError(true);
      setMessage("Company ID not found.");
      setLoading(false);
      return;
    }


    //demo check only

axios.post(`${import.meta.env.VITE_API_URL}/createnewsite/${id}`)
  .then((res) => {
    if (res.status === 200 && res.data.taskId) {
      setTaskId(res.data.taskId);   // ✅ use backend’s taskId
      setMessage("⚡ Site building started...");
      setCurrentStep(0);
    } else {
      throw new Error("No taskId returned from backend");
    }
  })
  .catch((err) => {
    setError(true);
    setMessage(err.message || "❌ Failed to start site creation.");
    setLoading(false);
  });



    // // Step 1: POST to start site creation
    // axios
    //   .post(`${import.meta.env.VITE_API_URL}/createnewsite/${id}`)
    //   .then((res) => {
    //     if (res.status === 200 && res.data.taskId) {
    //       setMessage("⚡ Site building started...");
    //       setTaskId(res.data.taskId);
    //       setCurrentStep(0); // start with step 0
    //     } else {
    //       throw new Error("Failed to start site creation");
    //     }
    //   })
    //   .catch((err) => {
    //     setError(true);
    //     setMessage(
    //       err.response?.data?.message ||
    //         err.message ||
    //         "❌ Failed to start site creation."
    //     );
    //     setLoading(false);
    //   });
  }, [id]);

  // 📡 Poll backend for final completion
useEffect(() => {
  if (!taskId) return;

  const poll = setInterval(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/status/${taskId}`)
      .then((res) => {
        if (res.data.status === "completed") {
          // Fast-forward all remaining steps
          setCurrentStep(stepsConfig.length - 1);
          setProgress(100);
          setSuccess(true);
          setMessage("✅ Site created successfully!");
          setSiteName(res.data.siteName);
          setLoading(false);
          clearInterval(poll);
        } else if (res.data.status === "failed") {
          setError(true);
          setProgress(100);
          setMessage("❌ Site creation failed.");
          setLoading(false);
          clearInterval(poll);
        } else {
          // Otherwise continue simulating steps
          setCurrentStep((prev) =>
            prev < stepsConfig.length - 2 ? prev + 1 : prev
          );
        }
      })
      .catch(() => {
        // Ignore network errors and continue polling
      });
  }, 1000*40); // poll every 5s

  return () => clearInterval(poll);
}, [taskId]);


  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
      {/* Loader */}
{loading && (
<div className="absolute inset-0 flex flex-col justify-start items-center bg-white z-50 p-16 pt-24">

      {/* Rotating top message */}
    <p className="text-center text-gray-600 mb-4 font-medium text-lg">
      {currentTopMessage}
    </p>



    {/* Wide Progress bar */}
    <div className="w-96 h-4 bg-gray-300 rounded-full overflow-hidden mb-8">
      <div
        className="h-4 bg-blue-500 transition-all duration-500"
        style={{ width: `${progress}%` }}
      ></div>
    </div>

    {/* Steps */}
    <div className="space-y-6 w-full max-w-md text-left">
      {stepsConfig.map((step, index) => (
        <div key={step.id}>
          <div className="flex items-center space-x-3">
            {index < currentStep ? (
              <CheckCircle className="text-green-500 w-6 h-6" />
            ) : index === currentStep ? (
              <Loader2 className="animate-spin text-blue-500 w-6 h-6" />
            ) : (
              <Circle className="text-gray-400 w-6 h-6" />
            )}
            <span className="text-lg font-medium text-gray-800">{step.label}</span>
          </div>
          {index === currentStep && currentSubtext && (
            <p className="ml-9 text-sm text-gray-500">{currentSubtext}</p>
          )}
        </div>
      ))}
    </div>
  </div>
)}


      {/* Error message */}
      {!loading && error && (
        <div className="text-red-600 text-center text-lg">{message}</div>
      )}

      {/* Success message */}
      {!loading && success && (
        <div className="flex flex-col items-center space-y-4">
          <div className="text-green-600 text-center text-lg">{message}</div>
          {siteName && (
            <button
              onClick={() => window.open(`http://${siteName}`, "_blank")}
              className="px-6 py-2 bg-[#1D76BC] text-white rounded-lg shadow hover:bg-sky-800 transition"
            >
              Visit Your Site
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FinalForm;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, CheckCircle, Circle } from "lucide-react"; // spinner + icons


const topMessages = [
  "⚠️ Please don’t refresh the page, this is a one-time process.",
  "⏳ Site setup may take a few minutes!",
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



function Timeline({ steps, currentStep }) {
  return (
    <div className="relative w-full max-w-md py-8">
      {steps.map((step, idx) => (
        <div key={step.id} className="relative flex items-start mb-8">
          {/* Animated vertical line */}
          {idx < steps.length - 1 && (
            <div 
              className={`absolute left-5 top-8 w-1 ${
                idx < currentStep
                  ? "h-12 bg-green-500 transition-all duration-500"
                  : idx === currentStep
                  ? "h-6 bg-blue-500 animate-pulse"
                  : "h-12 bg-gray-700"
              }`}
            />
          )}
          
          {/* Step Circle */}
          <span className={`flex items-center justify-center w-10 h-10 rounded-full border-2 absolute left-0 ${
            idx < currentStep ? "bg-green-500 text-white border-green-500" :
            idx === currentStep ? "bg-white border-blue-500 animate-spin" : 
            "bg-gray-900 text-gray-400 border-gray-700"
          }`}>
            {idx < currentStep
              ? <CheckCircle className="w-6 h-6" />
              : idx === currentStep
                ? <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                : <span className="w-3 h-3 rounded-full bg-gray-700 block"></span>
            }
          </span>
          
          {/* Step Content */}
          <div className="ml-16">
            <div className={`font-semibold text-base ${
              idx === currentStep ? "text-blue-400" :
              idx < currentStep ? "text-gray-100" : "text-gray-400"
            }`}>{step.label}</div>
            <div className="text-sm text-gray-400 mt-1">{step.subtext}</div>
          </div>
        </div>
      ))}
    </div>
  );
}


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


  // Call this when backend status is "completed"
// const walkStepsToCompletion = () => {
//   let s = currentStep;
//   const interval = setInterval(() => {
//     if (s < stepsConfig.length - 1) {
//       s += 1;
//       setCurrentStep(s);

//       // Optionally, animate the progress bar
//       const stepPercent = Math.round(((s + 1) / stepsConfig.length) * 100);
//       setProgress(stepPercent);

//       // Set a random subtext for each step
//       const subs = stepsConfig[s]?.sub || [];
//       if (subs.length > 0) {
//         setCurrentSubtext(subs[Math.floor(Math.random() * subs.length)]);
//       } else {
//         setCurrentSubtext('');
//       }
//     } else {
//       clearInterval(interval);
//       setProgress(100);
//       setSuccess(true);
//       setMessage("✅ Site created successfully!");
//       setLoading(false);
//     }
//   }, 500); // 500ms per step (tweak as you like)
// };



  useEffect(() => {
  if (!loading) return;

  const interval = setInterval(() => {
    const random = topMessages[Math.floor(Math.random() * topMessages.length)];
    setCurrentTopMessage(random);
  }, 8000); // every 8 seconds

  return () => clearInterval(interval);
}, [loading]);


  // ⏳ Progress bar simulation
  // useEffect(() => {
  //   if (!loading) return;

  //   let val = 0;
  //   const interval = setInterval(() => {
  //     if (val < 95) {
  //       val += 1;
  //       setProgress(val);
  //     }
  //   }, 3000); // ~3s per 1%, ~5min to reach 95%

  //   return () => clearInterval(interval);
  // }, [loading]);

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
    if (res.status === 200 ) {
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
    }, [id]);



    // Step 1: POST to start site creation
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
  // }, [id]);

  // 📡 Poll backend for final completion
// useEffect(() => {
//   if (!id) return;

//   const poll = setInterval(() => {
//     axios
//       .get(`${import.meta.env.VITE_API_URL}/status/${id}`)
//       .then((res) => {
// if (res.data.status === "completed") {
//   // Fast-forward all remaining steps -- instead, walk through steps for aesthetics
//   walkStepsToCompletion();
//   setSiteName(res.data.siteName);
//   clearInterval(poll);
// }
//  else if (res.data.status === "failed") {
//           setError(true);
//           setProgress(100);
//           setMessage("❌ Site creation failed.");
//           setLoading(false);
//           clearInterval(poll);
//         } else {
//           // Otherwise continue simulating steps
//           setCurrentStep((prev) =>
//             prev < stepsConfig.length - 2 ? prev + 1 : prev
//           );
//         }
//       })
//       .catch(() => {
//         // Ignore network errors and continue polling
//       });
//   }, 1000*10); // poll every 5s

//   return () => clearInterval(poll);
// }, [id]);


useEffect(() => {
  if (!id) return;

  const poll = setInterval(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/status/${id}`)
      .then((res) => {
        const { status, label, siteName } = res.data;

        // Find step index from status
        const stepIndex = stepsConfig.findIndex(s => s.id === status);

        if (stepIndex !== -1) {
          setCurrentStep(stepIndex);
          // setProgress(Math.round(((stepIndex + 1) / stepsConfig.length) * 100));
          setProgress(prev => {
  const next = Math.round(((stepIndex + 1) / stepsConfig.length) * 100);
  return next > prev ? next : prev; // always moves forward
});


          // Rotate subtext for current step
          const subs = stepsConfig[stepIndex]?.sub || [];
          if (subs.length > 0) {
            setCurrentSubtext(subs[Math.floor(Math.random() * subs.length)]);
          } else {
            setCurrentSubtext("");
          }
        }

        if (status === "done") {
          setSuccess(true);
          setSiteName(siteName);
          setMessage("✅ Site created successfully!");
          setLoading(false);
          clearInterval(poll);
        }
      })
      .catch(() => {
        // ignore errors
      });
  }, 1000*5);

  return () => clearInterval(poll);
}, [id]);




  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
      {/* Loader */}
{loading && (
<div className="absolute inset-0 flex flex-col justify-start items-center bg-white z-50 p-16 pt-24">



{/* <div class="mb-1 text-base font-medium dark:text-white">Small</div>
<div class="w-full bg-gray-200 rounded-full h-1.5 mb-4 dark:bg-gray-700">
  <div class="bg-blue-600 h-1.5 rounded-full dark:bg-blue-500" style="width: 45%"></div>
</div> */}


{/* Animated Gradient Progress Bar */}
<div
  className="w-full max-w-xl mb-6"
  role="progressbar"
  aria-valuemin={0}
  aria-valuemax={100}
  aria-valuenow={progress}
  aria-label="Site setup progress"
>
  <div className="relative h-2 w-full rounded-full bg-gray-200 overflow-hidden">
    {/* Fill */}
    <div
      className="absolute inset-y-0 left-0 rounded-r-full transition-[width] duration-600 ease-out"
      style={{
        width: `${progress}%`,
        background: 'linear-gradient(90deg, #F97316, #F59E0B)',
      }}
    />
    {/* Animated stripes overlay (subtle) */}
    <div
      className="absolute inset-y-0 left-0 rounded-r-full pointer-events-none mix-blend-overlay opacity-60"
      style={{
        width: `${progress}%`,
        background:
          'repeating-linear-gradient(45deg, rgba(255,255,255,0.35) 0 12px, rgba(255,255,255,0.1) 12px 24px)',
        backgroundSize: '24px 24px',
        animation: 'barberpole 1.2s linear infinite',
      }}
    />
  </div>
  <div className="mt-2 text-right text-sm text-gray-600 font-medium">{progress}%</div>

  <style jsx>{`
    @keyframes barberpole {
      0% { background-position: 0 0; }
      100% { background-position: 24px 0; }
    }
  `}</style>
</div>


{/* Simple Step List */}
<ul className="w-full max-w-xl bg-white border border-gray-200 rounded-lg p-4">
  {stepsConfig.map((step, idx) => {
    const done = idx < currentStep;
    const active = idx === currentStep;
    return (
      <li key={step.id} className="flex items-start py-3">
        {/* Dot */}
        <span
          className={[
            "mt-1 w-3 h-3 rounded-full shrink-0",
            done
              ? "bg-orange-500"
              : active
              ? "bg-blue-600 ring-4 ring-blue-100"
              : "bg-gray-300",
          ].join(" ")}
        />
{/* Label + subtext (no shift) */}
<div className="ml-3">
  <div
    className={[
      "text-sm font-medium leading-5",
      active ? "text-blue-700" : done ? "text-gray-800" : "text-gray-500",
    ].join(" ")}
    aria-current={active ? "step" : undefined}
  >
    {step.label}
  </div>

  {/* Always reserve a line for subtext */}
  <div className="mt-1 h-5 overflow-hidden">
    <div
      className={[
        "text-xs text-gray-500 flex items-center gap-1 truncate transition-opacity duration-200",
        active && currentSubtext ? "opacity-100" : "opacity-0",
      ].join(" ")}
      aria-live="polite"
      aria-atomic="true"
    >
      <Loader2 className="w-3.5 h-3.5 shrink-0 animate-spin text-blue-600" />
      <span className="truncate">{currentSubtext || ""}</span>
    </div>
  </div>
</div>

      </li>
    );
  })}
</ul>

<br /> <br />
      {/* Rotating top message */}
    <p className="text-center text-gray-600 mb-4 font-medium text-lg">
      {currentTopMessage}
    </p>


  </div>
)}


      {/* Error message */}
      {!loading && error && (
        <div className="text-red-600 text-center text-lg">{message}</div>
      )}

{/* Success message */}
{!loading && success && (
  <div className="flex flex-col items-center gap-3">
    {/* Minimal message with orange accent */}
    <div className="text-blue-700 text-center text-sm px-3 py-2 border-l-4 border-orange-500">
      {message}
    </div>

    {siteName && (
      <button
        onClick={() => window.open(`http://${siteName}`, "_blank")}
        className="px-5 py-2 rounded-md bg-blue-600 text-white
                   hover:bg-blue-700
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
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

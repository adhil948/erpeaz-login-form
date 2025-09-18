import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, CheckCircle, Circle } from "lucide-react"; // spinner + icons
import { io } from "socket.io-client";
import { useRef } from "react";

const topMessages = [
  "⚠️ Please don’t refresh the page, this is a one-time process.",
  "⏳ Site setup may take a few minutes!",
  "🔒 Do not close the tab until the setup completes.",
  "💡 Sit back and relax, your site is being prepared.",
];

const stepsConfig = [
  {
    id: "site",
    labels: {
      idle: "Ready to create site",
      active: "Creating site…",
      done: "Site created",
    },
    sub: [
      "Writing site_config.json…",
      "Provisioning tenant DB…",
      "Resolving assets manifest…",
    ],
  },
  {
    id: "company",
    labels: {
      idle: "Preparing company",
      active: "Creating company…",
      done: "Company created",
    },
    sub: [
      "Creating org structure…",
      "Registering domain entities…",
      "Linking internal records…",
    ],
  },
  {
    id: "apps",
    labels: {
      idle: "Preparing apps",
      active: "Installing apps…",
      done: "Apps installed",
    },
    sub: [
      "Fetching app registry…",
      "Extracting dependencies…",
      "Syncing modules…",
    ],
  },
  {
    id: "users",
    labels: {
      idle: "Preparing users",
      active: "Creating users…",
      done: "Users created",
    },
    sub: [
      "Generating credentials…",
      "Assigning roles…",
      "Encrypting passwords…",
    ],
  },
  {
    id: "permissions",
    labels: {
      idle: "Preparing permissions",
      active: "Giving permissions…",
      done: "Permissions granted",
    },
    sub: [
      "Applying ACL rules…",
      "Propagating policies…",
      "Syncing permission matrix…",
    ],
  },
  {
    id: "done",
    labels: {
      idle: "Finalizing setup",
      active: "Finalizing setup…",
      done: "Setup successful!",
    },
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

  const socketRef = useRef(null);

  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      const random =
        topMessages[Math.floor(Math.random() * topMessages.length)];
      setCurrentTopMessage(random);
    }, 8000);

    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (!loading) return;

    const subInterval = setInterval(() => {
      const subs = stepsConfig[currentStep]?.sub || [];
      if (subs.length > 0) {
        const random = subs[Math.floor(Math.random() * subs.length)];
        setCurrentSubtext(random);
      }
    }, 3000);

    return () => clearInterval(subInterval);
  }, [currentStep, loading]);


    // connect once
useEffect(() => {
  if (!id) return;
  const socket = io(import.meta.env.VITE_API_URL, {
    transports: ['websocket'],
    query: { companyId: id },
  });
  socketRef.current = socket;

  socket.on('connect', () => {
    setMessage("⚡ Live updates connected…");
  });

  socket.on('site:progress', ({ status, progress: p, subtext, siteName }) => {
    const stepIndex = stepsConfig.findIndex((s) => s.id === status);
    if (stepIndex !== -1) {
      setCurrentStep(stepIndex);
      setProgress((prev) => (p > prev ? p : prev));
      setCurrentSubtext(subtext || "");
    }
    if (status === "done") {
      setSuccess(true);
      setSiteName(siteName);
      setMessage("Site created successfully!");
      setLoading(false);
    }
    if (status === "error") {
      setError(true);
      setMessage("❌ Site creation failed. Check logs.");
      setLoading(false);
    }
  });

  socket.on('site:log', ({ line }) => {
    // sanitize or shorten if needed
    setCurrentSubtext(line);
  });

  return () => {
    socket.disconnect();
  };
}, [id]);


  useEffect(() => {
    if (!id) {
      setError(true);
      setMessage("Company ID not found.");
      setLoading(false);
      return;
    }
    // starts the backend task; socket will receive progress
    axios
      .post(`${import.meta.env.VITE_API_URL}/createnewsite/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setTaskId(res.data.taskId || "live");
          setMessage("⚡ Site building started...");
          setCurrentStep(0);
        } else {
          throw new Error("Failed to start site creation");
        }
      })
      .catch((err) => {
        setError(true);
        setMessage(err.message || "❌ Failed to start site creation.");
        setLoading(false);
      });
  }, [id]);




  useEffect(() => {
    if (!id) return;

    const poll = setInterval(() => {
      axios
        .get(`${import.meta.env.VITE_API_URL}/status/${id}`)
        .then((res) => {
          const { status, siteName } = res.data;

          const stepIndex = stepsConfig.findIndex((s) => s.id === status);

          if (stepIndex !== -1) {
            setCurrentStep(stepIndex);
            setProgress((prev) => {
              const next = Math.round(
                ((stepIndex + 1) / stepsConfig.length) * 100
              );
              return next > prev ? next : prev;
            });

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
            setMessage(" Site created successfully!");
            setLoading(false);
            clearInterval(poll);
          }
        })
        .catch(() => {
          // ignore errors
        });
    }, 1000);

    return () => clearInterval(poll);
  }, [id]);

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
      {loading && (
        <div className="absolute inset-0 flex flex-col justify-start items-center bg-white z-50 p-16 pt-24">
          {/* Progress Bar */}
          <div
            className="w-full max-w-xl mb-6"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            aria-label="Site setup progress"
          >
            <div className="relative h-2 w-full rounded-full bg-gray-200 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-r-full transition-[width] duration-600 ease-out"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #F97316, #F59E0B)",
                }}
              />
              <div
                className="absolute inset-y-0 left-0 rounded-r-full pointer-events-none mix-blend-overlay opacity-60"
                style={{
                  width: `${progress}%`,
                  background:
                    "repeating-linear-gradient(45deg, rgba(255,255,255,0.35) 0 12px, rgba(255,255,255,0.1) 12px 24px)",
                  backgroundSize: "24px 24px",
                  animation: "barberpole 1.2s linear infinite",
                }}
              />
            </div>
            <div className="mt-2 text-right text-sm text-gray-600 font-medium">
              {progress}%
            </div>

            <style jsx>{`
              @keyframes barberpole {
                0% {
                  background-position: 0 0;
                }
                100% {
                  background-position: 24px 0;
                }
              }
            `}</style>
          </div>
          {/* Step List */}
          <ul className="w-full max-w-xl bg-white border border-gray-200 rounded-lg p-4">
            {stepsConfig.map((step, idx) => {
              const done = idx < currentStep;
              const active = idx === currentStep;

              const label = step.labels
                ? active
                  ? step.labels.active
                  : done
                  ? step.labels.done
                  : step.labels.idle
                : step.label; // fallback if any step lacks labels

              return (
                <li key={step.id} className="flex items-start py-3">
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
                  <div className="ml-3">
                    <div
                      className={[
                        "text-sm font-medium leading-5",
                        active
                          ? "text-blue-700"
                          : done
                          ? "text-gray-800"
                          : "text-gray-500",
                      ].join(" ")}
                      aria-current={active ? "step" : undefined}
                    >
                      {label}
                    </div>
                    <div className="mt-1 h-5 overflow-hidden">
                      <div
                        className={[
                          "text-xs text-gray-500 flex items-center gap-1 truncate transition-opacity duration-200",
                          active && currentSubtext
                            ? "opacity-100"
                            : "opacity-0",
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
          <p className="text-center text-gray-600 mb-4 font-medium text-lg">
            {currentTopMessage}
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="text-red-600 text-center text-lg">{message}</div>
      )}

      {!loading && success && (
        <div className="w-full max-w-xl">
          <div className="rounded-xl overflow-hidden shadow-md bg-white">
            {/* Solid orange accent bar */}
            <div className="bg-orange-500 h-1.5" />

            <div className="p-6 flex flex-col items-center text-center">
              {/* Solid, soft badge */}
              <div
                className="inline-flex items-center justify-center w-12 h-12 rounded-full
                        bg-blue-50 ring-2 ring-white shadow"
              >
                <CheckCircle className="w-7 h-7 text-blue-600" />
              </div>

              {/* Title */}
              <h2 className="mt-4 text-xl font-semibold text-blue-900">
                {message}
              </h2>

              {/* URL hint */}
              {siteName && (
                <p className="mt-1 text-sm text-gray-600">
                  Site:{" "}
                  <span className="font-medium text-orange-600">
                    {siteName}
                  </span>
                </p>
              )}

              {/* Actions */}
              <div className="mt-5 flex gap-3">
                {siteName && (
                  <button
                    onClick={() => window.open(`http://${siteName}`, "_blank")}
                    className="px-5 py-2.5 rounded-md text-white
                         bg-blue-600 hover:bg-blue-700
                         focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-offset-2 focus-visible:ring-blue-600"
                  >
                    Visit your site
                  </button>
                )}
                {siteName && (
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(`http://${siteName}`)
                    }
                    className="px-5 py-2.5 rounded-md border border-orange-300
                         text-blue-700 hover:bg-orange-50
                         focus-visible:outline-none focus-visible:ring-2
                         focus-visible:ring-offset-2 focus-visible:ring-blue-600"
                  >
                    Copy URL
                  </button>
                )}
              </div>

              {/* Status line */}
              <div
                role="status"
                aria-live="polite"
                className="mt-4 text-xs text-gray-500"
              >
                A new ERPNext site is ready.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinalForm;

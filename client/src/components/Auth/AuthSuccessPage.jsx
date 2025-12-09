// src/components/Auth/AuthSuccessPage.jsx - FIXED with Session Support
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";
import API_BASE_URL from "../../config/api";

const AuthSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [status, setStatus] = useState("processing");
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        console.log("🔍 AuthSuccessPage - Processing callback");
        console.log("   Full URL:", window.location.href);
        console.log("   Search params:", window.location.search);
        console.log("   Hash:", window.location.hash);

        // Method 1: Check query parameters (original method)
        let token = searchParams.get("token");
        let userParam = searchParams.get("user");
        const sessionId = searchParams.get("session");

        console.log("   Token from query:", !!token);
        console.log("   User from query:", !!userParam);
        console.log("   Session from query:", !!sessionId);

        // Method 2: Check hash parameters (for Vercel routing)
        if (!token && !sessionId && window.location.hash) {
          console.log("   Checking hash parameters...");
          const hashParams = new URLSearchParams(window.location.hash.split("?")[1]);
          token = hashParams.get("token");
          userParam = hashParams.get("user");
          console.log("   Token from hash:", !!token);
          console.log("   User from hash:", !!userParam);
        }

        // Method 3: Session-based (most reliable for Vercel)
        if (sessionId && !token) {
          console.log("   Using session-based auth...");
          setStatus("fetching");

          const response = await fetch(`${API_BASE_URL}/auth/session?session=${sessionId}`);

          if (!response.ok) {
            throw new Error("Failed to retrieve session data");
          }

          const data = await response.json();

          if (data.success) {
            token = data.token;
            userParam = JSON.stringify(data.user);
            console.log("✅ Session data retrieved successfully");
          } else {
            throw new Error(data.message || "Session retrieval failed");
          }
        }

        // Validate we have the required data
        if (!token || !userParam) {
          console.error("❌ Missing token or user data after all checks");
          console.log("   Available search params:", Array.from(searchParams.entries()));
          throw new Error("Authentication data not found");
        }

        // Parse the user data
        const userData = typeof userParam === "string" ? JSON.parse(decodeURIComponent(userParam)) : userParam;

        console.log("✅ Parsed user data:", userData);

        // Use your auth context login function
        login(userData, token);

        setStatus("success");
        toast.success(`Welcome back, ${userData.name}! 🎉`);

        console.log("✅ OAuth successful - user logged in");

        // Redirect to home page after a short delay
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1500);
      } catch (error) {
        console.error("❌ Error processing OAuth callback:", error);
        setStatus("error");
        setError(error.message);
        toast.error("Authentication failed: " + error.message);

        // Redirect to login with error after delay
        setTimeout(() => {
          navigate("/login?error=auth_failed&message=" + encodeURIComponent(error.message), { replace: true });
        }, 3000);
      }
    };

    handleGoogleCallback();
  }, [searchParams, navigate, login, location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-cyan-50">
      <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md">
        {status === "processing" ||
          (status === "fetching" && (
            <>
              {/* Loading Icon Animation */}
              <div className="mb-6">
                <div className="relative inline-block">
                  <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  {/* Pulse effect */}
                  <div className="absolute inset-0 rounded-full bg-sky-400 opacity-25 animate-ping"></div>
                </div>
              </div>

              <h1 className="text-2xl font-bold text-gray-800 mb-2">{status === "fetching" ? "Retrieving Session..." : "Processing Authentication..."}</h1>
              <p className="text-gray-600 mb-6">Please wait while we set up your account</p>

              {/* Loading spinner */}
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
              </div>
            </>
          ))}

        {status === "success" && (
          <>
            {/* Success Icon Animation */}
            <div className="mb-6">
              <div className="relative inline-block">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {/* Pulse effect */}
                <div className="absolute inset-0 rounded-full bg-green-400 opacity-25 animate-ping"></div>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-2">Authentication Successful!</h1>
            <p className="text-gray-600 mb-6">Redirecting you to the home page...</p>
          </>
        )}

        {status === "error" && (
          <>
            {/* Error Icon */}
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-2">Authentication Failed</h1>
            <p className="text-gray-600 mb-6">{error || "Something went wrong"}</p>
            <p className="text-sm text-gray-500">Redirecting to login page...</p>
          </>
        )}

        {/* Debug Info (only in development) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg text-left text-xs">
            <p className="font-bold mb-2">Debug Info:</p>
            <p>Status: {status}</p>
            <p>Has Token: {searchParams.get("token") ? "Yes" : "No"}</p>
            <p>Has User: {searchParams.get("user") ? "Yes" : "No"}</p>
            <p>Has Session: {searchParams.get("session") ? "Yes" : "No"}</p>
            <p>Hash: {window.location.hash ? "Yes" : "No"}</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes ping {
          0% {
            transform: scale(1);
            opacity: 0.25;
          }
          75%,
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .animate-bounce {
          animation: bounce 1s ease-in-out infinite;
        }

        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default AuthSuccessPage;

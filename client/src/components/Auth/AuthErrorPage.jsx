import React from "react";
import { useSearchParams } from "react-router-dom";

const AuthErrorPage = () => {
  const [searchParams] = useSearchParams();
  const message = searchParams.get("message") || "Authentication failed";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-4">
        <div className="text-red-500 text-6xl mb-4">✗</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Authentication Failed</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="space-y-3">
          <button onClick={() => (window.location.href = "/")} className="w-full bg-sky-500 text-white px-6 py-3 rounded-lg hover:bg-sky-600 transition font-medium">
            Go Home
          </button>
          <button onClick={() => window.location.reload()} className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-medium">
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthErrorPage;

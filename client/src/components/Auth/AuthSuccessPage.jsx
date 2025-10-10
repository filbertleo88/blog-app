import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const AuthSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const user = searchParams.get("user");

    if (token && user) {
      try {
        // Store in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", user);

        console.log("OAuth successful - token stored");

        // Redirect to home page after a short delay
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } catch (error) {
        console.error("Error processing OAuth success:", error);
        navigate("/auth/error?message=Error processing authentication");
      }
    } else {
      navigate("/auth/error?message=Missing authentication data");
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Authentication Successful!</h1>
        <p className="text-gray-600">Redirecting you to the home page...</p>
        <div className="mt-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthSuccessPage;

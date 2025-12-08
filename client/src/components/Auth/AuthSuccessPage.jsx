// src/pages/AuthSuccessPage.jsx
import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"; // Add this
import { toast } from "react-hot-toast"; // Add this

const AuthSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth(); // Add this

  useEffect(() => {
    const token = searchParams.get("token");
    const user = searchParams.get("user");

    if (token && user) {
      try {
        // Parse the user data
        const userData = JSON.parse(decodeURIComponent(user));

        // Use your auth context login function
        login(userData, token);

        toast.success(`Welcome, ${userData.name}!`);

        console.log("OAuth successful - user logged in");

        // Redirect to home page after a short delay
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } catch (error) {
        console.error("Error processing OAuth success:", error);
        navigate("/login?error=auth_failed");
      }
    } else {
      navigate("/login?error=missing_data");
    }
  }, [searchParams, navigate, login]);

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

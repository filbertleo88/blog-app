// components/Auth/AuthModal.jsx
import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineX } from "react-icons/hi";

const AuthModal = ({ isVisible, onClose, onAuthSuccess, initialView = "login", onViewSwitch, navigate }) => {
  const [isLoginView, setIsLoginView] = useState(initialView === "login");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Sync with initialView prop
  useEffect(() => {
    setIsLoginView(initialView === "login");
  }, [initialView]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isVisible]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (error) setError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return false;
    }

    if (!isLoginView) {
      if (!formData.name) {
        setError("Please enter your name");
        return false;
      }
      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const endpoint = isLoginView ? "/api/auth/login" : "/api/auth/register";
      const payload = isLoginView ? { email: formData.email, password: formData.password } : { name: formData.name, email: formData.email, password: formData.password };

      const response = await fetch(`http://localhost:5009${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      if (data.success) {
        // Store token and user data in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Call success callback
        if (onAuthSuccess) {
          onAuthSuccess(data.user);
        }

        // Close modal
        onClose();

        // Reset form
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        // Show success message
        console.log(`${isLoginView ? "Login" : "Registration"} successful!`);
      } else {
        setError(data.message || "Authentication failed");
      }
    } catch (error) {
      console.error("Auth error:", error);
      setError(error.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    // Redirect to Google OAuth with return URL
    const returnUrl = window.location.pathname;
    window.location.href = `http://localhost:5009/api/auth/google?returnUrl=${encodeURIComponent(returnUrl)}`;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setError("");
  };

  const handleViewSwitch = () => {
    const newView = !isLoginView;
    setIsLoginView(newView);
    resetForm();

    // Notify parent component to update URL
    if (onViewSwitch) {
      onViewSwitch(newView ? "login" : "register");
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Close modal when clicking on the background
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 transition-opacity duration-300" onClick={handleBackdropClick}>
      {/* Blurry Backdrop */}
      <div className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm transition-all duration-300"></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row max-w-4xl w-full transform transition-all duration-300 ease-in-out scale-100 relative z-10">
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10">
          <HiOutlineX className="h-6 w-6" />
        </button>

        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 p-8">
          <div className={`text-center ${isLoginView ? "mb-8" : "mb-4"}`}>
            <h2 className="text-3xl font-bold text-gray-800">{isLoginView ? "Welcome Back" : "Create an Account"}</h2>
            <p className="text-gray-500 mt-2">{isLoginView ? "Please enter your details to log in" : "Please fill the details to register"}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className={isLoginView ? "space-y-6" : "space-y-3"}>
            {!isLoginView && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500" placeholder="John Doe" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500" placeholder="email@example.com" />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                placeholder="********"
              />
              <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-sm leading-5">
                {showPassword ? <FaEyeSlash className="h-5 w-5 text-gray-500" /> : <FaEye className="h-5 w-5 text-gray-500" />}
              </button>
            </div>
            {!isLoginView && (
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                  placeholder="********"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-bold py-3 px-4 rounded-lg hover:from-sky-600 hover:to-cyan-500 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isLoginView ? "Logging in..." : "Creating account..."}
                </div>
              ) : isLoginView ? (
                "Login"
              ) : (
                "Sign Up"
              )}
            </button>

            <div className="flex items-center justify-center space-x-2 my-4">
              <hr className="w-full border-gray-300" />
              <span className="text-gray-500">OR</span>
              <hr className="w-full border-gray-300" />
            </div>

            <button type="button" onClick={handleGoogleAuth} className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-100 transition duration-300">
              <FcGoogle className="h-6 w-6 mr-2" />
              Continue with Google
            </button>
          </form>

          <p className={`text-center text-sm text-gray-500 ${isLoginView ? "mt-8" : "mt-4"}`}>
            {isLoginView ? "Don't have an account?" : "Already have an account?"}
            <button onClick={handleViewSwitch} className="font-semibold text-sky-500 hover:text-sky-600 ml-1">
              {isLoginView ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>

        {/* Right Side: Image */}
        <div className="hidden md:block w-1/2 rounded-r-2xl bg-gradient-to-br from-[#2193b0] to-[#6dd5ed] p-8">
          <div className="text-white text-center flex flex-col justify-center h-full">
            <h1 className="text-4xl font-bold">Time To Program</h1>
            <p className="mt-4 text-lg">Join our community of developers and share your knowledge</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

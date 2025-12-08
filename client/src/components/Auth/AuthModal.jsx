// components/Auth/AuthModal.jsx
import React, { useState, useEffect, useRef } from "react";
import { FaEye, FaEyeSlash, FaGoogle, FaEnvelope, FaLock, FaUser, FaArrowLeft } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Toaster, toast } from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";
import API_BASE_URL from "../../config/api";

const AuthModal = ({ isVisible, onClose, initialView = "login", onViewSwitch, navigate }) => {
  const { login } = useAuth();
  const [isLoginView, setIsLoginView] = useState(initialView === "login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgotPasswordView, setForgotPasswordView] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpData, setOtpData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [eyesClosed, setEyesClosed] = useState(false);

  // Refs for the shapes
  const shapesRef = useRef([]);
  const pupilsRef = useRef([]);
  const eyesRef = useRef([]);
  const containerRef = useRef(null);

  // Sync with initialView prop
  useEffect(() => {
    setIsLoginView(initialView === "login");
  }, [initialView]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
      // Start eye tracking when modal opens
      setTimeout(setupEyeTracking, 100);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isVisible]);

  // Handle eye closing animation
  useEffect(() => {
    if (eyesClosed) {
      // Close all eyes
      eyesRef.current.forEach((eye) => {
        if (eye) {
          eye.style.transform = "scaleY(0.1)";
          eye.style.transition = "transform 0.3s ease";
        }
      });

      // Hide pupils
      pupilsRef.current.forEach((pupil) => {
        if (pupil) {
          pupil.style.opacity = "0";
          pupil.style.transition = "opacity 0.2s ease";
        }
      });
    } else {
      // Open all eyes
      eyesRef.current.forEach((eye) => {
        if (eye) {
          eye.style.transform = "scaleY(1)";
          eye.style.transition = "transform 0.3s ease";
        }
      });

      // Show pupils
      pupilsRef.current.forEach((pupil) => {
        if (pupil) {
          pupil.style.opacity = "1";
          pupil.style.transition = "opacity 0.3s ease 0.1s";
        }
      });
    }
  }, [eyesClosed]);

  // Eye tracking and character animation
  const setupEyeTracking = () => {
    const handleMouseMove = (e) => {
      if (!containerRef.current || shapesRef.current.length === 0 || eyesClosed) return;

      // Eye tracking for pupils
      pupilsRef.current.forEach((pupil, index) => {
        if (!pupil || !pupil.parentElement) return;

        const eye = pupil.parentElement;
        const eyeRect = eye.getBoundingClientRect();
        const eyeCenterX = eyeRect.left + eyeRect.width / 2;
        const eyeCenterY = eyeRect.top + eyeRect.height / 2;

        const deltaX = e.clientX - eyeCenterX;
        const deltaY = e.clientY - eyeCenterY;
        const angle = Math.atan2(deltaY, deltaX);
        const distance = Math.min(5, Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 20);

        const pupilX = Math.cos(angle) * distance;
        const pupilY = Math.sin(angle) * distance;

        pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
      });

      // Character tilting toward cursor
      shapesRef.current.forEach((shape, index) => {
        if (!shape) return;

        const shapeRect = shape.getBoundingClientRect();
        const shapeCenterX = shapeRect.left + shapeRect.width / 2;
        const shapeCenterY = shapeRect.top + shapeRect.height / 2;

        const deltaX = e.clientX - shapeCenterX;
        const deltaY = e.clientY - shapeCenterY;

        // Calculate tilt angle (max 8 degrees)
        const maxTilt = 8;
        const tiltX = (deltaX / window.innerWidth) * maxTilt * 2;

        // Only apply tilt if not already animating
        if (!shape.classList.contains("nod-animation") && !shape.classList.contains("shake-animation")) {
          shape.style.transform = `rotate(${tiltX}deg)`;
        }
      });
    };

    // Add mousemove listener
    document.addEventListener("mousemove", handleMouseMove);

    // Cleanup function
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  };

  // Trigger character animations
  const triggerCharacterAnimation = (animationType) => {
    shapesRef.current.forEach((shape) => {
      if (!shape) return;

      // Reset any inline transforms
      shape.style.transform = "";

      // Add animation class
      shape.classList.add(animationType);

      // Remove animation class after it completes
      setTimeout(
        () => {
          shape.classList.remove(animationType);
        },
        animationType === "shake-animation" ? 800 : 1000
      );
    });
  };

  // Handle show password toggle with eye closed
  const handleShowPasswordToggle = () => {
    // Toggle eye state based on whether we're showing or hiding password
    const willShowPassword = !showPassword;
    setEyesClosed(willShowPassword);

    setTimeout(() => {
      setShowPassword(willShowPassword);
    }, 200);
  };

  const handleShowConfirmPasswordToggle = () => {
    // Toggle eye state based on whether we're showing or hiding password
    const willShowPassword = !showConfirmPassword;
    setEyesClosed(willShowPassword);

    setTimeout(() => {
      setShowConfirmPassword(willShowPassword);
    }, 200);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (forgotPasswordView) {
      setOtpData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (error) setError("");
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

  const validateForgotPasswordForm = () => {
    if (!otpSent) {
      if (!otpData.email) {
        setError("Please enter your email address");
        return false;
      }
    } else {
      if (!otpData.otp) {
        setError("Please enter the OTP");
        return false;
      }
      if (!otpData.newPassword) {
        setError("Please enter your new password");
        return false;
      }
      if (otpData.newPassword.length < 8) {
        setError("Password must be at least 8 characters");
        return false;
      }
      if (otpData.newPassword !== otpData.confirmNewPassword) {
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

    // Open eyes when form is submitted
    setEyesClosed(false);

    try {
      const endpoint = isLoginView ? "/auth/login" : "/auth/register";
      const payload = isLoginView ? { email: formData.email, password: formData.password } : { name: formData.name, email: formData.email, password: formData.password };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
        // Trigger nod animation on success
        triggerCharacterAnimation("nod-animation");

        login(data.user, data.token);
        onClose();
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        toast.success(`${isLoginView ? "Login" : "Registration"} successful!`);
        navigate("/");
      } else {
        setError(data.message || "Authentication failed");
        // Trigger shake animation on error
        triggerCharacterAnimation("shake-animation");
      }
    } catch (error) {
      console.error("Auth error:", error);
      setError(error.message || "Network error. Please try again.");
      // Trigger shake animation on error
      triggerCharacterAnimation("shake-animation");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!validateForgotPasswordForm()) return;

    setLoading(true);
    setError("");

    try {
      if (!otpSent) {
        const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: otpData.email }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to send OTP");
        }

        if (data.success) {
          // Trigger nod animation on OTP sent
          triggerCharacterAnimation("nod-animation");
          setOtpSent(true);
          setError("");
          toast.success("OTP sent successfully");
        } else {
          setError(data.message || "Failed to send OTP");
          triggerCharacterAnimation("shake-animation");
        }
      } else {
        const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: otpData.email,
            otp: otpData.otp,
            newPassword: otpData.newPassword,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to reset password");
        }

        if (data.success) {
          // Trigger nod animation on success
          triggerCharacterAnimation("nod-animation");
          setError("");
          toast.success("Password reset successfully!");
          setForgotPasswordView(false);
          setOtpSent(false);
          setOtpData({
            email: "",
            otp: "",
            newPassword: "",
            confirmNewPassword: "",
          });
        } else {
          setError(data.message || "Failed to reset password");
          triggerCharacterAnimation("shake-animation");
        }
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setError(error.message || "Network error. Please try again.");
      triggerCharacterAnimation("shake-animation");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    // Trigger character animation before redirect
    triggerCharacterAnimation("nod-animation");

    setTimeout(() => {
      const returnUrl = window.location.pathname;
      window.location.href = `${API_BASE_URL}/auth/google?returnUrl=${encodeURIComponent(returnUrl)}`;
    }, 500);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setOtpData({
      email: "",
      otp: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setError("");
    setForgotPasswordView(false);
    setOtpSent(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleViewSwitch = () => {
    setIsAnimating(true);
    // Trigger character animation on view switch
    triggerCharacterAnimation("nod-animation");

    setTimeout(() => {
      const newView = !isLoginView;
      setIsLoginView(newView);
      resetForm();
      setIsAnimating(false);

      if (onViewSwitch) {
        onViewSwitch(newView ? "login" : "register");
      }
    }, 300);
  };

  const handleForgotPasswordClick = () => {
    setIsAnimating(true);
    // Trigger character animation
    triggerCharacterAnimation("nod-animation");

    setTimeout(() => {
      setForgotPasswordView(true);
      setOtpSent(false);
      setOtpData({
        email: formData.email || "",
        otp: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setError("");
      setIsAnimating(false);
    }, 300);
  };

  const handleBackToLogin = () => {
    setIsAnimating(true);
    // Trigger character animation
    triggerCharacterAnimation("nod-animation");

    setTimeout(() => {
      setForgotPasswordView(false);
      setOtpSent(false);
      setOtpData({
        email: "",
        otp: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setError("");
      setIsAnimating(false);
    }, 300);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <Toaster position="top-right" />

      <div className="fixed inset-0 flex items-center justify-center z-50 p-4" onClick={handleBackdropClick}>
        {/* Semi-transparent backdrop that shows page background */}
        <div className="absolute inset-0 bg-black/20 transition-all duration-300"></div>

        {/* Main Glassmorphism Modal */}
        <div
          className={`relative bg-white/10 backdrop-blur-lg border border-white/30 rounded-3xl shadow-2xl overflow-hidden max-w-6xl w-full flex flex-col md:flex-row min-h-[600px] transform transition-all duration-500 ${
            isAnimating ? "scale-95 opacity-90" : "scale-100 opacity-100"
          }`}
          ref={containerRef}
        >
          {/* Left Side - Animated Characters Section */}
          <div className="hidden md:flex md:w-1/2 p-12 flex-col justify-center relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500 via-teal-600/20 to-cyan-400 backdrop-blur-sm"></div>

            {/* Floating elements */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-xl"></div>

            {/* Animated Characters Container */}
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <div className="shapes-container relative w-full h-64">
                {/* Purple Character */}
                <div
                  className="shape shape-purple absolute w-28 h-32 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl rounded-br-[50px] rounded-tl-2xl rotate-[-15deg] animate-float-purple"
                  style={{ left: "20%", top: "0" }}
                  ref={(el) => (shapesRef.current[0] = el)}
                >
                  <div className="eyes absolute top-8 left-1/2 transform -translate-x-1/2 flex gap-4">
                    <div className="eye w-4 h-4 bg-white rounded-full relative flex items-center justify-center overflow-hidden" ref={(el) => (eyesRef.current[0] = el)}>
                      <div className="pupil w-2 h-2 bg-gray-900 rounded-full absolute" ref={(el) => (pupilsRef.current[0] = el)}></div>
                    </div>
                    <div className="eye w-4 h-4 bg-white rounded-full relative flex items-center justify-center overflow-hidden" ref={(el) => (eyesRef.current[1] = el)}>
                      <div className="pupil w-2 h-2 bg-gray-900 rounded-full absolute" ref={(el) => (pupilsRef.current[1] = el)}></div>
                    </div>
                  </div>
                  <div className="mouth absolute bottom-8 left-1/2 transform -translate-x-1/2 w-8 h-4 border-2 border-gray-900/60 border-t-0 rounded-b-3xl"></div>
                </div>

                {/* Orange Character */}
                <div className="shape shape-orange absolute w-32 h-24 bg-gradient-to-br from-orange-400 to-orange-500 rounded-[50%] animate-float-orange" style={{ left: "0", bottom: "0" }} ref={(el) => (shapesRef.current[1] = el)}>
                  <div className="eyes absolute top-6 left-1/2 transform -translate-x-1/2 flex gap-3">
                    <div className="eye w-3.5 h-3.5 bg-white rounded-full relative flex items-center justify-center overflow-hidden" ref={(el) => (eyesRef.current[2] = el)}>
                      <div className="pupil w-1.75 h-1.75 bg-gray-900 rounded-full absolute" ref={(el) => (pupilsRef.current[2] = el)}></div>
                    </div>
                    <div className="eye w-3.5 h-3.5 bg-white rounded-full relative flex items-center justify-center overflow-hidden" ref={(el) => (eyesRef.current[3] = el)}>
                      <div className="pupil w-1.75 h-1.75 bg-gray-900 rounded-full absolute" ref={(el) => (pupilsRef.current[3] = el)}></div>
                    </div>
                  </div>
                  <div className="mouth absolute bottom-6 left-1/2 transform -translate-x-1/2 w-6 h-3 border-2 border-gray-900/60 border-t-0 rounded-b-2xl"></div>
                </div>

                {/* Black Character */}
                <div
                  className="shape shape-black absolute w-24 h-28 bg-gradient-to-br from-gray-900 to-gray-800 rounded-[40%] rounded-t-2xl animate-float-black"
                  style={{ left: "35%", bottom: "10%" }}
                  ref={(el) => (shapesRef.current[2] = el)}
                >
                  <div className="eyes absolute top-8 left-1/2 transform -translate-x-1/2 flex gap-4">
                    <div className="eye w-4 h-4 bg-white rounded-full relative flex items-center justify-center overflow-hidden" ref={(el) => (eyesRef.current[4] = el)}>
                      <div className="pupil w-2 h-2 bg-yellow-400 rounded-full absolute" ref={(el) => (pupilsRef.current[4] = el)}></div>
                    </div>
                    <div className="eye w-4 h-4 bg-white rounded-full relative flex items-center justify-center overflow-hidden" ref={(el) => (eyesRef.current[5] = el)}>
                      <div className="pupil w-2 h-2 bg-yellow-400 rounded-full absolute" ref={(el) => (pupilsRef.current[5] = el)}></div>
                    </div>
                  </div>
                  <div className="mouth absolute bottom-8 left-1/2 transform -translate-x-1/2 w-8 h-4 border-2 border-white/80 border-t-0 rounded-b-3xl"></div>
                </div>

                {/* Yellow Character */}
                <div
                  className="shape shape-yellow absolute w-28 h-32 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl rounded-bl-[60px] rounded-tr-2xl animate-float-yellow"
                  style={{ right: "10%", bottom: "5%" }}
                  ref={(el) => (shapesRef.current[3] = el)}
                >
                  <div className="eyes absolute top-8 left-1/2 transform -translate-x-1/2 flex gap-3">
                    <div className="eye w-3.5 h-3.5 bg-white rounded-full relative flex items-center justify-center overflow-hidden" ref={(el) => (eyesRef.current[6] = el)}>
                      <div className="pupil w-1.75 h-1.75 bg-gray-900 rounded-full absolute" ref={(el) => (pupilsRef.current[6] = el)}></div>
                    </div>
                    <div className="eye w-3.5 h-3.5 bg-white rounded-full relative flex items-center justify-center overflow-hidden" ref={(el) => (eyesRef.current[7] = el)}>
                      <div className="pupil w-1.75 h-1.75 bg-gray-900 rounded-full absolute" ref={(el) => (pupilsRef.current[7] = el)}></div>
                    </div>
                  </div>
                  <div className="mouth absolute bottom-8 left-1/2 transform -translate-x-1/2 w-7 h-3.5 border-2 border-gray-900/60 border-t-0 rounded-b-2xl"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form Section */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
            {/* Close Button */}
            <button onClick={handleClose} className="absolute top-4 right-4 z-10 text-gray-600 hover:text-gray-800 bg-white/50 hover:bg-white/80 p-2 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/30">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="mb-8">
              {forgotPasswordView ? (
                <div className="flex items-center mb-6">
                  <button onClick={handleBackToLogin} className="flex items-center text-sky-600 hover:text-sky-700 transition-colors mr-4 group">
                    <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Login
                  </button>
                </div>
              ) : null}

              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{forgotPasswordView ? (otpSent ? "Reset Password" : "Forgot Password") : isLoginView ? "Welcome Back" : "Create Account"}</h2>
                <p className="text-gray-600">
                  {forgotPasswordView ? (otpSent ? "Enter OTP and set new password" : "Enter your email to receive a reset OTP") : isLoginView ? "Sign in to continue your journey" : "Join our creative community"}
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl animate-shake">
                <p className="text-red-600 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            {/* Form Container */}
            <div className="w-full max-w-md mx-auto">
              {forgotPasswordView ? (
                /* Forgot Password Form */
                <form onSubmit={handleForgotPassword} className="space-y-6">
                  {!otpSent ? (
                    <div className="space-y-4">
                      <div className="relative group">
                        <div className="absolute -inset-0.5  rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                        <div className="relative bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl">
                          <div className="flex items-center px-4 py-3">
                            <FaEnvelope className="h-5 w-5 text-gray-500 mr-3" />
                            <input
                              type="email"
                              name="email"
                              value={otpData.email}
                              onChange={handleInputChange}
                              className="w-full bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none"
                              placeholder="Enter your email"
                              autoComplete="off"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative group">
                        <div className="absolute -inset-0.5  rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                        <div className="relative bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl">
                          <input
                            type="text"
                            name="otp"
                            value={otpData.otp}
                            onChange={handleInputChange}
                            className="w-full bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none px-4 py-3 text-center tracking-widest"
                            placeholder="Enter 6-digit OTP"
                            maxLength="6"
                            autoComplete="off"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative group">
                          <div className="absolute -inset-0.5  rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                          <div className="relative bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl">
                            <div className="flex items-center px-4 py-3">
                              <FaLock className="h-5 w-5 text-gray-500 mr-3" />
                              <input
                                type={showPassword ? "text" : "password"}
                                name="newPassword"
                                value={otpData.newPassword}
                                onChange={handleInputChange}
                                className="w-full bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none"
                                placeholder="New password"
                                autoComplete="off"
                              />
                              <button type="button" onClick={handleShowPasswordToggle} className="text-gray-500 hover:text-gray-700">
                                {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="relative group">
                          <div className="absolute -inset-0.5  rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                          <div className="relative bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl">
                            <div className="flex items-center px-4 py-3">
                              <FaLock className="h-5 w-5 text-gray-500 mr-3" />
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmNewPassword"
                                value={otpData.confirmNewPassword}
                                onChange={handleInputChange}
                                className="w-full bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none"
                                placeholder="Confirm password"
                                autoComplete="off"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <button type="submit" disabled={loading} className="w-full relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                    <div className="relative w-full bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold py-3 px-4 rounded-xl hover:from-sky-600 hover:to-cyan-600 transition-all duration-300 transform group-hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          {otpSent ? "Resetting..." : "Sending OTP..."}
                        </div>
                      ) : otpSent ? (
                        "Reset Password"
                      ) : (
                        "Send OTP"
                      )}
                    </div>
                  </button>
                </form>
              ) : (
                /* Login/Register Form */
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    {!isLoginView && (
                      <div className="relative group">
                        <div className="absolute -inset-0.5  rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                        <div className="relative bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl">
                          <div className="flex items-center px-4 py-3">
                            <FaUser className="h-5 w-5 text-gray-500 mr-3" />
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="w-full bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none"
                              placeholder="Enter your full name"
                              autoComplete="off"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="relative group">
                      <div className="absolute -inset-0.5  rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                      <div className="relative bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl">
                        <div className="flex items-center px-4 py-3">
                          <FaEnvelope className="h-5 w-5 text-gray-500 mr-3" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none"
                            placeholder="Enter your email"
                            autoComplete="off"
                          />
                        </div>
                      </div>
                    </div>

                    {isLoginView ? (
                      <div className="relative group">
                        <div className="absolute -inset-0.5  rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                        <div className="relative bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl">
                          <div className="flex items-center px-4 py-3">
                            <FaLock className="h-5 w-5 text-gray-500 mr-3" />
                            <input
                              type={showPassword ? "text" : "password"}
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              className="w-full bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none"
                              placeholder="Enter your password"
                              autoComplete="off"
                            />
                            <button type="button" onClick={handleShowPasswordToggle} className="text-gray-500 hover:text-gray-700">
                              {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative group">
                          <div className="absolute -inset-0.5  rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                          <div className="relative bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl">
                            <div className="flex items-center px-4 py-3">
                              <FaLock className="h-5 w-5 text-gray-500 mr-3" />
                              <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none"
                                placeholder="Create password"
                                autoComplete="off"
                              />
                              <button type="button" onClick={handleShowPasswordToggle} className="text-gray-500 hover:text-gray-700">
                                {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="relative group">
                          <div className="absolute -inset-0.5  rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                          <div className="relative bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl">
                            <div className="flex items-center px-4 py-3">
                              <FaLock className="h-5 w-5 text-gray-500 mr-3" />
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className="w-full bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none"
                                placeholder="Confirm password"
                                autoComplete="off"
                              />
                              <button type="button" onClick={handleShowConfirmPasswordToggle} className="text-gray-500 hover:text-gray-700">
                                {showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {isLoginView && (
                    <div className="text-right">
                      <button type="button" onClick={handleForgotPasswordClick} className="text-sm text-sky-600 hover:text-sky-700 font-medium">
                        Forgot Password?
                      </button>
                    </div>
                  )}

                  <button type="submit" disabled={loading} className="w-full relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                    <div className="relative w-full bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold py-3 px-4 rounded-xl hover:from-sky-600 hover:to-cyan-600 transition-all duration-300 transform group-hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          {isLoginView ? "Signing in..." : "Creating account..."}
                        </div>
                      ) : isLoginView ? (
                        "Sign In"
                      ) : (
                        "Sign Up"
                      )}
                    </div>
                  </button>

                  <button type="button" onClick={handleGoogleAuth} className="w-full relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-400 to-gray-600 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                    <div className="relative w-full bg-white/60 backdrop-blur-sm border border-white/40 text-gray-800 font-medium py-3 px-4 rounded-xl hover:bg-white/80 transition-all duration-300 flex items-center justify-center">
                      <FcGoogle className="text-xl mr-3" />
                      Continue with Google
                    </div>
                  </button>

                  <p className="text-center text-gray-600">
                    {isLoginView ? "Don't have an account?" : "Already have an account?"}
                    <button type="button" onClick={handleViewSwitch} className="ml-2 text-sky-600 hover:text-sky-700 font-semibold">
                      {isLoginView ? "Sign Up" : "Sign In"}
                    </button>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes float-purple {
          0%,
          100% {
            transform: translateY(0) rotate(-15deg);
          }
          50% {
            transform: translateY(-20px) rotate(-15deg);
          }
        }

        @keyframes float-orange {
          0%,
          100% {
            transform: translateY(0) rotate(5deg);
          }
          50% {
            transform: translateY(-15px) rotate(5deg);
          }
        }

        @keyframes float-black {
          0%,
          100% {
            transform: translateY(0) rotate(10deg);
          }
          50% {
            transform: translateY(-25px) rotate(10deg);
          }
        }

        @keyframes float-yellow {
          0%,
          100% {
            transform: translateY(0) rotate(-10deg);
          }
          50% {
            transform: translateY(-18px) rotate(-10deg);
          }
        }

        .animate-float-purple {
          animation: float-purple 3s ease-in-out infinite;
        }

        .animate-float-orange {
          animation: float-orange 3.5s ease-in-out infinite;
        }

        .animate-float-black {
          animation: float-black 2.8s ease-in-out infinite;
        }

        .animate-float-yellow {
          animation: float-yellow 3.2s ease-in-out infinite;
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0) rotate(0deg);
          }
          15% {
            transform: translateX(-20px) rotate(-20deg);
          }
          30% {
            transform: translateX(20px) rotate(20deg);
          }
          45% {
            transform: translateX(-20px) rotate(-20deg);
          }
          60% {
            transform: translateX(20px) rotate(20deg);
          }
          75% {
            transform: translateX(-15px) rotate(-15deg);
          }
          90% {
            transform: translateX(15px) rotate(15deg);
          }
        }

        .shake-animation {
          animation: shake 0.8s cubic-bezier(0.36, 0.07, 0.19, 0.97) both !important;
        }

        @keyframes nod {
          0% {
            transform: translateY(0);
          }
          20% {
            transform: translateY(-25px);
          }
          40% {
            transform: translateY(0);
          }
          60% {
            transform: translateY(-25px);
          }
          80% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(0);
          }
        }

        .nod-animation {
          animation: nod 1s ease-in-out both !important;
        }

        @keyframes eye-blink {
          0%,
          90% {
            transform: scaleY(1);
          }
          5%,
          85% {
            transform: scaleY(0.1);
          }
        }

        .eye-blink-animation {
          animation: eye-blink 0.5s ease-in-out;
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-5px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(5px);
          }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </>
  );
};

export default AuthModal;

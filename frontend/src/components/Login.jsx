import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAllRoles, registerCustomer } from "../api/LoginAPI.js";
import { useAlert } from "../contexts/AlertContext.jsx";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const Login = () => {
  const navigate = useNavigate();
  const { addAlert } = useAlert();
  const [activeTab, setActiveTab] = useState("login");

  // ---------------- LOGIN FIELDS ----------------
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // ---------------- SIGNUP FIELDS ----------------
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  const signupRef = useRef(null);
  const [signupHeight, setSignupHeight] = useState(0);

  // Calculate dynamic signup height for smooth transition
  useEffect(() => {
    if (signupRef.current) {
      setSignupHeight(signupRef.current.scrollHeight);
    }
  }, [
    signupRef,
    signupName,
    signupEmail,
    signupPhone,
    signupUsername,
    signupPassword,
    signupConfirmPassword,
  ]);

  // ---------------- LOGIN HANDLER ----------------
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginAllRoles(loginUsername, loginPassword);
      if (!res || !res.role) {
        addAlert("Invalid username or password.", "error");
        return;
      }

      sessionStorage.setItem("token", res.token || "");
      sessionStorage.setItem("role", res.role);
      sessionStorage.setItem("user_id", res.id);

      addAlert(`Login Successful! You are logged in as ${res.role}`, "success");

      if (res.role === "admin") navigate("/admin-dashboard");
      else if (res.role === "customer") navigate("/customer-dashboard");
      else if (res.role === "staff") navigate("/staff-dashboard");
      else if (res.role === "rider") navigate("/rider-dashboard");
      else navigate("/");
    } catch (err) {
      console.error(err);
      addAlert(err.message || "Failed to connect to server.", "error");
    }
  };

  // ---------------- SIGNUP HANDLER ----------------
  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupPassword !== signupConfirmPassword) {
      addAlert("Passwords do not match!", "error");
      return;
    }
    try {
      await registerCustomer({
        username: signupUsername,
        password: signupPassword,
        first_name: signupName,
        email: signupEmail,
        phone: signupPhone,
        address: "",
      });

      addAlert("Signup successful! You can now log in.", "success");
      setSignupName("");
      setSignupEmail("");
      setSignupPhone("");
      setSignupUsername("");
      setSignupPassword("");
      setSignupConfirmPassword("");
      setActiveTab("login");
    } catch (err) {
      addAlert(err.message, "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#323C4D] to-[#0F2247] px-4 sm:px-6">
      <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 lg:p-8 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg transition-all duration-500">
        {/* Logo */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="bg-yellow-400 rounded-full p-3 sm:p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 64 64"
              className="w-10 h-10 cursor-pointer transition-all duration-100 hover:animate-pulse"
            >
              <path
                fill="#000000"
                d="M30.456 20.765c0 2.024-1.844 4.19-4.235 4.19v34.164c0 4.851-6.61 4.851-6.61 0V24.955c-2.328 0-4.355-1.793-4.355-4.479V1.674c0-1.636 2.364-1.698 2.364.064v13.898h1.98V1.61c0-1.503 2.278-1.599 2.278.064v13.963h2.046V1.63c0-1.572 2.21-1.635 2.21.062v13.945h2.013V1.63c0-1.556 2.309-1.617 2.309.062v19.074zm17.633-14.72v53.059c0 4.743-6.624 4.673-6.624 0V38.051h-3.526V6.045c0-7.451 10.151-7.451 10.151 0z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-semibold text-center text-gray-900">
          Agot's Express
        </h1>
        <p className="text-center text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">
          Authentic Filipino Cuisine
        </p>

        {/* Tabs */}
        <div className="flex justify-center mb-4 sm:mb-6 border-b border-gray-200">
          {["login", "signup"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 sm:px-4 py-2 font-medium text-sm sm:text-base transition-all duration-300 ${
                activeTab === tab
                  ? "border-b-2 border-yellow-400 text-gray-900"
                  : "text-gray-400"
              }`}
            >
              {tab === "login" ? "Login" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Forms with smooth tab switching */}
        <div className="relative">
          {/* Login Form */}
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              activeTab === "login"
                ? "opacity-100 translate-x-0 max-h-[1000px] relative"
                : "opacity-0 -translate-x-10 max-h-0 absolute top-0 w-full"
            }`}
          >
            <LoginForm
              username={loginUsername}
              setUsername={setLoginUsername}
              password={loginPassword}
              setPassword={setLoginPassword}
              handleLogin={handleLogin}
            />
          </div>

          {/* Signup Form */}
          <div
            ref={signupRef}
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              activeTab === "signup"
                ? `opacity-100 translate-x-0 max-h-[${signupHeight}px] relative`
                : "opacity-0 translate-x-10 max-h-0 absolute top-0 w-full"
            }`}
          >
            <SignupForm
              signupName={signupName}
              setSignupName={setSignupName}
              signupEmail={signupEmail}
              setSignupEmail={setSignupEmail}
              signupPhone={signupPhone}
              setSignupPhone={setSignupPhone}
              signupUsername={signupUsername}
              setSignupUsername={setSignupUsername}
              signupPassword={signupPassword}
              setSignupPassword={setSignupPassword}
              signupConfirmPassword={signupConfirmPassword}
              setSignupConfirmPassword={setSignupConfirmPassword}
              handleSignup={handleSignup}
            />
          </div>
        </div>

        <div className="text-center mt-4">
          <a href="/" className="text-gray-700 hover:text-gray-900 text-sm">
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;

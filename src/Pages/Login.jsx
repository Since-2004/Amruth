import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowRight,
  FaEnvelope,
  FaLock,
  FaUser,
  FaExclamationCircle,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { loginUser, registerUser } from "../lib/api";

function AuthInput({
  icon: Icon,
  name,
  type,
  placeholder,
  error,
  value,
  onChange,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const currentType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="relative">
      <div
        className={`flex items-center gap-3 bg-[#0f0f0f] border rounded-2xl px-4 py-4 transition-all duration-300 ${
          error ? "border-red-500" : "border-white/10 focus-within:border-red-500"
        }`}
      >
        <Icon className="text-brand-secondary" />
        <input
          type={currentType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-white"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-500 hover:text-white transition-colors"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
          <FaExclamationCircle />
          {error}
        </p>
      )}
    </div>
  );
}

function Login() {
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = "Full name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }
    if (!isLogin && !formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm your password";
    }
    if (
      !isLogin &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      setStatus({ type: "", message: "" });

      try {
        const data = isLogin
          ? await loginUser({
              email: formData.email,
              password: formData.password,
            })
          : await registerUser({
              name: formData.name,
              email: formData.email,
              password: formData.password,
            });

        localStorage.setItem("amrut_token", data.token);
        localStorage.setItem("amrut_user", JSON.stringify(data.user));
        setStatus({
          type: "success",
          message: data.user.role === "OWNER"
            ? "Owner login successful. Redirecting..."
            : "Login successful. Redirecting...",
        });
        setTimeout(() => {
          window.location.href = data.user.role === "OWNER" ? "/owner" : "/client";
        }, 1000);
      } catch (error) {
        setStatus({ type: "error", message: error.message });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden px-6">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0">
        <div className="absolute top-[-150px] left-[-150px] w-[450px] h-[450px] bg-brand-primary/20 blur-[180px] rounded-full"></div>
        <div className="absolute bottom-[-150px] right-[-150px] w-[450px] h-[450px] bg-brand-secondary/10 blur-[180px] rounded-full"></div>
      </div>

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-5xl grid lg:grid-cols-2 rounded-[32px] overflow-hidden border border-white/10 bg-[#0b0b0b]"
      >

        {/* LEFT PANEL */}
        <div className="hidden lg:flex flex-col justify-center p-14 bg-gradient-to-br from-black via-[#120000] to-black relative">

          <div className="absolute w-[300px] h-[300px] bg-brand-primary/10 blur-[120px] rounded-full top-10 left-10"></div>

          <p className="text-brand-secondary uppercase tracking-[6px] text-xs">
            Elite Fitness Coaching
          </p>

          <h1 className="text-5xl font-black leading-tight mt-4">
            Build Your
            <span className="block text-brand-secondary">Strongest Self</span>
          </h1>

          <p className="text-gray-400 mt-6 leading-relaxed max-w-sm">
            Transform your body with structured coaching, discipline, and proven fitness systems.
          </p>

          <div className="grid grid-cols-3 gap-4 mt-10">
            {[
              { n: "250+", l: "Clients" },
              { n: "6+", l: "Years" },
              { n: "100%", l: "Results" },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center"
              >
                <h2 className="text-xl font-bold">{item.n}</h2>
                <p className="text-xs text-gray-500 uppercase">{item.l}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="p-10 md:p-14 bg-[#0a0a0a]">

          {/* TOGGLE */}
          <div className="flex bg-white/5 border border-white/10 rounded-full p-1 mb-10 max-w-[320px] mx-auto">
            <button
              onClick={() => { setIsLogin(true); setErrors({}); }}
              className={`flex-1 py-3 rounded-full text-sm font-semibold transition ${
                isLogin ? "bg-brand-primary text-white" : "text-gray-400"
              }`}
            >
              Login
            </button>

            <button
              onClick={() => { setIsLogin(false); setErrors({}); }}
              className={`flex-1 py-3 rounded-full text-sm font-semibold transition ${
                !isLogin ? "bg-brand-primary text-white" : "text-gray-400"
              }`}
            >
              Register
            </button>
          </div>

          {/* TITLE */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              {isLogin
                ? "Login to continue your journey"
                : "Start your transformation today"}
            </p>
          </div>

          {/* FORM */}
          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? "login" : "register"}
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-5"
            >

              {!isLogin && (
                <AuthInput
                  icon={FaUser}
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                />
              )}

              <AuthInput
                icon={FaEnvelope}
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />

              <AuthInput
                icon={FaLock}
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
              />

              {!isLogin && (
                <AuthInput
                  icon={FaLock}
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                />
              )}

              {isLogin && (
                <div className="text-right">
                  <button className="text-sm text-gray-500 hover:text-brand-secondary">
                    Forgot Password?
                  </button>
                </div>
              )}

              {status.message && (
                <p
                  className={`rounded-2xl px-4 py-3 text-sm ${
                    status.type === "success"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {status.message}
                </p>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-brand-primary hover:bg-brand-primary font-semibold flex items-center justify-center gap-2"
              >
                {isSubmitting ? "Please wait..." : isLogin ? "Login" : "Create Account"}
                <FaArrowRight />
              </motion.button>
            </motion.form>
          </AnimatePresence>

          {/* SWITCH */}
          <p className="text-center text-gray-500 text-sm mt-8">
            {isLogin ? "Don’t have an account?" : "Already have an account?"}
            <button
              onClick={() => { setIsLogin(!isLogin); setErrors({}); }}
              className="text-brand-secondary ml-2 hover:underline"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>

        </div>
      </motion.div>
    </section>
  );
}

export default Login;

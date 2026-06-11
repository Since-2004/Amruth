import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

import {
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaLock,
  FaQrcode,
  FaShieldAlt,
  FaCreditCard,
  FaUniversity,
  FaPaypal,
} from "react-icons/fa";
import { createEnrollment, getOwnerSettings, getPrograms } from "../lib/api";

function Checkout() {
  const detailsRef = useRef(null);
  const location = useLocation();
  const passedProgram = location.state?.program;

  const [selectedPayment, setSelectedPayment] = useState("UPI");
  const [showSuccess, setShowSuccess] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [upiSettings, setUpiSettings] = useState({ id: "amruthfitness@upi", name: "Amruth Fitness" });
  const [dynamicGoals, setDynamicGoals] = useState([]);
  const [elitePrice, setElitePrice] = useState("7,999");

  useEffect(() => {
    getOwnerSettings().then((data) => {
      if (data.settings) {
        setUpiSettings({ id: data.settings.upiId, name: data.settings.upiName });
        if (data.settings.elitePrice) {
          // Backward compatibility check
        }
      }
    }).catch(console.error);

    getPrograms().then((data) => {
      if (data.programs) {
        const allGoals = new Set();
        data.programs.forEach(p => {
          if (Array.isArray(p.goals)) {
            p.goals.forEach(g => allGoals.add(g));
          }
        });
        setDynamicGoals(Array.from(allGoals));
      }
    }).catch(console.error);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    goal: "",
    utrNumber: "",
  });

  const selectedPlan = passedProgram ? {
    id: passedProgram.id,
    title: passedProgram.title,
    duration: passedProgram.duration,
    price: passedProgram.price,
    goal: Array.isArray(passedProgram.goals) ? passedProgram.goals.join(" + ") : passedProgram.goals,
    schedule: passedProgram.schedule,
  } : {
    id: "elite-transformation",
    title: "Elite Transformation",
    duration: "3 Months",
    price: elitePrice,
    goal: "Fat Loss + Muscle Gain",
    schedule: "5 Days / Week",
  };

  const parsedPrice = parseFloat(selectedPlan.price?.toString().replace(/,/g, ''));

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.goal
    ) {
      alert("Please fill all the details.");
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      await createEnrollment({
        ...formData,
        programId: selectedPlan.id,
        paymentMethod: selectedPayment,
      });
      setShowSuccess(true);
      setFormData({ name: "", email: "", phone: "", goal: "", utrNumber: "" });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (

    <section className="relative min-h-screen bg-black text-white overflow-hidden  py-20 px-6">

      {/* ================= SUCCESS POPUP ================= */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm flex items-center justify-center px-6"
          >

            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-md rounded-[32px] bg-[#0d0d0d] border border-red-500/20 p-10 text-center shadow-[0_0_80px_rgba(220,38,38,0.2)]"
            >

              <div className="w-24 h-24 rounded-full bg-red-600/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">

                <FaCheckCircle className="text-5xl text-red-500" />

              </div>

              <h2 className="text-3xl font-black">
                Payment Successful
              </h2>

              <p className="text-gray-400 mt-4 leading-relaxed">
                Welcome to the transformation journey. Your coaching plan has been confirmed successfully.
              </p>

              <button
                onClick={() => setShowSuccess(false)}
                className="mt-8 px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-700 transition-all duration-300 font-semibold"
              >
                Continue
              </button>

            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= BACKGROUND GLOW ================= */}
      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute top-[-150px] left-[-120px] w-[420px] h-[420px] bg-red-600/20 blur-[170px] rounded-full"></div>

        <div className="absolute bottom-[-120px] right-[-100px] w-[420px] h-[420px] bg-red-500/10 blur-[170px] rounded-full"></div>

      </div>

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* ================= TOP SECTION ================= */}
        <div className="flex flex-col lg:flex-row justify-between gap-10 mb-14 mt-10">

          {/* LEFT */}
          <div className="max-w-2xl">

            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">

              <div className="w-2 h-2 rounded-full  bg-red-500 animate-pulse"></div>

              <p className="uppercase tracking-[4px] text-xs text-red-500">
                Secure Checkout
              </p>

            </div>

            <h1 className="text-5xl md:text-6xl font-black leading-[0.95]">

              Complete Your
              <span className="block text-red-500">
                Transformation
              </span>

            </h1>

            <p className="text-gray-400 mt-6 max-w-xl leading-relaxed">
              Choose your coaching plan, complete payment securely,
              and begin your fitness journey.
            </p>

          </div>

          {/* ================= STEP INDICATOR ================= */}
          <div className="flex items-center gap-4 self-start lg:self-center flex-wrap">

            {/* STEP 1 */}
            <button
              onClick={() =>
                detailsRef.current?.scrollIntoView({
                  behavior: "smooth",
                })
              }
              className="group flex items-center gap-3"
            >

              <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center font-bold group-hover:scale-110 transition">

                1

              </div>

              <div>
                <p className="text-xs uppercase tracking-[3px] text-gray-500">
                  Step
                </p>

                <h4 className="font-semibold">
                  Details
                </h4>
              </div>

            </button>

            <div className="w-12 h-[2px] bg-red-500 hidden md:block"></div>

            {/* STEP 2 */}
            <button
              onClick={() =>
                paymentRef.current?.scrollIntoView({
                  behavior: "smooth",
                })
              }
              className="group flex items-center gap-3"
            >

              <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center font-bold group-hover:scale-110 transition">

                2

              </div>

              <div>
                <p className="text-xs uppercase tracking-[3px] text-gray-500">
                  Step
                </p>

                <h4 className="font-semibold">
                  Payment
                </h4>
              </div>

            </button>

            <div className="w-12 h-[2px] bg-white/10 hidden md:block"></div>

            {/* STEP 3 */}
            <div className="flex items-center gap-3 opacity-80">

              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-gray-400">

                3

              </div>

              <div>
                <p className="text-xs uppercase tracking-[3px] text-gray-500">
                  Step
                </p>

                <h4 className="font-semibold">
                  Success
                </h4>
              </div>

            </div>

          </div>

        </div>

        {/* ================= MAIN GRID ================= */}
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10">

          {/* ================= LEFT SIDE ================= */}
          <div className="space-y-8">

            {/* PLAN CARD */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-[32px] bg-[#0d0d0d] border border-white/10 p-8"
            >

              <div className="flex justify-between items-start flex-wrap gap-6">

                <div>

                  <p className="uppercase text-xs tracking-[4px] text-red-500 mb-3">
                    Selected Program
                  </p>

                  <h2 className="text-3xl font-black">
                    {selectedPlan.title}
                  </h2>

                  <p className="text-gray-500 mt-3">
                    Personalized coaching for transformation
                  </p>

                </div>

                <div className="text-right">

                  <h2 className="text-4xl font-black text-red-500">
                    {selectedPlan.price}
                  </h2>

                  <p className="text-gray-500 mt-2">
                    {selectedPlan.duration}
                  </p>

                </div>

              </div>

              {/* FEATURES */}
              <div className="grid md:grid-cols-2 gap-5 mt-10">

                {[
                  `Goal: ${selectedPlan.goal}`,
                  `Schedule: ${selectedPlan.schedule}`,
                  "Custom Diet Plan",
                  "Weekly Progress Tracking",
                  "1-on-1 Coaching",
                  "24/7 Support",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-gray-300"
                  >

                    <FaCheckCircle className="text-red-500" />

                    <p>{item}</p>

                  </div>
                ))}

              </div>

            </motion.div>

            {/* ================= DETAILS SECTION ================= */}
            <motion.div
              ref={detailsRef}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-[32px] bg-[#0d0d0d] border border-white/10 p-8"
            >

              <div className="flex items-center gap-4 mb-8">

                <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center font-bold text-xl">

                  1

                </div>

                <div>
                  <p className="uppercase tracking-[4px] text-xs text-red-500">
                    Personal Info
                  </p>

                  <h3 className="text-2xl font-black">
                    Fill Your Details
                  </h3>
                </div>

              </div>

              <div className="grid md:grid-cols-2 gap-5">

                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-white/5 border border-transparent focus:border-red-500 rounded-2xl px-5 py-4 outline-none transition"
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="bg-white/5 border border-transparent focus:border-red-500 rounded-2xl px-5 py-4 outline-none transition"
                />

                <input
                  type="number"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="bg-white/5 border border-transparent focus:border-red-500 rounded-2xl px-5 py-4 outline-none transition"
                />

                <select
                  value={formData.goal}
                  onChange={(e) =>
                    setFormData({ ...formData, goal: e.target.value })
                  }
                  className="bg-white/5 border border-transparent focus:border-red-500 rounded-2xl px-5 py-4 outline-none text-gray-400 transition"
                >

                  <option value="">Choose Goal</option>
                  {dynamicGoals.map((g, i) => (
                    <option key={i} value={g}>{g}</option>
                  ))}
                  {dynamicGoals.length === 0 && (
                    <>
                      <option>Fat Loss</option>
                      <option>Muscle Gain</option>
                      <option>Strength</option>
                      <option>Conditioning</option>
                    </>
                  )}

                </select>

              </div>

            </motion.div>

          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div
            ref={paymentRef}
            className="space-y-8"
          >

            {/* ================= PAYMENT OPTIONS ================= */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-[32px] bg-[#0d0d0d] border border-white/10 p-8"
            >

              <div className="flex items-center gap-4 mb-8">

                <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center font-bold text-xl">

                  2

                </div>

                <div>
                  <p className="uppercase tracking-[4px] text-xs text-red-500">
                    Payment
                  </p>

                  <h3 className="text-2xl font-black">
                    Choose Payment Method
                  </h3>
                </div>

              </div>

              {/* PAYMENT METHODS */}
              <div className="grid grid-cols-2 gap-4">

                {[
                  {
                    name: "UPI",
                    icon: <FaQrcode />,
                  },
                  {
                    name: "Card",
                    icon: <FaCreditCard />,
                  },
                  {
                    name: "Bank",
                    icon: <FaUniversity />,
                  },
                  {
                    name: "PayPal",
                    icon: <FaPaypal />,
                  },
                ].map((method, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedPayment(method.name)}
                    className={`rounded-2xl p-5 border transition-all duration-300 flex flex-col items-center justify-center gap-3 ${
                      selectedPayment === method.name
                        ? "border-red-500 bg-red-600/10"
                        : "border-white/10 hover:border-red-500"
                    }`}
                  >

                    <div className="text-2xl text-red-500">
                      {method.icon}
                    </div>

                    <p className="font-medium">
                      {method.name}
                    </p>

                  </button>
                ))}

              </div>

              {/* QR SECTION */}
              {selectedPayment === "UPI" && (
                <div className="mt-8">

                  <div className="bg-white rounded-[28px] p-6 flex justify-center items-center">

                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`upi://pay?pa=${upiSettings.id}&pn=${encodeURIComponent(upiSettings.name)}${parsedPrice > 0 ? `&am=${parsedPrice.toFixed(2)}` : ""}`)}`}
                      alt="QR Code"
                      className="w-[230px] h-[230px]"
                    />

                  </div>

                  <div className="mt-5 text-center">

                    <p className="text-gray-400 text-sm">
                      Scan using any UPI app
                    </p>

                    <h4 className="mt-2 text-lg font-semibold text-red-500">
                      {upiSettings.id}
                    </h4>

                  </div>

                  <div className="mt-6 border-t border-white/10 pt-6">
                    <p className="text-center text-sm font-semibold mb-3">After payment, enter your UTR Number below:</p>
                    <input 
                      type="text" 
                      placeholder="12-DIGIT UTR NO." 
                      value={formData.utrNumber} 
                      onChange={(e) => setFormData({ ...formData, utrNumber: e.target.value })}
                      maxLength="12"
                      className="w-full bg-white/5 border border-white/10 focus:border-red-500 rounded-2xl px-5 py-4 outline-none transition text-center tracking-[4px] font-mono text-lg"
                    />
                    <p className="text-xs text-gray-500 text-center mt-2">Required to instantly auto-validate payment</p>
                  </div>

                  {/* Direct App Links for Mobile */}
                  <div className="mt-6 flex flex-col gap-3">
                    <a
                      href={`tez://upi/pay?pa=${upiSettings.id}&pn=${encodeURIComponent(upiSettings.name)}${parsedPrice > 0 ? `&am=${parsedPrice.toFixed(2)}` : ""}`}
                      className="w-full py-3 rounded-xl border border-white/10 hover:border-red-500 bg-black text-white text-center font-semibold transition-all"
                    >
                      Pay with GPay
                    </a>
                    <a
                      href={`phonepe://pay?pa=${upiSettings.id}&pn=${encodeURIComponent(upiSettings.name)}${parsedPrice > 0 ? `&am=${parsedPrice.toFixed(2)}` : ""}`}
                      className="w-full py-3 rounded-xl border border-white/10 hover:border-[#5f259f] bg-black text-white text-center font-semibold transition-all"
                    >
                      Pay with PhonePe
                    </a>
                    <a
                      href={`paytmmp://pay?pa=${upiSettings.id}&pn=${encodeURIComponent(upiSettings.name)}${parsedPrice > 0 ? `&am=${parsedPrice.toFixed(2)}` : ""}`}
                      className="w-full py-3 rounded-xl border border-white/10 hover:border-[#00baf2] bg-black text-white text-center font-semibold transition-all"
                    >
                      Pay with Paytm
                    </a>
                    <a
                      href={`upi://pay?pa=${upiSettings.id}&pn=${encodeURIComponent(upiSettings.name)}${parsedPrice > 0 ? `&am=${parsedPrice.toFixed(2)}` : ""}`}
                      className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-center font-semibold transition-all"
                    >
                      Open any UPI App
                    </a>
                  </div>

                </div>
              )}

            </motion.div>

            {/* ================= SECURITY ================= */}
            <div className="rounded-[32px] bg-[#0d0d0d] border border-white/10 p-8">

              <div className="flex items-center gap-3 mb-5">

                <FaShieldAlt className="text-red-500 text-xl" />

                <h3 className="text-xl font-black">
                  Secure Payment
                </h3>

              </div>

              <div className="space-y-4 text-gray-400 text-sm">

                <div className="flex items-center gap-3">
                  <FaLock className="text-red-500" />
                  <p>Encrypted & secure transactions</p>
                </div>

                <div className="flex items-center gap-3">
                  <FaLock className="text-red-500" />
                  <p>Instant payment verification</p>
                </div>

                <div className="flex items-center gap-3">
                  <FaLock className="text-red-500" />
                  <p>Safe & trusted checkout process</p>
                </div>

              </div>

              {/* CTA */}
              {status.message && (
                <p className="mt-6 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {status.message}
                </p>
              )}

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full mt-8 py-4 rounded-2xl bg-red-600 hover:bg-red-700 transition-all duration-300 font-semibold flex items-center justify-center gap-3"
              >

                {isSubmitting ? "Saving..." : "Complete Payment"}

                <FaArrowRight />

              </motion.button>

              <button className="w-full mt-4 py-4 rounded-2xl border border-white/10 hover:border-red-500 transition-all duration-300 flex items-center justify-center gap-2 text-gray-300">

                <FaArrowLeft />

                Back To Programs

              </button>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Checkout;

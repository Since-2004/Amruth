import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaCheckCircle, FaClock, FaPhoneAlt, FaVideo } from "react-icons/fa";
import { createBooking, getSlots, getOwnerSettings, getPrograms } from "../lib/api";
import { AnimatePresence } from "framer-motion";

function formatSlot(date) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

function Booking() {
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("amrut_user") || "null");
    } catch {
      return null;
    }
  }, []);
  const [slots, setSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [upiSettings, setUpiSettings] = useState({ id: "amruthfitness@upi", name: "Amruth Fitness" });
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    goal: "",
    notes: "",
  });
  const [dynamicPrograms, setDynamicPrograms] = useState([]);

  useEffect(() => {
    getSlots()
      .then((data) => {
        setSlots(data.slots);
        setSelectedSlotId(data.slots[0]?.id || "");
      })
      .catch((error) => setStatus({ type: "error", message: error.message }));

    getOwnerSettings().then((data) => {
      if (data.settings) {
        setUpiSettings({ id: data.settings.upiId, name: data.settings.upiName });
      }
    }).catch(console.error);

    getPrograms().then((data) => {
      if (data.programs) {
        setDynamicPrograms(data.programs);
      }
    }).catch(console.error);
  }, []);

  const selectedSlot = slots.find((slot) => slot.id === selectedSlotId);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.goal) {
      alert("Please fill all details");
      return;
    }
    setShowSuccess(true);
  };

  const handleConfirmPayment = async () => {
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });
    try {
      await createBooking({ ...formData, slotId: selectedSlotId });
      setShowSuccess(false);
      setFormData({ name: user?.name || "", email: user?.email || "", phone: "", goal: "", notes: "", utrNumber: "" });
      const data = await getSlots();
      setSlots(data.slots);
      alert("Booking & Payment Confirmed!");
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedProgramObj = dynamicPrograms.find(p => p.title === formData.goal);
  const selectedPrice = selectedProgramObj ? parseFloat(selectedProgramObj.price?.toString().replace(/,/g, '')) : 0;

  return (
    <section className="min-h-screen bg-[#050505] text-white px-6 py-28 relative overflow-hidden">
      
      {/* ================= SUCCESS / PAYMENT POPUP ================= */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-md flex items-center justify-center px-6 overflow-y-auto py-10"
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-md rounded-[32px] bg-[#0d0d0d] border border-brand-secondary/20 p-8 text-center shadow-[0_0_80px_rgba(220,38,38,0.2)] my-auto"
            >
              <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
                <FaCheckCircle className="text-4xl text-green-500" />
              </div>

              <h2 className="text-3xl font-black mb-2">Complete Payment</h2>
              <p className="text-gray-400 text-sm mb-6">
                Please complete your payment below to secure your slot.
                {!user && " Don't forget to create an account with the same email to view your diet plan and meet links."}
              </p>

              {selectedPrice > 0 && (
                <div className="mb-6 py-3 px-4 rounded-xl bg-brand-primary/10 border border-brand-secondary/20 inline-block">
                  <p className="text-sm text-gray-400 mb-1">Amount to Pay</p>
                  <p className="text-3xl font-black text-brand-secondary">₹{selectedPrice}</p>
                </div>
              )}

              {/* QR SECTION */}
              <div className="bg-white rounded-[24px] p-5 flex justify-center items-center mb-4">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=${upiSettings.id}&pn=${encodeURIComponent(upiSettings.name)}&am=${selectedPrice > 0 ? selectedPrice.toFixed(2) : ""}`)}`}
                  alt="QR Code"
                  className="w-[180px] h-[180px]"
                />
              </div>

              <p className="text-gray-400 text-sm">Scan using any UPI app</p>
              <h4 className="mt-1 text-lg font-semibold text-brand-secondary mb-6">{upiSettings.id}</h4>

              {/* Direct App Links for Mobile */}
              <div className="flex flex-col gap-3 mb-8">
                <a
                  href={`tez://upi/pay?pa=${upiSettings.id}&pn=${encodeURIComponent(upiSettings.name)}${selectedPrice > 0 ? `&am=${selectedPrice.toFixed(2)}` : ""}`}
                  className="w-full py-3 rounded-xl border border-white/10 hover:border-brand-secondary bg-black text-white text-center text-sm font-semibold transition-all"
                >
                  Pay with GPay
                </a>
                <a
                  href={`phonepe://pay?pa=${upiSettings.id}&pn=${encodeURIComponent(upiSettings.name)}${selectedPrice > 0 ? `&am=${selectedPrice.toFixed(2)}` : ""}`}
                  className="w-full py-3 rounded-xl border border-white/10 hover:border-[#5f259f] bg-black text-white text-center text-sm font-semibold transition-all"
                >
                  Pay with PhonePe
                </a>
                <a
                  href={`paytmmp://pay?pa=${upiSettings.id}&pn=${encodeURIComponent(upiSettings.name)}${selectedPrice > 0 ? `&am=${selectedPrice.toFixed(2)}` : ""}`}
                  className="w-full py-3 rounded-xl border border-white/10 hover:border-[#00baf2] bg-black text-white text-center text-sm font-semibold transition-all"
                >
                  Pay with Paytm
                </a>
              </div>

              <div className="mt-4 border-t border-white/10 pt-4 mb-6">
                <p className="text-center text-sm font-semibold mb-3">After payment, enter your UTR Number below:</p>
                <input 
                  type="text" 
                  placeholder="12-DIGIT UTR NO." 
                  value={formData.utrNumber || ""} 
                  onChange={(e) => setFormData({ ...formData, utrNumber: e.target.value })}
                  maxLength="12"
                  className="w-full bg-white/5 border border-white/10 focus:border-brand-secondary rounded-2xl px-5 py-4 outline-none transition text-center tracking-[4px] font-mono text-lg"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowSuccess(false)}
                  className="w-1/3 px-4 py-4 rounded-2xl border border-white/10 hover:bg-white/5 transition-all duration-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmPayment}
                  disabled={isSubmitting}
                  className="w-2/3 px-8 py-4 rounded-2xl bg-brand-primary hover:bg-brand-primary transition-all duration-300 font-semibold disabled:opacity-50"
                >
                  {isSubmitting ? "Confirming..." : "Confirm Booking"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[0.95fr_1.05fr] gap-10">
        <div>
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 mb-7">
            <span className="w-2 h-2 rounded-full bg-[var(--brand-secondary)]" />
            <p className="uppercase tracking-[4px] text-xs text-[var(--brand-secondary)]">
              One-on-One Sessions
            </p>
          </div>

          <h1 className="text-5xl md:text-6xl font-black leading-none">
            Book A Focused
            <span className="block text-[var(--brand-secondary)]">Coaching Slot</span>
          </h1>
          <p className="text-gray-400 mt-6 max-w-xl leading-relaxed">
            Pick an available slot for a personal training, nutrition, or transformation planning session.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 mt-10">
            {[
              { icon: <FaVideo />, label: "Online or offline" },
              { icon: <FaClock />, label: "60 minute focus" },
              { icon: <FaPhoneAlt />, label: "Owner notified" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-white/[0.04] border border-white/10 p-5">
                <div className="text-[var(--brand-secondary)] text-xl">{item.icon}</div>
                <p className="text-sm text-gray-300 mt-3">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] bg-[#0b0b0b] border border-white/10 p-6 md:p-8">
          <h2 className="text-2xl font-black mb-6">Available Slots</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {slots.map((slot) => (
              <button
                key={slot.id}
                type="button"
                onClick={() => setSelectedSlotId(slot.id)}
                disabled={slot.availableSeats <= 0}
                className={`text-left rounded-2xl border p-5 transition-all ${
                  selectedSlotId === slot.id
                    ? "border-[var(--brand-secondary)] bg-brand-primary/10"
                    : "border-white/10 bg-white/[0.03] hover:border-[var(--brand-secondary)]"
                } ${slot.availableSeats <= 0 ? "opacity-50" : ""}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <FaCalendarAlt className="text-[var(--brand-secondary)]" />
                  <span className="text-xs text-gray-400">{slot.availableSeats} seat left</span>
                </div>
                <h3 className="font-semibold mt-4">{slot.title}</h3>
                <p className="text-sm text-gray-400 mt-2">{formatSlot(slot.startsAt)}</p>
                <p className="text-xs uppercase tracking-[2px] text-gray-500 mt-3">{slot.mode}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="rounded-2xl bg-white/[0.03] border border-white/10 px-5 py-4 text-sm text-gray-300">
              Selected: {selectedSlot ? `${selectedSlot.title} - ${formatSlot(selectedSlot.startsAt)}` : "No slot selected"}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[var(--brand-secondary)]" />
              <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[var(--brand-secondary)]" />
              <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[var(--brand-secondary)]" />
              <select name="goal" value={formData.goal} onChange={handleChange} className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[var(--brand-secondary)] text-gray-400">
                <option value="">Choose Program</option>
                {dynamicPrograms.map((p, i) => (
                  <option key={i} value={p.title}>{p.title}</option>
                ))}
                {dynamicPrograms.length === 0 && (
                  <>
                    <option>Fat Loss Program</option>
                    <option>Muscle Building</option>
                    <option>Strength & Conditioning</option>
                    <option>Elite Transformation</option>
                  </>
                )}
              </select>
            </div>
            <textarea name="notes" value={formData.notes} onChange={handleChange} rows="4" placeholder="Anything the coach should know?" className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[var(--brand-secondary)] resize-none" />

            {status.message && (
              <p className={`rounded-2xl px-5 py-4 text-sm ${status.type === "success" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                {status.type === "success" && <FaCheckCircle className="inline mr-2" />}
                {status.message}
              </p>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={!selectedSlotId || isSubmitting}
              className="rounded-2xl bg-[var(--brand-primary)] hover:bg-[var(--brand-secondary)] py-4 font-semibold transition-colors"
            >
              {isSubmitting ? "Booking..." : "Book Session"}
            </motion.button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Booking;

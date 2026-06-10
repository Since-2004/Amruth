import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaCheckCircle, FaClock, FaPhoneAlt, FaVideo } from "react-icons/fa";
import { createBooking, getSlots } from "../lib/api";

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
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    goal: "",
    notes: "",
  });

  useEffect(() => {
    getSlots()
      .then((data) => {
        setSlots(data.slots);
        setSelectedSlotId(data.slots[0]?.id || "");
      })
      .catch((error) => setStatus({ type: "error", message: error.message }));
  }, []);

  const selectedSlot = slots.find((slot) => slot.id === selectedSlotId);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      await createBooking({ ...formData, slotId: selectedSlotId });
      setStatus({
        type: "success",
        message: "Your one-on-one session request has been booked.",
      });
      const data = await getSlots();
      setSlots(data.slots);
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#050505] text-white px-6 py-28">
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
                    ? "border-[var(--brand-secondary)] bg-red-600/10"
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
                <option value="">Choose Goal</option>
                <option>Fat Loss</option>
                <option>Muscle Gain</option>
                <option>Strength</option>
                <option>Nutrition Planning</option>
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

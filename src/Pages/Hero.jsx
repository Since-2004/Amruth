import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight, FaCalendarAlt, FaCheckCircle, FaDumbbell } from "react-icons/fa";
import bgremoved from "../assets/Images/bgremoved.png";

function Hero() {
  return (
    <section className="relative min-h-screen bg-black text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_45%,rgba(220,38,38,0.28),transparent_34%),linear-gradient(90deg,#000_0%,#050505_48%,rgba(0,0,0,0.72)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent to-black" />

      <div className="relative z-10 min-h-screen max-w-7xl mx-auto px-6 lg:px-10 pt-28 pb-10 grid lg:grid-cols-[1fr_0.9fr] gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/[0.04] mb-7">
            <span className="w-2 h-2 rounded-full bg-[var(--brand-secondary)]" />
            <p className="uppercase tracking-[4px] text-xs text-[var(--brand-secondary)]">
              Personal Fitness Coaching
            </p>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.9] uppercase">
            Train With
            <span className="block text-[var(--brand-secondary)]">Structure.</span>
            Transform With
            <span className="block">Discipline.</span>
          </h1>

          <p className="mt-7 max-w-xl text-gray-400 leading-relaxed">
            One-on-one coaching, slot-based sessions, custom training plans, and nutrition guidance for clients who want visible, sustainable progress.
          </p>

          <div className="flex flex-wrap gap-4 mt-9">
            <Link
              to="/booking"
              className="inline-flex items-center gap-3 px-7 py-4 rounded-full bg-[var(--brand-primary)] hover:bg-[var(--brand-secondary)] font-semibold transition-all hover:scale-105"
            >
              Book 1:1 Slot
              <FaArrowRight />
            </Link>
            <Link
              to="/programs"
              className="inline-flex items-center gap-3 px-7 py-4 rounded-full border border-white/15 hover:border-[var(--brand-secondary)] font-semibold transition-all"
            >
              View Programs
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-12 max-w-2xl">
            {[
              ["250+", "Clients"],
              ["6+", "Years"],
              ["1:1", "Sessions"],
            ].map(([value, label]) => (
              <div key={label} className="border-t border-white/10 pt-4">
                <h3 className="text-3xl font-black">{value}</h3>
                <p className="text-xs uppercase tracking-[3px] text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="relative min-h-[520px] hidden lg:block">
          <img
            src={bgremoved}
            alt="Amruth fitness trainer"
            className="absolute bottom-0 left-[45%] -translate-x-1/2 h-[min(78vh,720px)] object-contain z-10"
          />

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="absolute right-[-40px] xl:right-[-100px] top-[15%] z-20 w-[280px] rounded-[24px] border border-white/10 bg-black/60 backdrop-blur-xl p-5"
          >
            <div className="flex items-center gap-3 text-[var(--brand-secondary)]">
              <FaCalendarAlt />
              <p className="text-xs uppercase tracking-[3px]">Next Step</p>
            </div>
            <h3 className="text-2xl font-black mt-4">Reserve a private coaching slot</h3>
            <p className="text-sm text-gray-400 mt-3">Owner gets notified immediately when a client books.</p>
          </motion.div>

          <div className="absolute left-0 bottom-[12%] z-20 grid gap-3">
            {[
              [<FaDumbbell key="d" />, "Strength + physique"],
              [<FaCheckCircle key="c" />, "Nutrition guidance"],
            ].map(([icon, label]) => (
              <div key={label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/55 backdrop-blur-xl px-4 py-3">
                <span className="text-[var(--brand-secondary)]">{icon}</span>
                <p className="text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

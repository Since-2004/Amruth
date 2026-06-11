import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight, FaCalendarAlt, FaCheckCircle, FaDumbbell, FaChevronUp } from "react-icons/fa";
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

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[0.9] uppercase">
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
              className="inline-flex items-center gap-3 px-7 py-4 rounded-full border border-[var(--brand-secondary)] text-[var(--brand-secondary)] hover:bg-[var(--brand-secondary)] hover:text-white font-semibold transition-all"
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

        <div className="relative min-h-[450px] sm:min-h-[500px] lg:min-h-[520px] mt-10 lg:mt-0 flex justify-center lg:block">
          {/* Chevron Background */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="absolute top-[5%] lg:left-[40%] left-1/2 -translate-x-1/2 lg:-translate-x-0 z-0 pointer-events-none h-[90%] flex items-center"
          >
            <svg viewBox="0 0 600 800" className="h-full w-auto drop-shadow-2xl opacity-70 lg:opacity-100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="chevGradient" x1="0%" y1="50%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="#7f1d1d" stopOpacity="0" />
                  <stop offset="50%" stopColor="#b91c1c" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="var(--brand-primary)" stopOpacity="1" />
                </linearGradient>
              </defs>
              <path d="M0 0 L400 400 L0 800 L200 800 L600 400 L200 0 Z" fill="url(#chevGradient)" />
            </svg>
          </motion.div>

          <img
            src={bgremoved}
            alt="Amruth fitness trainer"
            className="absolute bottom-0 lg:left-[40%] left-1/2 -translate-x-1/2 w-full max-w-[500px] lg:max-w-[700px] h-full max-h-[600px] lg:max-h-[800px] object-contain object-bottom z-10 drop-shadow-2xl"
          />

          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="absolute lg:-right-8 xl:-right-16 lg:top-[35%] xl:top-[30%] bottom-6 right-4 sm:right-10 lg:bottom-auto z-20 w-[240px] lg:w-[280px] rounded-[20px] lg:rounded-[24px] border border-white/10 bg-black/60 backdrop-blur-xl p-4 lg:p-5 hidden sm:block"
          >
            <div className="flex items-center gap-2 lg:gap-3 text-[var(--brand-secondary)]">
              <FaCalendarAlt />
              <p className="text-[10px] lg:text-xs uppercase tracking-[3px]">Next Step</p>
            </div>
            <h3 className="text-xl lg:text-2xl font-black mt-3 lg:mt-4 leading-tight">Reserve a private coaching slot</h3>
            <p className="text-xs lg:text-sm text-gray-400 mt-2 lg:mt-3">Owner gets notified immediately when a client books.</p>
          </motion.div>

          <div className="absolute left-4 sm:left-10 lg:left-0 bottom-[15%] lg:bottom-[12%] z-20 grid gap-2 lg:gap-3">
            {[
              [<FaDumbbell key="d" />, "Strength + physique"],
              [<FaCheckCircle key="c" />, "Nutrition guidance"],
            ].map(([icon, label]) => (
              <div key={label} className="flex items-center gap-2 lg:gap-3 rounded-xl lg:rounded-2xl border border-white/10 bg-black/55 backdrop-blur-xl px-3 py-2 lg:px-4 lg:py-3 scale-90 lg:scale-100 origin-left">
                <span className="text-[var(--brand-secondary)]">{icon}</span>
                <p className="text-xs lg:text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

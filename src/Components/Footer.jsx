import { motion } from "framer-motion";
import {
  FaInstagram,
  FaWhatsapp,
  FaFacebook,
  FaArrowRight,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

import {
  Dumbbell,
  HeartPulse,
  Trophy,
  Flame,
  Activity,
  Target,
  ShieldCheck,
  TimerReset,
  Sparkles,
  ChevronRight,
} from "lucide-react";

import { Link } from "react-router-dom";

/* LOGO IMAGE */
import llogo from "../assets/Images/llogo.jpeg";

function Footer() {
  return (
    <footer className="relative bg-black text-white overflow-hidden pt-24 pb-10">

      {/* ================= BACKGROUND GLOW ================= */}
      <div className="absolute inset-0 overflow-hidden">

        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-red-600/20 blur-[160px] rounded-full"
        />

        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-[-120px] right-[-120px] w-[420px] h-[420px] bg-red-500/10 blur-[170px] rounded-full"
        />

      </div>

      {/* ================= FLOATING ICONS ================= */}
      <FloatingIcon icon={<Dumbbell size={38} />} className="top-10 left-10" />
      <FloatingIcon icon={<HeartPulse size={40} />} className="top-1/3 right-10" />
      <FloatingIcon icon={<Trophy size={34} />} className="bottom-20 left-16" />
      <FloatingIcon icon={<Flame size={30} />} className="top-20 right-1/3" />
      <FloatingIcon icon={<Activity size={32} />} className="bottom-32 right-24" />
      <FloatingIcon icon={<Target size={30} />} className="top-1/2 left-1/4" />
      <FloatingIcon icon={<ShieldCheck size={34} />} className="bottom-16 left-1/3" />
      <FloatingIcon icon={<TimerReset size={34} />} className="top-28 right-20" />
      <FloatingIcon icon={<Sparkles size={30} />} className="bottom-20 right-1/2" />

      {/* ================= MAIN CONTENT ================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">

        {/* ================= CTA CARD ================= */}
        <div className="relative rounded-[40px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl px-8 py-14 md:px-14 overflow-hidden">

          {/* TOP LIGHT */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />

          <div className="grid lg:grid-cols-2 gap-10 items-center">

            {/* LEFT SIDE */}
            <div>

              {/* MINI BADGE */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-6"
              >

                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />

                <p className="text-red-500 uppercase tracking-[4px] text-xs">
                  Start Your Journey
                </p>

              </motion.div>

              {/* HEADING */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-black leading-[1]"
              >
                Ready to Build
                <span className="block text-red-500">
                  Your Best Version?
                </span>
              </motion.h2>

              {/* DESCRIPTION */}
              <p className="text-gray-400 mt-5 max-w-xl leading-relaxed">
                Personalized coaching designed for fat loss, muscle gain,
                discipline, strength, confidence, and long-term transformation.
              </p>

              {/* STATS */}
              <div className="flex flex-wrap gap-4 mt-8">

                {[
                  { number: "250+", label: "Transformations" },
                  { number: "6+", label: "Years Experience" },
                  { number: "100%", label: "Coaching Support" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="px-5 py-4 rounded-2xl bg-black/40 border border-white/5 hover:border-red-500/40 transition-all duration-300"
                  >

                    <h4 className="text-2xl font-bold text-white">
                      {stat.number}
                    </h4>

                    <p className="text-xs text-gray-500 uppercase tracking-[2px] mt-1">
                      {stat.label}
                    </p>

                  </div>
                ))}

              </div>

            </div>

            {/* RIGHT SIDE */}
            <div className="flex flex-col gap-5">

              {/* CTA BUTTON */}
              <Link to={"/login"}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  className="group w-full py-5 rounded-2xl bg-red-600 hover:bg-red-700 transition-all duration-300 font-semibold flex items-center justify-center gap-3 shadow-lg shadow-red-600/20"
                >

                  Start Training Now

                  <FaArrowRight className="group-hover:translate-x-1 transition-all duration-300" />

                </motion.button>
              </Link>

              {/* FEATURES */}
              <div className="grid sm:grid-cols-2 gap-4">

                {[
                  "1-on-1 Coaching",
                  "Online Programs",
                  "Diet Guidance",
                  "Strength Training",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-red-500/30 transition-all duration-300"
                  >

                    <ChevronRight className="text-red-500 w-4 h-4" />

                    <p className="text-sm text-gray-300">
                      {item}
                    </p>

                  </div>
                ))}

              </div>

            </div>

          </div>

        </div>

        {/* ================= FOOTER GRID ================= */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12 border-t border-white/10 pt-14 mt-16">

          {/* ================= BRAND ================= */}
          <div>

            {/* LOGO + TITLE */}
            <div className="flex items-center gap-4">

              <div className="w-28 h-24 rounded-2xl overflow-hidden border-none  flex items-center justify-center backdrop-blur-md">

                <img
                  src={llogo}
                  alt="Amruth Ascend Logo"
                  className="w-full h-full object-contain p-2" />
              </div>

              <div>
                <h3 className="text-3xl font-black tracking-wide leading-none">
                  AMRUTH ASCEND
                </h3>

                <p className="text-xs uppercase tracking-[4px] text-red-500 mt-2">
                  Elite Fitness Coaching
                </p>
              </div>
            </div>

            {/* DESCRIPTION */}
            <p className="text-gray-500 mt-5 text-sm leading-relaxed">
              Certified personal trainer focused on physique transformation,
              discipline, strength development, and long-term fitness results.
            </p>

            {/* SOCIALS */}
            <div className="flex gap-4 mt-7 text-xl">
              {[FaInstagram, FaWhatsapp, FaFacebook].map((Icon, i) => (
                <motion.div
                  whileHover={{ y: -5 }}
                  key={i}
                  className="w-12 h-12 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center hover:border-red-500 hover:text-red-500 transition-all duration-300 cursor-pointer" >
                  <Icon />
                </motion.div>
              ))}

            </div>
          </div>

          {/* ================= QUICK LINKS ================= */}
         
<div>
  <h4 className="text-white font-semibold text-lg mb-5">
    Quick Links
  </h4>

  <ul className="space-y-4 text-gray-400">
    <li>
      <Link
        to="/"
        className="hover:text-red-500 transition-all duration-300 hover:translate-x-1 inline-block"
      >
        Home
      </Link>
    </li>

    <li>
      <Link
        to="/about"
        className="hover:text-red-500 transition-all duration-300 hover:translate-x-1 inline-block"
      >
        About
      </Link>
    </li>

    <li>
      <Link
        to="/programs"
        className="hover:text-red-500 transition-all duration-300 hover:translate-x-1 inline-block"
      >
        Programs
      </Link>
    </li>

    <li>
      <Link
        to="/testimonials"
        className="hover:text-red-500 transition-all duration-300 hover:translate-x-1 inline-block"
      >
        Testimonials
      </Link>
    </li>

    <li>
      <Link
        to="/contact"
        className="hover:text-red-500 transition-all duration-300 hover:translate-x-1 inline-block"
      >
        Contact
      </Link>
    </li>
  </ul>
</div>

          {/* ================= PROGRAMS ================= */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-5">
              Coaching Programs
            </h4>

            <ul className="space-y-4 text-gray-400">
              {[
                "Fat Loss Training",
                "Muscle Building",
                "Strength & Conditioning",
                "Self Defense",
                "Online Coaching",
              ].map((item, i) => (
                <li
                  key={i}
                  className="hover:text-red-500 cursor-pointer transition-all duration-300 hover:translate-x-1" >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* ================= CONTACT ================= */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-5">
              Contact Info
            </h4>

            <div className="space-y-5">
              {[
                {
                  icon: <FaPhoneAlt />,
                  title: "Phone",
                  value: "+91 98765 43210",
                },
                {
                  icon: <FaEnvelope />,
                  title: "Email",
                  value: "amruthfitness@gmail.com",
                },
                {
                  icon: <FaMapMarkerAlt />,
                  title: "Location",
                  value: "Bangalore, India",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">

                  <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-red-500">
                    {item.icon}
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-[2px]">
                      {item.title}
                    </p>

                    <h5 className="text-sm mt-1">
                      {item.value}
                    </h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= BOTTOM BAR ================= */}
        <div className="mt-14 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs text-center md:text-left">
            © {new Date().getFullYear()} Amruth Fitness. All rights reserved.
          </p>

          <p className="text-gray-700 text-xs uppercase tracking-[3px]">
            Discipline • Strength • Transformation
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ================= FLOATING ICON ================= */
function FloatingIcon({ icon, className }) {
  return (
    <motion.div
      animate={{
        y: [0, -15, 0],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 7,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`absolute text-red-500/20 ${className}`}
    >
      {icon}
    </motion.div>

    
  );
}

export default Footer;

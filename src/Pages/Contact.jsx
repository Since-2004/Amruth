import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaArrowRight,
} from "react-icons/fa";
import { sendContactMessage } from "../lib/api";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    goal: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      await sendContactMessage(formData);
      setStatus({
        type: "success",
        message: "Message sent. I will get back to you soon.",
      });
      setFormData({ name: "", email: "", goal: "", message: "" });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen bg-[#050505] text-white overflow-hidden py-28 px-6">

      {/* SOFT BACKGROUND GLOW */}
      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute top-[-180px] left-[-180px] w-[420px] h-[420px] bg-brand-primary/10 blur-[180px] rounded-full"></div>

        <div className="absolute bottom-[-180px] right-[-180px] w-[420px] h-[420px] bg-brand-secondary/5 blur-[180px] rounded-full"></div>

      </div>

      <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-2 gap-24 items-start">

        {/* ================= LEFT ================= */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >

          {/* TAG */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/5 bg-white/[0.03] mb-7">

            <div className="w-2 h-2 rounded-full bg-brand-secondary animate-pulse"></div>

            <p className="text-brand-secondary uppercase tracking-[4px] text-[11px]">
              Contact Me
            </p>

          </div>

          {/* HEADING */}
          <h2 className="text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight max-w-[520px]">

            Let’s Build

            <span className="block text-brand-secondary">
              Your Best Physique
            </span>

          </h2>

          {/* TEXT */}
          <p className="mt-5 text-gray-500 max-w-[500px] leading-relaxed text-[15px]">

            Whether your goal is fat loss, muscle gain, strength,
            or discipline — I’ll help you transform with structured coaching and real guidance.

          </p>

          {/* CONTACT INFO */}
          <div className="mt-12 space-y-6">

            {/* PHONE */}
            <motion.a
              href="tel:+917996131812"
              whileHover={{ x: 6 }}
              className="flex items-center gap-4 py-5 border-b border-white/5 hover:border-brand-secondary/30 transition-all duration-300"
            >

              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-secondary text-lg">

                <FaPhoneAlt />

              </div>

              <div>

                <p className="text-xs text-gray-500 uppercase tracking-[3px]">
                  Phone
                </p>

                <h4 className="text-lg font-medium mt-1">
                  +91 79961 31812
                </h4>

              </div>

            </motion.a>

            {/* EMAIL */}
            <motion.a
              href="mailto:amruthfitness@gmail.com"
              whileHover={{ x: 6 }}
              className="flex items-center gap-4 py-5 border-b border-white/5 hover:border-brand-secondary/30 transition-all duration-300"
            >

              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-secondary text-lg">

                <FaEnvelope />

              </div>

              <div>

                <p className="text-xs text-gray-500 uppercase tracking-[3px]">
                  Email
                </p>

                <h4 className="text-lg font-medium mt-1">
                  amruthfitness@gmail.com
                </h4>

              </div>

            </motion.a>

            {/* LOCATION */}
            <motion.a
              href="https://maps.app.goo.gl/h3XK4y6edgi5LcPh7?g_st=aw"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 6 }}
              className="flex items-center gap-4 py-5 border-b border-white/5 hover:border-brand-secondary/30 transition-all duration-300"
            >

              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-secondary text-lg">

                <FaMapMarkerAlt />

              </div>

              <div>

                <p className="text-xs text-gray-500 uppercase tracking-[3px]">
                  Location
                </p>

                <h4 className="text-lg font-medium mt-1">
                  Bangalore, India
                </h4>

              </div>

            </motion.a>

          </div>

          {/* SOCIALS */}
          <div className="flex gap-4 mt-10">

            <motion.a
              href="https://www.instagram.com/amrut_ascend.fit_official?igsh=Yjc1bmZpNTRucGho"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -5 }}
              className="w-12 h-12 rounded-xl border border-white/5 bg-white/[0.03] flex items-center justify-center text-lg hover:border-brand-secondary hover:text-brand-secondary transition-all duration-300 cursor-pointer"
            >

              <FaInstagram />

            </motion.a>

            <motion.a
              href="https://wa.me/917996131812"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -5 }}
              className="w-12 h-12 rounded-xl border border-white/5 bg-white/[0.03] flex items-center justify-center text-lg hover:border-brand-secondary hover:text-brand-secondary transition-all duration-300 cursor-pointer"
            >

              <FaWhatsapp />

            </motion.a>

          </div>

        </motion.div>

        {/* ================= RIGHT ================= */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >

          <div className="relative rounded-[30px] border border-white/5 bg-[#0b0b0b] p-8 md:p-10 overflow-hidden">

            {/* TOP LINE */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-secondary to-transparent"></div>

            <h3 className="text-3xl font-bold">
              Send a Message
            </h3>

            <div className="w-16 h-[2px] bg-brand-secondary rounded-full mt-5 mb-7"></div>

            <p className="text-gray-500 mb-8 text-sm leading-relaxed">

              Fill out the form below and let’s start your transformation journey.

            </p>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* NAME */}
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-5 py-4 outline-none focus:border-brand-secondary transition-all duration-300"
              />

              {/* EMAIL */}
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-5 py-4 outline-none focus:border-brand-secondary transition-all duration-300"
              />

              {/* GOAL */}
              <select
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-5 py-4 outline-none focus:border-brand-secondary text-gray-400"
              >

                <option value="">Choose Your Goal</option>
                <option>Fat Loss</option>
                <option>Muscle Gain</option>
                <option>Strength Training</option>
                <option>Conditioning</option>
                <option>Online Coaching</option>

              </select>

              {/* MESSAGE */}
              <textarea
                rows="5"
                name="message"
                placeholder="Tell me about your goals..."
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-5 py-4 outline-none focus:border-brand-secondary transition-all duration-300 resize-none"
              ></textarea>

              {status.message && (
                <p
                  className={`rounded-xl px-4 py-3 text-sm ${
                    status.type === "success"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {status.message}
                </p>
              )}

              {/* BUTTON */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-brand-primary hover:bg-brand-primary transition-all duration-300 font-semibold flex items-center justify-center gap-3 mt-3"
              >

                {isSubmitting ? "Sending..." : "Send Message"}

                <FaArrowRight />

              </motion.button>

            </form>

          </div>

        </motion.div>

      </div>

    </section>
  );
}

export default Contact;

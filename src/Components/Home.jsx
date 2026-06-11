import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
} from "react-icons/fa";

import Hero from "../Pages/Hero";

function Home() {
  /* ================= STATE ================= */
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  /* ================= DATA ================= */
  const stats = [
    { value: "250+", label: "Transformations" },
    { value: "6+", label: "Years Experience" },
    { value: "100%", label: "Custom Coaching" },
  ];

  const whyTrain = [
    {
      title: "Personalized Coaching",
      desc: "Training plans customized based on your body, goals, strength level, and lifestyle.",
    },
    {
      title: "Fat Loss & Muscle Gain",
      desc: "Structured workout systems focused on visible physique transformation and performance.",
    },
    {
      title: "Discipline & Mindset",
      desc: "Build confidence, consistency, and mental strength through disciplined coaching.",
    },
    {
      title: "Self Defense Training",
      desc: "Learn self-defense and athletic movement from karate-based performance training.",
    },
  ];

  const pricingPlans = [
    {
      tag: "Beginner Plan",
      title: "1 Month",
      desc: "Perfect for people starting their fitness journey and wanting structured guidance.",
      features: ["Fat Loss", "Muscle Building", "Basic Conditioning", "Beginner Friendly"],
      highlight: false,
    },
    {
      tag: "Most Popular",
      title: "2 Months",
      desc: "Best for noticeable physique transformation and building consistent habits.",
      features: ["Fat Loss + Muscle Gain", "Strength Development", "Core Strengthening", "Nutrition Guidance"],
      highlight: true,
    },
    {
      tag: "Elite Plan",
      title: "6 Months",
      desc: "Long-term transformation plan for complete physique and performance development.",
      features: ["Complete Body Transformation", "Strength & Athleticism", "Advanced Coaching", "Self Defense Training"],
      highlight: false,
    },
  ];

  const testimonials = [
    {
      name: "Dr Yashaswini",
      role: "Dentist",
      text: "Before starting personal training, I struggled with inconsistency in my fitness routine and overall discipline. After joining Amruth's coaching program, I experienced a significant improvement in both my physical health and mental well-being. The structured guidance and accountability helped me stay consistent and build a healthier lifestyle.",
      initial: "Y",
    },
    {
      name: "Owisha G",
      role: "Student",
      text: "My main goal was overall conditioning and improving endurance, but I struggled with dieting and staying consistent. After starting training with Amruth, my routine became much more structured, and maintaining my diet became easier. Over time, I developed better discipline and noticeable improvements in my overall fitness.",
      initial: "G",
    },
    {
      name: "Alby Shajan",
      role: "Student",
      text: "I was struggling with consistency in my workouts and maintaining a proper routine. I also found it difficult to manage my diet and stay motivated regularly. After starting training, I became more disciplined and consistent with both workouts and nutrition. I now feel more active, confident, and physically stronger.",
      initial: "A",
    },
    {
      name: "Sushil Kumar",
      role: "Student",
      text: "I was inconsistent with my workouts and diet and often felt lazy and unmotivated. Training with Amruth helped me become much more consistent in both areas. The sessions were well-structured with proper personal attention, and the coaching provided good knowledge with a strong focus on correct form.",
      initial: "S",
    },
    {
      name: "Aron Mathew",
      role: "Student",
      text: "I initially lacked proper form and consistency in my training. Through guided coaching, I was able to improve my technique and start seeing better results. The sessions were also engaging, and the supportive environment made workouts more enjoyable and helped me stay motivated.",
      initial: "A",
    },
    {
      name: "Pruthvi",
      role: "Student",
      text: "I initially lacked confidence and felt unsure about my fitness journey. After starting training, I gradually built better confidence along with noticeable improvements in my physical strength and overall mindset. The guidance helped me stay consistent and more self-assured in my progress.",
      initial: "P",
    },
    {
      name: "Lionel Deon Perara",
      role: "Student",
      text: "I was very skinny and struggled with maintaining a proper diet and structured eating habits. After starting training with Amruth, I learned how to follow a consistent nutrition plan along with proper workouts. Over time, I noticed improvements in my physique, energy levels, and overall confidence.",
      initial: "L",
    },
    {
      name: "Lakshman",
      role: "Student",
      text: "I was focused on fat loss and muscle building but wasn't seeing any noticeable results despite my efforts. After starting personal training with Amruth, my approach became more structured with proper guidance on workouts and nutrition. Over time, I developed a better physique with visible improvements in strength and body composition.",
      initial: "L",
    },
    {
      name: "Sandeep G",
      role: "Consultant",
      text: "I was overweight with low strength and stamina. My goal was to reshape my body and improve overall fitness levels. Training with Amruth was very helpful, as he provided consistent guidance, motivation, and structured workouts. Over time, I noticed improvements in my strength, stamina, and overall body composition.",
      initial: "S",
    },
  ];

  const faqData = [
    {
      question: "Do I need gym experience to start training?",
      answer: "No, beginners are fully welcome. Training is customized based on your current fitness level and gradually progressed.",
    },
    {
      question: "Will I get a diet plan?",
      answer: "Yes, personalized nutrition guidance is provided based on your goals like fat loss, muscle gain, or conditioning.",
    },
    {
      question: "How long before I see results?",
      answer: "Most clients start noticing visible changes in 4–8 weeks depending on consistency and adherence to training.",
    },
    {
      question: "Do you provide online coaching?",
      answer: "Yes, both online and offline coaching options are available depending on your location and preference.",
    },
    {
      question: "Can I build muscle and lose fat at the same time?",
      answer: "Yes, with proper training, nutrition, and consistency, body recomposition is absolutely possible.",
    },
    {
      question: "What makes your training different?",
      answer: "Training is fully personalized with focus on form, discipline, consistency, and long-term transformation.",
    },
  ];


  return (
    <>
        <Hero />

      {/* ================= ABOUT ================= */}
      <section
        id="about-section"
        className="relative w-full py-20 bg-[#070707] overflow-hidden"
      >
        <div className="absolute top-[-120px] right-[-100px] w-[280px] h-[280px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10">

          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] mb-8">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <p className="text-red-500 uppercase tracking-[4px] text-xs">About Me</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">

            <div className="max-w-[600px]">
              <h2 className="uppercase text-[2.8rem] sm:text-[3.8rem] lg:text-[4.3rem] text-white leading-[0.95] tracking-tight">
                Fitness With
                <span className="block bg-gradient-to-r from-red-900 via-red-600 to-red-400 bg-clip-text text-transparent">
                  Discipline &amp; Purpose
                </span>
              </h2>
              <p className="mt-6 text-gray-400">
                I'm <span className="text-white font-semibold">Amruth</span>, a
                fitness trainer helping people transform their bodies and mindset
                through structured, disciplined coaching.
              </p>
              <Link to="/login">
                <button className="mt-8 px-7 py-3.5 rounded-full bg-gradient-to-r from-red-900 via-red-600 to-red-400 text-white uppercase tracking-[2px] text-sm hover:scale-105 transition-all duration-300">
                  Start Your Journey
                </button>
              </Link>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-[#101010] p-7 hover:border-red-500 transition-all duration-300">
              <h3 className="text-white text-2xl mb-6">
                "Consistency creates confidence. Discipline builds results."
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {stats.slice(0, 2).map((item, i) => (
                  <div key={i} className="bg-white/[0.03] p-5 rounded-2xl border border-white/8">
                    <h4 className="text-3xl text-white font-bold">{item.value}</h4>
                    <p className="text-gray-400 text-xs mt-1">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= WHY TRAIN ================= */}
      <section id="why-train-section" className="py-20 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] mb-6">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <p className="text-red-500 uppercase tracking-[4px] text-xs">Why Train</p>
          </div>

          <h2 className="text-white text-4xl uppercase mb-10">
            More Than Just <span className="text-red-500">A Workout Plan</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyTrain.map((w, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#101010] border border-white/8 hover:border-red-500 transition-all duration-300 hover:-translate-y-1"
              >
                <h3 className="text-white font-semibold">{w.title}</h3>
                <p className="text-gray-400 text-sm mt-3 leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= PRICING ================= */}
      <section id="pricing-section" className="py-20 bg-[#070707]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] mb-6">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <p className="text-red-500 uppercase tracking-[4px] text-xs">Pricing</p>
          </div>

          <h2 className="text-white text-4xl uppercase mb-10">
            Choose Your <span className="text-red-500">Transformation Plan</span>
          </h2>

          <div className="grid lg:grid-cols-3 gap-7">
            {pricingPlans.map((p, i) => (
              <div
                key={i}
                className={`p-8 rounded-3xl border transition-all duration-300 hover:scale-[1.02]
                  ${p.highlight
                    ? "bg-[#150505] border-red-500/40 shadow-[0_0_40px_rgba(220,38,38,0.1)]"
                    : "bg-[#101010] border-white/8 hover:border-red-500"
                  }`}
              >
                <p className="text-red-500 text-xs uppercase tracking-widest">{p.tag}</p>
                <h3 className="text-white text-3xl font-bold mt-4">{p.title}</h3>
                <p className="text-gray-400 mt-3 text-sm leading-relaxed">{p.desc}</p>
                <ul className="mt-5 text-gray-300 text-sm space-y-2">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/contact">
                  <button className="mt-7 w-full bg-red-600 hover:bg-red-500 py-3 rounded-full text-white font-semibold transition-all duration-300 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                    Contact Now
                  </button>
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section
        id="testimonials-section"
        className="relative py-24 bg-[#070707] overflow-hidden"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-120px] left-[-120px] w-[380px] h-[380px] bg-red-600/10 blur-[140px] rounded-full" />
          <div className="absolute bottom-[-140px] right-[-100px] w-[420px] h-[420px] bg-red-500/10 blur-[160px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">
            <div>
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] mb-5">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <p className="text-red-500 uppercase tracking-[4px] text-xs">Testimonials</p>
              </div>
              <h2 className="text-4xl md:text-5xl font-black leading-tight text-white">
                Real Stories.
                <span className="block text-red-500">Real Transformations.</span>
              </h2>
            </div>
          </div>

          {/* Slider (Marquee) */}
          <div className="overflow-hidden relative flex">
            <motion.div
              className="flex gap-6 whitespace-nowrap w-max"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ ease: "linear", duration: 40, repeat: Infinity }}
            >
              {[...testimonials, ...testimonials].map((t, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -4 }}
                  className="min-w-[320px] md:min-w-[400px] lg:min-w-[420px]
                    rounded-[32px] bg-gradient-to-b from-[#141414] to-[#0b0b0b]
                    border border-white/5 hover:border-red-500/40
                    p-8 transition-all duration-500 relative overflow-hidden whitespace-normal"
                >
                  <div className="absolute inset-0 opacity-0 hover:opacity-100 transition duration-500 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                  </div>
                  <div className="text-6xl text-red-500/20 font-black leading-none">"</div>
                  <p className="mt-4 text-gray-300 leading-relaxed text-[15px]">{t.text}</p>
                  <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-red-600/20">
                      {t.initial}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold tracking-wide">{t.name}</h4>
                      <p className="text-gray-500 text-sm mt-1">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Bottom stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-16">
            {[
              { number: "250+", label: "Transformations" },
              { number: "98%", label: "Client Satisfaction" },
              { number: "6+", label: "Years Experience" },
              { number: "100%", label: "Personal Coaching" },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/[0.03] border border-white/5 p-6 text-center hover:border-red-500/30 hover:-translate-y-1 transition-all duration-300"
              >
                <h3 className="text-3xl font-black text-white">{item.number}</h3>
                <p className="text-xs uppercase tracking-[3px] text-gray-500 mt-2">{item.label}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section id="faq-section" className="py-20 bg-[#050505]">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">

          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] mb-6">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <p className="text-red-500 uppercase tracking-[4px] text-xs">FAQ</p>
          </div>

          <h2 className="text-white text-4xl uppercase mb-10">
            Frequently Asked <span className="text-red-500">Questions</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {faqData.map((faq, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl bg-[#101010] border border-white/8 hover:border-red-500 transition-all duration-300"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-white text-base font-semibold pr-4">{faq.question}</h3>
                  <FaChevronDown className="text-white/40 group-hover:text-red-500 transition-all duration-300 group-hover:rotate-180 flex-shrink-0" />
                </div>
                <p className="text-gray-400 text-sm mt-3 opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-40 overflow-hidden transition-all duration-300">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}

export default Home;

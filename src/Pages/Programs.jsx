import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaDumbbell,
  FaFire,
  FaClock,
  FaCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { getPrograms } from "../lib/api";

const fallbackPrograms = [
    {
      id: "fat-loss",
      title: "Fat Loss Program",
      duration: "8 Weeks",
      schedule: "5 Days / Week",
      goals: ["Fat Reduction", "Conditioning", "Core Strength"],
      results:
        "Lose body fat, improve stamina, and build discipline through structured workouts.",
      icon: <FaFire />,
    },

    {
      id: "muscle-building",
      title: "Muscle Building",
      duration: "12 Weeks",
      schedule: "6 Days / Week",
      goals: ["Muscle Gain", "Hypertrophy", "Strength"],
      results:
        "Build lean muscle mass while improving overall strength and physique aesthetics.",
      icon: <FaDumbbell />,
    },

    {
      id: "strength-conditioning",
      title: "Strength & Conditioning",
      duration: "10 Weeks",
      schedule: "4 Days / Week",
      goals: ["Athleticism", "Endurance", "Power"],
      results:
        "Boost athletic performance, explosiveness, conditioning, and recovery.",
      icon: <FaCheckCircle />,
    },
];

const programIcons = {
  "fat-loss": <FaFire />,
  "muscle-building": <FaDumbbell />,
  "strength-conditioning": <FaCheckCircle />,
};

function Programs() {
  const [programs, setPrograms] = useState(fallbackPrograms);

  useEffect(() => {
    getPrograms()
      .then((data) => {
        const visiblePrograms = data.programs
          .filter((program) => program.id !== "elite-transformation")
          .map((program) => ({
            ...program,
            icon: programIcons[program.id] || <FaCheckCircle />,
          }));

        setPrograms(visiblePrograms.length ? visiblePrograms : fallbackPrograms);
      })
      .catch(() => setPrograms(fallbackPrograms));
  }, []);

  return (
    <section className="relative min-h-screen bg-[#050505] text-white overflow-hidden py-28 px-6">

      {/* ================= BACKGROUND GLOW ================= */}
      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute top-[-150px] left-[-150px] w-[380px] h-[380px] bg-red-600/10 blur-[180px] rounded-full"></div>

        <div className="absolute bottom-[-180px] right-[-180px] w-[420px] h-[420px] bg-red-500/5 blur-[180px] rounded-full"></div>

      </div>

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* ================= TOP SECTION ================= */}
        <div className="text-center max-w-3xl mx-auto">

          {/* TAG */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] mb-7">

            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>

            <p className="text-red-500 uppercase tracking-[4px] text-[11px]">
              Coaching Programs
            </p>

          </div>

          {/* HEADING */}
          <h2 className="text-4xl md:text-6xl font-black leading-[1]">

            Choose Your

            <span className="block text-red-500">
              Transformation Plan
            </span>

          </h2>

          {/* SUBTEXT */}
          <p className="mt-6 text-gray-500 leading-relaxed max-w-2xl mx-auto">

            Personalized coaching programs designed for fat loss,
            muscle gain, conditioning, strength, and complete transformation.

          </p>

        </div>

        {/* ================= PROGRAM CARDS ================= */}
        <div className="grid lg:grid-cols-3 gap-8 mt-20">

          {programs.map((program, index) => (

            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.35 }}
              className="
                relative
                rounded-[30px]
                overflow-hidden
                bg-[#0b0b0b]
                p-8
                group
                border border-transparent
                hover:border-red-500/40
                transition-all duration-500
              "
            >

              {/* TOP GLOW */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-0 group-hover:opacity-70 transition duration-500"></div>

              {/* HOVER GLOW */}
              <div className="absolute inset-0 bg-red-600/[0.03] opacity-0 group-hover:opacity-100 transition duration-500"></div>

              {/* ICON */}
              <div className="relative z-10 w-16 h-16 rounded-2xl bg-red-600/10 text-red-500 flex items-center justify-center text-2xl group-hover:scale-110 transition duration-300">

                {program.icon}

              </div>

              {/* TITLE */}
              <h3 className="relative z-10 text-3xl font-bold mt-7">
                {program.title}
              </h3>

              {/* DETAILS */}
              <div className="relative z-10 space-y-4 mt-8">

                {/* DURATION */}
                <div className="flex items-center gap-3 text-gray-300">

                  <FaClock className="text-red-500" />

                  <p>{program.duration}</p>

                </div>

                {/* SCHEDULE */}
                <div className="flex items-center gap-3 text-gray-300">

                  <FaCalendarAlt className="text-red-500" />

                  <p>{program.schedule}</p>

                </div>

              </div>

              {/* GOALS */}
              <div className="relative z-10 mt-8">

                <p className="text-sm uppercase tracking-[3px] text-gray-500 mb-4">
                  Goals
                </p>

                <div className="flex flex-wrap gap-3">

                  {program.goals.map((goal, i) => (
                    <div
                      key={i}
                      className="px-4 py-2 rounded-full bg-white/[0.03] text-sm text-gray-300"
                    >
                      {goal}
                    </div>
                  ))}

                </div>

              </div>

              {/* RESULTS */}
              <div className="relative z-10 mt-8">

                <p className="text-sm uppercase tracking-[3px] text-gray-500 mb-3">
                  Expected Results
                </p>

                <p className="text-gray-400 leading-relaxed text-sm">
                  {program.results}
                </p>

              </div>

              {/* CTA BUTTON */}
             <Link to={"/Checkout"}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="
                  relative z-10
                  mt-10
                  w-full
                  py-4
                  rounded-xl
                  bg-white/[0.04]
                  hover:bg-red-600
                  font-semibold
                  flex
                  items-center
                  justify-center
                  gap-3
                  transition-all
                  duration-300 ">
                Join Program
                <FaArrowRight />
              </motion.button>
               </Link>
            </motion.div>
            

          ))}

        </div>

        {/* ================= CTA SECTION ================= */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative mt-28 rounded-[40px] bg-[#0b0b0b] overflow-hidden"
        >

          {/* GLOW */}
          <div className="absolute inset-0">

            <div className="absolute top-[-100px] right-[-100px] w-[260px] h-[260px] bg-red-600/10 blur-[120px] rounded-full"></div>

          </div>

          <div className="relative z-10 px-8 md:px-16 py-16 text-center">

            <h3 className="text-4xl md:text-5xl font-black leading-tight">

              Ready To Start Your

              <span className="block text-red-500">
                Transformation Journey?
              </span>

            </h3>

            <p className="text-gray-500 mt-6 max-w-2xl mx-auto leading-relaxed">

              Get personalized workout plans, nutrition guidance,
              accountability, and coaching designed for real results.

            </p>

            {/* CTA BUTTONS */}
            <div className="flex flex-wrap justify-center gap-5 mt-10">

              <Link to={"/login"}>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 rounded-xl bg-red-600 hover:bg-red-700 font-semibold flex items-center gap-3 transition-all duration-300"
              >

                Start Coaching

                <FaArrowRight />

              </motion.button>
              </Link>

             <Link to={"/transformations"}>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] transition-all duration-300"
              >

                View Transformations

              </motion.button>
             </Link>

            </div>

          </div>

        </motion.div>

      </div>

    </section>
  );
}

export default Programs;

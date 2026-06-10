import { Link } from "react-router-dom";
import bgremoved from "../assets/Images/bgremoved.png";

function About() {
  return (
    <div className="w-full bg-black text-white overflow-hidden">

      {/* ================= SECTION 1: INTRO ================= */}
      <section className="relative py-24">

        <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-red-600/20 blur-[150px] rounded-full"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">

          <h2 className="text-4xl md:text-5xl font-black">
            About <span className="text-red-500">Me</span>
          </h2>

          <p className="mt-6 text-gray-400 max-w-2xl mx-auto leading-relaxed">
            I’m <span className="text-white font-semibold">Amruth</span>, a certified fitness trainer
            focused on transforming bodies and building discipline through structured coaching.
            My journey is built on martial arts, strength training, and real-life transformation experience.
          </p>

        </div>
      </section>

      {/* ================= SECTION 2: JOURNEY ================= */}
      <section className="bg-[#050505] py-24">

        <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-24">

          {/* BLOCK 1 */}
          <div className="grid md:grid-cols-2 items-center gap-10 relative">

            <div className="relative">
              <img
                src={bgremoved}
                className="w-full h-[420px] object-cover rounded-3xl"
              />

              <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-r from-black/80 to-transparent"></div>
            </div>

            <div>
              <h3 className="text-3xl font-bold">The Beginning</h3>
              <p className="mt-4 text-gray-400 leading-relaxed">
                My journey started with basic workouts and martial arts training.
                I learned discipline early, which shaped my foundation for fitness and mindset development.
              </p>
            </div>

          </div>

          {/* BLOCK 2 */}
          <div className="grid md:grid-cols-2 items-center gap-10 relative">

            <div className="order-2 md:order-1">
              <h3 className="text-3xl font-bold">Growth & Coaching Era</h3>
              <p className="mt-4 text-gray-400 leading-relaxed">
                I moved into personal training, helping clients achieve fat loss, muscle gain,
                and strength transformation through structured coaching systems.
              </p>
            </div>

            <div className="relative order-1 md:order-2">
              <img
                src={bgremoved}
                className="w-full h-[420px] object-cover rounded-3xl"
              />

              <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-l from-black/80 to-transparent"></div>
            </div>

          </div>

        </div>
      </section>

      {/* ================= SECTION 3: CTA ================= */}
      <section className="relative py-24 bg-black">

        <div className="absolute bottom-[-120px] left-[-120px] w-[450px] h-[450px] bg-red-600/20 blur-[160px] rounded-full"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">

          <h2 className="text-4xl md:text-5xl font-black">
            Ready to Start Your
            <span className="block text-red-500">Transformation?</span>
          </h2>

          <p className="text-gray-400 mt-6 max-w-xl mx-auto">
            Join structured coaching programs designed for real results — strength, discipline, and transformation.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">

            <Link to={"/login"}>
            
            </Link>

            <Link to={"/contact"}>
            <button className="px-8 py-4 border border-white/15 hover:border-red-500 transition rounded-full">
              Contact Me
            </button>
            </Link>

          </div>

        </div>
      </section>

    </div>
  );
}

export default About;

import { useState, useEffect } from "react";
import { submitFeedback, getTransformations } from "../lib/api";

const Testimonials = () => {
  const [transformations, setTransformations] = useState([]);
  /* ================= FORM STATES ================= */
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getTransformations().then(data => {
      if (data.transformations) setTransformations(data.transformations);
    }).catch(err => console.error("Failed to load transformations:", err));
  }, []);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= HANDLE SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    /* VALIDATION */
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      alert("Please fill all fields before submitting.");
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      await submitFeedback(formData);
      setStatus({
        type: "success",
        message: "Feedback submitted successfully.",
      });
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative w-full bg-black py-24 overflow-hidden">

      {/* RED GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-brand-primary/20 blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-[5%]">

        {/* ================= HEADING ================= */}
        <div className="text-center mb-20">

          <p className="uppercase tracking-[6px] text-brand-secondary text-sm mb-4">
            TRANSFORMATIONS
          </p>

          <h2
            className="text-white uppercase leading-none"
            style={{
              fontSize: "clamp(3rem, 7vw, 5.5rem)",
              fontFamily: "var(--font-heading)",
            }}
          >
            BEFORE.
            <br />

            <span className="text-brand-primary">
              AFTER.
            </span>
          </h2>

          <p className="max-w-2xl mx-auto mt-6 text-gray-400 leading-relaxed">
            Real body transformations built through discipline, structured
            training, and consistency.
          </p>
        </div>

        {/* ================= CARDS ================= */}
        <div className="grid lg:grid-cols-3 gap-8">

          {transformations.map((item) => (
            <div
              key={item.id}
              className="
                group
                relative
                overflow-hidden
                rounded-[28px]
                bg-[#0b0b0b]
                border
                border-red-900/20
                hover:border-brand-primary/40
                hover:-translate-y-2
                transition-all
                duration-500
              "
            >

              {/* IMAGES */}
              <div className="grid grid-cols-2 relative">

                {/* BEFORE */}
                <div className="relative h-[320px] overflow-hidden">

                  <img
                    src={item.before}
                    alt="before"
                    className="
                      w-full
                      h-full
                      object-cover
                      group-hover:scale-105
                      duration-700
                    "
                  />

                  <div className="absolute inset-0 bg-black/30" />

                  <div
                    className="
                      absolute
                      bottom-4
                      left-1/2
                      -translate-x-1/2
                      px-4
                      py-2
                      rounded-full
                      text-xs
                      tracking-[2px]
                      font-bold
                      bg-black/70
                      border
                      border-white/10
                      text-white
                    "
                  >
                    BEFORE
                  </div>
                </div>

                {/* AFTER */}
                <div className="relative h-[320px] overflow-hidden">

                  <img
                    src={item.after}
                    alt="after"
                    className="
                      w-full
                      h-full
                      object-cover
                      group-hover:scale-105
                      duration-700
                    "
                  />

                  <div className="absolute inset-0 bg-black/10" />

                  <div
                    className="
                      absolute
                      bottom-4
                      left-1/2
                      -translate-x-1/2
                      px-4
                      py-2
                      rounded-full
                      text-xs
                      tracking-[2px]
                      font-bold
                      bg-brand-primary
                      text-white
                    "
                  >
                    AFTER
                  </div>
                </div>

                {/* DIVIDER */}
                <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[2px] h-full bg-gradient-to-b from-transparent via-brand-primary to-transparent" />
              </div>

              {/* CONTENT */}
              <div className="p-7">

                <div
                  className="
                    inline-flex
                    items-center
                    px-4
                    py-2
                    rounded-full
                    bg-red-950/40
                    border
                    border-brand-primary/30
                    text-red-400
                    text-sm
                    font-semibold
                    mb-5
                  "
                >
                  {item.result}
                </div>

                <h3 className="text-white text-2xl font-bold mb-1">
                  {item.name}
                </h3>

                <p className="text-gray-500 text-sm uppercase tracking-[2px] mb-5">
                  {item.role}
                </p>

                <p className="text-gray-300 leading-relaxed text-[15px]">
                  "{item.review}"
                </p>
              </div>

              {/* GLOW */}
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-brand-primary/10 rounded-full blur-3xl group-hover:bg-brand-primary/20 transition-all duration-500" />
            </div>
          ))}
        </div>

        {/* ================= FEEDBACK FORM ================= */}
        <div
          className="
            mt-24
            max-w-4xl
            mx-auto
            rounded-[28px]
            bg-[#0b0b0b]
            border
            border-red-900/20
            p-8
            lg:p-10
          "
        >

          {/* HEADING */}
          <div className="text-center mb-10">

            <p className="uppercase tracking-[5px] text-brand-secondary text-sm mb-4">
              SHARE YOUR EXPERIENCE
            </p>

            <h2
              className="text-white uppercase"
              style={{
                fontSize: "clamp(2rem,5vw,4rem)",
                fontFamily: "var(--font-heading)",
              }}
            >
              CLIENT FEEDBACK
            </h2>

            <p className="text-gray-400 mt-4 max-w-xl mx-auto">
              Share your transformation journey and experience with our coaching.
            </p>

          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="grid gap-6"
          >

            {/* NAME */}
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="
                w-full
                bg-black
                border
                border-white/10
                rounded-2xl
                px-5
                py-4
                text-white
                outline-none
                focus:border-brand-secondary
                transition-all
              "
            />

            {/* EMAIL */}
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="
                w-full
                bg-black
                border
                border-white/10
                rounded-2xl
                px-5
                py-4
                text-white
                outline-none
                focus:border-brand-secondary
                transition-all
              "
            />

            {/* MESSAGE */}
            <textarea
              rows="6"
              name="message"
              placeholder="Share your experience..."
              value={formData.message}
              onChange={handleChange}
              className="
                w-full
                bg-black
                border
                border-white/10
                rounded-2xl
                px-5
                py-4
                text-white
                outline-none
                focus:border-brand-secondary
                transition-all
                resize-none
              "
            />

            {status.message && (
              <p
                className={`rounded-2xl px-5 py-4 text-sm ${
                  status.type === "success"
                    ? "bg-green-500/10 text-green-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                {status.message}
              </p>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="
                bg-brand-primary
                hover:bg-brand-primary
                transition-all
                duration-300
                text-white
                font-semibold
                rounded-2xl
                py-4
                text-lg
                shadow-[0_0_30px_rgba(220,38,38,0.25)]
              ">
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </button>

          </form>
        </div>
      </div>
    </section> );
};

export default Testimonials;

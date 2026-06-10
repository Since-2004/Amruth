import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getClientBookings } from "../lib/api";
import { FaCalendarAlt, FaVideo, FaInfoCircle } from "react-icons/fa";

function formatSlot(date) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

function ClientDashboard() {
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("amrut_user") || "null");
    } catch {
      return null;
    }
  }, []);

  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === "CLIENT") {
      getClientBookings()
        .then((data) => {
          setBookings(data.bookings);
        })
        .catch((err) => {
          setStatus({ type: "error", message: err.message });
        })
        .finally(() => {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setLoading(false);
        });
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
    }
  }, [user]);

  if (!user || user.role !== "CLIENT") {
    return (
      <section className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-28 text-center">
        <h1 className="text-3xl font-black mb-6">Client Access Required</h1>
        <p className="text-gray-400 mb-8 max-w-md">
          Please log in as a client to view your personal dashboard, bookings, and diet plans.
        </p>
        <Link to="/login" className="px-8 py-4 rounded-2xl bg-[var(--brand-primary)] hover:bg-[var(--brand-secondary)] font-semibold transition-colors">
          Go to Login
        </Link>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#050505] text-white px-6 py-28">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="uppercase tracking-[4px] text-xs text-[var(--brand-secondary)] mb-3">Welcome Back</p>
          <h1 className="text-4xl md:text-5xl font-black">{user.name}'s Dashboard</h1>
        </div>

        {status.message && (
          <p className="mb-6 rounded-2xl px-5 py-4 text-sm bg-red-500/10 text-red-400">
            {status.message}
          </p>
        )}

        <div className="space-y-8">
          <div className="rounded-[28px] bg-[#0b0b0b] border border-white/10 p-6 md:p-8">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <FaCalendarAlt className="text-[var(--brand-secondary)]" /> My Booked Sessions
            </h2>
            
            {loading ? (
              <p className="text-gray-400">Loading your bookings...</p>
            ) : bookings.length === 0 ? (
              <p className="text-gray-400">You haven't booked any sessions yet. Head over to the <Link to="/booking" className="text-[var(--brand-secondary)] hover:underline">Booking page</Link> to get started!</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 hover:border-[var(--brand-secondary)]/50 transition-colors">
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <span className="text-xs uppercase tracking-[2px] px-3 py-1 rounded-full bg-[var(--brand-secondary)]/10 text-[var(--brand-secondary)]">
                        {booking.status}
                      </span>
                      <span className="text-xs text-gray-500">{booking.slot?.mode}</span>
                    </div>
                    
                    <h3 className="font-semibold text-xl mb-1">{booking.slot?.title}</h3>
                    <p className="text-sm text-gray-400 mb-4">{booking.slot ? formatSlot(booking.slot.startsAt) : "Unknown time"}</p>
                    
                    <div className="space-y-3 mt-4 pt-4 border-t border-white/5">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs uppercase tracking-[2px] text-gray-500">Diet Plan</span>
                        <p className="text-sm text-gray-300">
                          {booking.dietPlan || "No diet plan prescribed yet. Your coach will update this soon."}
                        </p>
                      </div>
                      
                      {booking.slot?.mode?.toLowerCase() === "online" && (
                        <div className="mt-4 pt-4 border-t border-white/5">
                          {booking.meetLink ? (
                            <a 
                              href={booking.meetLink} 
                              target="_blank" 
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-[var(--brand-secondary)] hover:underline"
                            >
                              <FaVideo /> Join Google Meet
                            </a>
                          ) : (
                            <p className="inline-flex items-center gap-2 text-sm text-gray-500">
                              <FaInfoCircle /> Meet link pending
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ClientDashboard;

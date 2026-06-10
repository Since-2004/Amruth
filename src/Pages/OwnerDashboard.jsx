import { useEffect, useState } from "react";
import {
  createSlot,
  getOwnerBookings,
  getOwnerNotifications,
  getOwnerSummary,
  getTheme,
  loginUser,
  markNotificationsRead,
  updateTheme,
  getOwnerSettings,
  updateOwnerSettings,
  updateBookingDiet,
} from "../lib/api";

function toIsoFromLocal(value) {
  return new Date(value).toISOString();
}

function OwnerDashboard() {
  const [auth, setAuth] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("amrut_user") || "null");
    } catch {
      return null;
    }
  });
  const [loginData, setLoginData] = useState({ email: "owner@amrut.local", password: "owner123" });
  const [summary, setSummary] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [theme, setTheme] = useState({ primary: "#dc2626", secondary: "#ef4444", surface: "#0b0b0b" });
  const [settings, setSettings] = useState({ upiId: "amruthfitness@upi", upiName: "Amruth Fitness", meetLink: "", elitePrice: "7,999" });
  const [slot, setSlot] = useState({ title: "", startsAt: "", endsAt: "", mode: "Online", capacity: 1 });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [dietPlans, setDietPlans] = useState({});

  const isOwner = auth?.role === "OWNER";

  const loadDashboard = async () => {
    const [summaryData, bookingData, notificationData, themeData, settingsData] = await Promise.all([
      getOwnerSummary(),
      getOwnerBookings(),
      getOwnerNotifications(),
      getTheme(),
      getOwnerSettings(),
    ]);

    setSummary(summaryData.summary);
    setBookings(bookingData.bookings);
    
    const initialDietPlans = {};
    bookingData.bookings.forEach((b) => {
      initialDietPlans[b.id] = b.dietPlan || "";
    });
    setDietPlans(initialDietPlans);

    setNotifications(notificationData.notifications);
    setTheme({
      primary: themeData.theme.primary,
      secondary: themeData.theme.secondary,
      surface: themeData.theme.surface,
    });
    setSettings({
      upiId: settingsData.settings.upiId || "",
      upiName: settingsData.settings.upiName || "",
      meetLink: settingsData.settings.meetLink || "",
      elitePrice: settingsData.settings.elitePrice || "7,999",
    });
  };

  useEffect(() => {
    if (isOwner) {
      // The dashboard loads remote owner data immediately after auth is restored.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadDashboard().catch((error) => setStatus({ type: "error", message: error.message }));
    }
  }, [isOwner]);

  const handleOwnerLogin = async (event) => {
    event.preventDefault();
    try {
      const data = await loginUser(loginData);
      localStorage.setItem("amrut_token", data.token);
      localStorage.setItem("amrut_user", JSON.stringify(data.user));
      setAuth(data.user);
      setStatus({ type: "success", message: "Owner login successful." });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  const handleThemeSave = async (event) => {
    event.preventDefault();
    try {
      const data = await updateTheme(theme);
      document.documentElement.style.setProperty("--brand-primary", data.theme.primary);
      document.documentElement.style.setProperty("--brand-secondary", data.theme.secondary);
      document.documentElement.style.setProperty("--brand-surface", data.theme.surface);
      setStatus({ type: "success", message: "Theme colors updated." });
      await loadDashboard();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  const handleSlotCreate = async (event) => {
    event.preventDefault();
    try {
      await createSlot({
        ...slot,
        startsAt: toIsoFromLocal(slot.startsAt),
        endsAt: toIsoFromLocal(slot.endsAt),
      });
      setSlot({ title: "", startsAt: "", endsAt: "", mode: "Online", capacity: 1 });
      setStatus({ type: "success", message: "Slot created." });
      await loadDashboard();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  const handleSettingsSave = async (event) => {
    event.preventDefault();
    try {
      await updateOwnerSettings(settings);
      setStatus({ type: "success", message: "Owner settings updated." });
      await loadDashboard();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  const handleDietSave = async (id) => {
    try {
      await updateBookingDiet(id, dietPlans[id]);
      setStatus({ type: "success", message: "Diet plan saved." });
      await loadDashboard();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  const handleRead = async () => {
    await markNotificationsRead();
    await loadDashboard();
  };

  if (!isOwner) {
    return (
      <section className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-28">
        <form onSubmit={handleOwnerLogin} className="w-full max-w-md rounded-[28px] bg-[#0b0b0b] border border-white/10 p-8">
          <p className="uppercase tracking-[4px] text-xs text-[var(--brand-secondary)] mb-4">Owner Login</p>
          <h1 className="text-3xl font-black mb-6">Manage Bookings & Theme</h1>
          <div className="grid gap-4">
            <input value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[var(--brand-secondary)]" placeholder="Owner Email" />
            <input type="password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[var(--brand-secondary)]" placeholder="Password" />
            {status.message && <p className="text-sm text-red-400">{status.message}</p>}
            <button className="rounded-2xl bg-[var(--brand-primary)] py-4 font-semibold">Login As Owner</button>
          </div>
        </form>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#050505] text-white px-6 py-28">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          <div>
            <p className="uppercase tracking-[4px] text-xs text-[var(--brand-secondary)] mb-3">Owner Dashboard</p>
            <h1 className="text-4xl md:text-5xl font-black">Control Center</h1>
          </div>
          <button onClick={handleRead} className="rounded-2xl border border-white/10 px-5 py-3 text-sm hover:border-[var(--brand-secondary)]">
            Mark Notifications Read
          </button>
        </div>

        {status.message && (
          <p className={`mb-6 rounded-2xl px-5 py-4 text-sm ${status.type === "success" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
            {status.message}
          </p>
        )}

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            ["Clients", summary?.users || 0],
            ["Bookings", summary?.bookings || 0],
            ["Enrollments", summary?.enrollments || 0],
            ["Unread", summary?.unreadNotifications || 0],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-[#0b0b0b] border border-white/10 p-5">
              <h3 className="text-3xl font-black">{value}</h3>
              <p className="text-xs uppercase tracking-[3px] text-gray-500 mt-2">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8">
          <div className="space-y-8">
            <form onSubmit={handleThemeSave} className="rounded-[24px] bg-[#0b0b0b] border border-white/10 p-6">
              <h2 className="text-2xl font-black mb-5">Theme Colors</h2>
              <div className="grid gap-4">
                {[
                  ["primary", "Primary"],
                  ["secondary", "Secondary"],
                  ["surface", "Surface"],
                ].map(([key, label]) => (
                  <label key={key} className="flex items-center justify-between gap-4 rounded-2xl bg-black border border-white/10 px-4 py-3">
                    <span className="text-sm text-gray-300">{label}</span>
                    <input type="color" value={theme[key]} onChange={(e) => setTheme({ ...theme, [key]: e.target.value })} className="w-12 h-10 bg-transparent" />
                  </label>
                ))}
                <button className="rounded-2xl bg-[var(--brand-primary)] py-4 font-semibold">Save Colors</button>
              </div>
            </form>

            <form onSubmit={handleSettingsSave} className="rounded-[24px] bg-[#0b0b0b] border border-white/10 p-6">
              <h2 className="text-2xl font-black mb-5">Owner Settings</h2>
              <div className="grid gap-4">
                <input value={settings.upiId} onChange={(e) => setSettings({ ...settings, upiId: e.target.value })} placeholder="UPI ID" className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[var(--brand-secondary)]" />
                <input value={settings.upiName} onChange={(e) => setSettings({ ...settings, upiName: e.target.value })} placeholder="UPI Name" className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[var(--brand-secondary)]" />
                <input value={settings.meetLink} onChange={(e) => setSettings({ ...settings, meetLink: e.target.value })} placeholder="Google Meet Link" className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[var(--brand-secondary)]" />
                <input value={settings.elitePrice} onChange={(e) => setSettings({ ...settings, elitePrice: e.target.value })} placeholder="Elite Plan Price (e.g. 7,999)" className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[var(--brand-secondary)]" />
                <button className="rounded-2xl bg-[var(--brand-primary)] py-4 font-semibold">Save Settings</button>
              </div>
            </form>

            <form onSubmit={handleSlotCreate} className="rounded-[24px] bg-[#0b0b0b] border border-white/10 p-6">
              <h2 className="text-2xl font-black mb-5">Create Slot</h2>
              <div className="grid gap-4">
                <input value={slot.title} onChange={(e) => setSlot({ ...slot, title: e.target.value })} placeholder="Session title" className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[var(--brand-secondary)]" />
                <input type="datetime-local" value={slot.startsAt} onChange={(e) => setSlot({ ...slot, startsAt: e.target.value })} className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[var(--brand-secondary)]" />
                <input type="datetime-local" value={slot.endsAt} onChange={(e) => setSlot({ ...slot, endsAt: e.target.value })} className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[var(--brand-secondary)]" />
                <div className="grid grid-cols-2 gap-4">
                  <select value={slot.mode} onChange={(e) => setSlot({ ...slot, mode: e.target.value })} className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none">
                    <option>Online</option>
                    <option>In-person</option>
                  </select>
                  <input type="number" min="1" value={slot.capacity} onChange={(e) => setSlot({ ...slot, capacity: e.target.value })} className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none" />
                </div>
                <button className="rounded-2xl bg-[var(--brand-primary)] py-4 font-semibold">Add Slot</button>
              </div>
            </form>
          </div>

          <div className="space-y-8">
            <div className="rounded-[24px] bg-[#0b0b0b] border border-white/10 p-6">
              <h2 className="text-2xl font-black mb-5">Recent Notifications</h2>
              <div className="space-y-3 max-h-[300px] overflow-auto pr-1">
                {notifications.map((item) => (
                  <div key={item.id} className="rounded-2xl bg-black border border-white/10 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-semibold">{item.title}</h3>
                      {!item.read && <span className="w-2 h-2 rounded-full bg-[var(--brand-secondary)]" />}
                    </div>
                    <p className="text-sm text-gray-400 mt-2">{item.message}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] bg-[#0b0b0b] border border-white/10 p-6">
              <h2 className="text-2xl font-black mb-5">Bookings</h2>
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <div key={booking.id} className="rounded-2xl bg-black border border-white/10 p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <h3 className="font-semibold">{booking.name}</h3>
                        <p className="text-sm text-gray-400">{booking.email} | {booking.phone}</p>
                      </div>
                      <span className="text-xs uppercase tracking-[2px] text-[var(--brand-secondary)]">{booking.status}</span>
                    </div>
                    <p className="text-sm text-gray-300 mt-3">{booking.slot?.title} - {booking.goal}</p>
                    {booking.notes && <p className="text-sm text-gray-500 mt-2">{booking.notes}</p>}
                    <div className="mt-4 flex gap-2">
                      <input 
                        value={dietPlans[booking.id] || ""} 
                        onChange={(e) => setDietPlans({ ...dietPlans, [booking.id]: e.target.value })} 
                        placeholder="Prescribe Diet Plan..." 
                        className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-[var(--brand-secondary)] text-sm" 
                      />
                      <button onClick={() => handleDietSave(booking.id)} className="rounded-xl bg-[var(--brand-primary)] px-4 py-2 text-sm font-semibold">Save Diet</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OwnerDashboard;

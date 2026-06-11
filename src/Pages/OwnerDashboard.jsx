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
  updateBookingStatus,
  getTransformations,
  createTransformation,
  updateTransformation,
  deleteTransformation,
  getPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
  getOwnerClients,
  getOwnerEnrollments,
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
  const [theme, setTheme] = useState({ primary: "var(--brand-primary)", secondary: "var(--brand-secondary)", surface: "#0b0b0b" });
  const [settings, setSettings] = useState({ upiId: "amruthfitness@upi", upiName: "Amruth Fitness", meetLink: "", elitePrice: "7,999" });
  const [slot, setSlot] = useState({ title: "", startsAt: "", endsAt: "", mode: "Online", capacity: 1 });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [dietPlans, setDietPlans] = useState({});
  const [transformations, setTransformations] = useState([]);
  const [transForm, setTransForm] = useState({ name: "", role: "", result: "", review: "" });
  const [beforeFile, setBeforeFile] = useState(null);
  const [afterFile, setAfterFile] = useState(null);
  const [editTransId, setEditTransId] = useState(null);

  const [programs, setPrograms] = useState([]);
  const [programForm, setProgramForm] = useState({ title: "", duration: "", schedule: "", price: "", goals: "", results: "" });
  const [editProgramId, setEditProgramId] = useState(null);

  const [clients, setClients] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  const isOwner = auth?.role === "OWNER";

  const loadDashboard = async () => {
    const [summaryData, bookingData, notificationData, themeData, settingsData, transData, programsData, clientsData, enrollmentsData] = await Promise.all([
      getOwnerSummary(),
      getOwnerBookings(),
      getOwnerNotifications(),
      getTheme(),
      getOwnerSettings(),
      getTransformations(),
      getPrograms(),
      getOwnerClients(),
      getOwnerEnrollments(),
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
    setTransformations(transData.transformations || []);
    setPrograms(programsData.programs || []);
    setClients(clientsData.clients || []);
    setEnrollments(enrollmentsData.enrollments || []);
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
      window.alert("Created slots");
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
      await updateBookingDiet(id, dietPlans[id] || "");
      setStatus({ type: "success", message: "Diet plan updated." });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  const handleBookingComplete = async (id) => {
    try {
      await updateBookingStatus(id, "COMPLETED");
      setStatus({ type: "success", message: "Booking marked as completed." });
      await loadDashboard();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  const exportToCSV = () => {
    const headers = ["ID", "Date", "Client Name", "Email", "Program", "Amount", "Currency", "Payment Method", "UTR Number", "Payment Status"];
    const rows = enrollments.map(e => [
      e.id,
      new Date(e.createdAt).toLocaleDateString(),
      `"${e.name}"`,
      `"${e.email}"`,
      `"${e.programTitle}"`,
      e.amount,
      e.currency,
      e.paymentMethod,
      `"${e.utrNumber || ""}"`,
      e.paymentStatus
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "payments_enrollments.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRead = async () => {
    await markNotificationsRead();
    await loadDashboard();
  };

  const handleTransSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", transForm.name);
    formData.append("role", transForm.role);
    formData.append("result", transForm.result);
    formData.append("review", transForm.review);
    if (beforeFile) formData.append("before", beforeFile);
    if (afterFile) formData.append("after", afterFile);

    try {
      if (editTransId) {
        await updateTransformation(editTransId, formData);
        setStatus({ type: "success", message: "Transformation updated." });
      } else {
        if (!beforeFile || !afterFile) {
          setStatus({ type: "error", message: "Both Before and After images are required." });
          return;
        }
        await createTransformation(formData);
        setStatus({ type: "success", message: "Transformation created." });
      }
      setTransForm({ name: "", role: "", result: "", review: "" });
      setBeforeFile(null);
      setAfterFile(null);
      setEditTransId(null);
      event.target.reset();
      await loadDashboard();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  const handleTransEdit = (item) => {
    setEditTransId(item.id);
    setTransForm({
      name: item.name,
      role: item.role,
      result: item.result,
      review: item.review,
    });
    setBeforeFile(null);
    setAfterFile(null);
  };

  const handleTransDelete = async (id) => {
    if (!window.confirm("Delete this transformation?")) return;
    try {
      await deleteTransformation(id);
      setStatus({ type: "success", message: "Transformation deleted." });
      await loadDashboard();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  const handleProgramSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        title: programForm.title,
        duration: programForm.duration,
        schedule: programForm.schedule,
        price: Number(programForm.price),
        goals: programForm.goals.split(",").map((g) => g.trim()).filter((g) => g),
        results: programForm.results,
      };

      if (editProgramId) {
        await updateProgram(editProgramId, payload);
        setStatus({ type: "success", message: "Program updated." });
      } else {
        await createProgram(payload);
        setStatus({ type: "success", message: "Program created." });
      }
      setProgramForm({ title: "", duration: "", schedule: "", price: "", goals: "", results: "" });
      setEditProgramId(null);
      await loadDashboard();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  const handleProgramEdit = (item) => {
    setEditProgramId(item.id);
    setProgramForm({
      title: item.title,
      duration: item.duration,
      schedule: item.schedule,
      price: item.price.toString(),
      goals: item.goals.join(", "),
      results: item.results,
    });
  };

  const handleProgramDelete = async (id) => {
    if (!window.confirm("Delete this program?")) return;
    try {
      await deleteProgram(id);
      setStatus({ type: "success", message: "Program deleted." });
      await loadDashboard();
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
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

        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8">
          <div className="space-y-8 min-w-0">
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

            <form onSubmit={handleTransSubmit} className="rounded-[24px] bg-[#0b0b0b] border border-white/10 p-6">
              <h2 className="text-2xl font-black mb-5">{editTransId ? "Edit Transformation" : "Add Transformation"}</h2>
              <div className="grid gap-4">
                <input value={transForm.name} onChange={(e) => setTransForm({ ...transForm, name: e.target.value })} placeholder="Client Name" className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[var(--brand-secondary)]" />
                <input value={transForm.role} onChange={(e) => setTransForm({ ...transForm, role: e.target.value })} placeholder="Role (e.g. MMA Athlete)" className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[var(--brand-secondary)]" />
                <input value={transForm.result} onChange={(e) => setTransForm({ ...transForm, result: e.target.value })} placeholder="Result (e.g. -12 KG)" className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[var(--brand-secondary)]" />
                
                <div>
                  <p className="text-sm text-gray-400 mb-2">Before Image {editTransId && "(Leave empty to keep existing)"}</p>
                  <input type="file" accept="image/*" onChange={(e) => setBeforeFile(e.target.files[0])} className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[var(--brand-secondary)]" />
                </div>
                
                <div>
                  <p className="text-sm text-gray-400 mb-2">After Image {editTransId && "(Leave empty to keep existing)"}</p>
                  <input type="file" accept="image/*" onChange={(e) => setAfterFile(e.target.files[0])} className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[var(--brand-secondary)]" />
                </div>
                
                <textarea value={transForm.review} onChange={(e) => setTransForm({ ...transForm, review: e.target.value })} placeholder="Review / Testimonial" rows={3} className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[var(--brand-secondary)] resize-none" />
                
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 rounded-2xl bg-[var(--brand-primary)] py-4 font-semibold">{editTransId ? "Update" : "Add Transformation"}</button>
                  {editTransId && (
                    <button type="button" onClick={() => { setEditTransId(null); setTransForm({ name: "", role: "", result: "", review: "" }); setBeforeFile(null); setAfterFile(null); }} className="rounded-2xl border border-white/10 px-6 py-4 font-semibold hover:border-[var(--brand-secondary)]">Cancel</button>
                  )}
                </div>
              </div>
            </form>
          </div>

          <div className="space-y-8 min-w-0">
            <div className="rounded-[24px] bg-[#0b0b0b] border border-white/10 p-6 min-w-0">
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
                      <div className="flex items-center gap-3">
                        <span className={`text-xs uppercase tracking-[2px] ${booking.status === "COMPLETED" ? "text-green-500" : "text-[var(--brand-secondary)]"}`}>
                          {booking.status}
                        </span>
                        {booking.status !== "COMPLETED" && (
                          <button onClick={() => handleBookingComplete(booking.id)} className="text-xs uppercase tracking-[1px] text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg px-2 py-1 transition">
                            Mark Complete
                          </button>
                        )}
                      </div>
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

            <div className="rounded-[24px] bg-[#0b0b0b] border border-white/10 p-6">
              <h2 className="text-2xl font-black mb-5">Clients</h2>
              <div className="space-y-4 max-h-[500px] overflow-auto pr-2">
                {clients.length === 0 && <p className="text-sm text-gray-400">No clients found.</p>}
                {clients.map((client) => (
                  <div key={client.id} className="rounded-2xl bg-black border border-white/10 p-5">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-white/5 pb-4 mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">{client.name}</h3>
                        <p className="text-sm text-gray-400">{client.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 uppercase tracking-[1px]">Joined</p>
                        <p className="text-sm text-gray-300">{new Date(client.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Enrollments Info */}
                      <div>
                        <h4 className="text-sm font-semibold text-[var(--brand-secondary)] uppercase tracking-[1px] mb-3">Programs Enrolled</h4>
                        {client.enrollments?.length > 0 ? (
                          <div className="space-y-2">
                            {client.enrollments.map(e => (
                              <div key={e.id} className="bg-white/[0.03] rounded-xl p-3 border border-white/5">
                                <p className="text-sm font-medium text-white">{e.programTitle}</p>
                                <p className="text-xs text-gray-400 mt-1">Goal: {e.goal}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500">No enrollments yet.</p>
                        )}
                      </div>

                      {/* Bookings Info */}
                      <div>
                        <h4 className="text-sm font-semibold text-[var(--brand-secondary)] uppercase tracking-[1px] mb-3">Session Bookings</h4>
                        {client.bookings?.length > 0 ? (
                          <div className="space-y-2">
                            {client.bookings.map(b => (
                              <div key={b.id} className="bg-white/[0.03] rounded-xl p-3 border border-white/5 flex justify-between items-center gap-2">
                                <div>
                                  <p className="text-sm font-medium text-white">{b.slot?.title}</p>
                                  <p className="text-xs text-gray-400 mt-1">{new Date(b.slot?.startsAt).toLocaleDateString()}</p>
                                </div>
                                <span className={`text-[10px] uppercase tracking-[1px] px-2 py-1 rounded-md ${b.status === "COMPLETED" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                                  {b.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500">No sessions booked.</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] bg-[#0b0b0b] border border-white/10 p-6 overflow-hidden flex flex-col min-w-0">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-2xl font-black">Payments Tracker</h2>
                <button onClick={exportToCSV} className="text-sm font-semibold rounded-xl bg-green-600 hover:bg-green-500 px-4 py-2 transition text-white">
                  Export CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-white/5 text-gray-400 uppercase tracking-[1px] text-xs">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-xl">Date</th>
                      <th className="px-4 py-3">Client</th>
                      <th className="px-4 py-3">Program</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Method</th>
                      <th className="px-4 py-3">UTR No</th>
                      <th className="px-4 py-3 rounded-tr-xl">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {(() => {
                      // Map enrollments to a common payment format
                      const mappedEnrollments = enrollments.map(e => ({
                        id: e.id,
                        createdAt: e.createdAt,
                        name: e.name,
                        email: e.email,
                        programTitle: e.programTitle,
                        currency: e.currency,
                        amount: e.amount,
                        paymentMethod: e.paymentMethod,
                        utrNumber: e.utrNumber,
                        paymentStatus: e.paymentStatus
                      }));
                      
                      // Map paid bookings to the same format
                      const mappedBookings = bookings
                        .filter(b => b.utrNumber)
                        .map(b => {
                          const p = programs.find(prog => prog.title === b.goal);
                          return {
                            id: b.id,
                            createdAt: b.createdAt,
                            name: b.name,
                            email: b.email,
                            programTitle: b.goal || "One-on-One Session",
                            currency: "INR",
                            amount: p ? parseFloat(p.price?.toString().replace(/,/g, '')) : 0,
                            paymentMethod: "UPI",
                            utrNumber: b.utrNumber,
                            paymentStatus: b.status === "confirmed" ? "completed" : "pending_verification"
                          };
                        });

                      const allPayments = [...mappedEnrollments, ...mappedBookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                      if (allPayments.length === 0) {
                        return (
                          <tr>
                            <td colSpan="7" className="px-4 py-4 text-center text-gray-500">No payments found.</td>
                          </tr>
                        );
                      }

                      return allPayments.map((e) => (
                      <tr key={e.id} className="hover:bg-white/[0.02] transition">
                        <td className="px-4 py-4 text-gray-300">{new Date(e.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-4">
                          <p className="font-semibold text-white">{e.name}</p>
                          <p className="text-xs text-gray-500">{e.email}</p>
                        </td>
                        <td className="px-4 py-4 text-[var(--brand-secondary)] font-medium">{e.programTitle}</td>
                        <td className="px-4 py-4 font-semibold">{e.currency} {e.amount}</td>
                        <td className="px-4 py-4">
                          <span className="bg-white/10 px-2 py-1 rounded text-xs text-gray-300">{e.paymentMethod}</span>
                        </td>
                        <td className="px-4 py-4 font-mono text-xs text-gray-400">
                          {e.utrNumber || "-"}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${e.paymentStatus === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                            {e.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-[24px] bg-[#0b0b0b] border border-white/10 p-6">
              <h2 className="text-2xl font-black mb-5">Manage Transformations</h2>
              <div className="space-y-3 max-h-[400px] overflow-auto pr-1">
                {transformations.length === 0 && <p className="text-sm text-gray-400">No transformations added yet.</p>}
                {transformations.map((item) => (
                  <div key={item.id} className="rounded-2xl bg-black border border-white/10 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-xs text-gray-400">{item.result}</p>
                      </div>
                      <button onClick={() => handleTransEdit(item)} className="text-blue-500 hover:text-blue-400 text-sm font-semibold border border-blue-500/20 hover:border-blue-500/50 rounded-xl px-3 py-1 bg-blue-500/10 transition">
                        Edit
                      </button>
                      <button onClick={() => handleTransDelete(item.id)} className="text-brand-secondary hover:text-red-400 text-sm font-semibold border border-brand-secondary/20 hover:border-brand-secondary/50 rounded-xl px-3 py-1 bg-brand-secondary/10 transition">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] bg-[#0b0b0b] border border-white/10 p-6">
              <h2 className="text-2xl font-black mb-5">Manage Programs</h2>
              <div className="space-y-3 max-h-[400px] overflow-auto pr-1">
                {programs.length === 0 && <p className="text-sm text-gray-400">No programs added yet.</p>}
                {programs.map((item) => (
                  <div key={item.id} className="rounded-2xl bg-black border border-white/10 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-xs text-gray-400">₹{item.price} - {item.duration}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleProgramEdit(item)} className="text-blue-500 hover:text-blue-400 text-sm font-semibold border border-blue-500/20 hover:border-blue-500/50 rounded-xl px-3 py-1 bg-blue-500/10 transition">
                          Edit
                        </button>
                        <button onClick={() => handleProgramDelete(item.id)} className="text-brand-secondary hover:text-red-400 text-sm font-semibold border border-brand-secondary/20 hover:border-brand-secondary/50 rounded-xl px-3 py-1 bg-brand-secondary/10 transition">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <form onSubmit={handleProgramSubmit} className="rounded-[24px] bg-[#0b0b0b] border border-white/10 p-6">
              <h2 className="text-2xl font-black mb-5">{editProgramId ? "Edit Program" : "Add Program"}</h2>
              <div className="grid gap-4">
                <input value={programForm.title} onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })} placeholder="Program Title" className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[var(--brand-secondary)]" />
                <div className="grid grid-cols-2 gap-4">
                  <input value={programForm.duration} onChange={(e) => setProgramForm({ ...programForm, duration: e.target.value })} placeholder="Duration (e.g. 8 Weeks)" className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[var(--brand-secondary)]" />
                  <input value={programForm.schedule} onChange={(e) => setProgramForm({ ...programForm, schedule: e.target.value })} placeholder="Schedule (e.g. 5 Days / Week)" className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[var(--brand-secondary)]" />
                </div>
                <input type="number" value={programForm.price} onChange={(e) => setProgramForm({ ...programForm, price: e.target.value })} placeholder="Price (₹)" className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[var(--brand-secondary)]" />
                <input value={programForm.goals} onChange={(e) => setProgramForm({ ...programForm, goals: e.target.value })} placeholder="Goals (comma-separated, e.g. Fat Loss, Strength)" className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[var(--brand-secondary)]" />
                <textarea value={programForm.results} onChange={(e) => setProgramForm({ ...programForm, results: e.target.value })} placeholder="Expected Results Description" rows={3} className="bg-black border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[var(--brand-secondary)] resize-none" />
                
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 rounded-2xl bg-[var(--brand-primary)] py-4 font-semibold">{editProgramId ? "Update Program" : "Add Program"}</button>
                  {editProgramId && (
                    <button type="button" onClick={() => { setEditProgramId(null); setProgramForm({ title: "", duration: "", schedule: "", price: "", goals: "", results: "" }); }} className="rounded-2xl border border-white/10 px-6 py-4 font-semibold hover:border-[var(--brand-secondary)]">Cancel</button>
                  )}
                </div>
              </div>
            </form>

          </div>
        </div>
      </div>
    </section>
  );
}

export default OwnerDashboard;

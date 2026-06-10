import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

const PORT = Number(process.env.PORT || process.env.API_PORT || 5000);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "*";
const TOKEN_SECRET = process.env.TOKEN_SECRET || "change-this-secret-for-production";

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.email("Valid email is required").transform((value) => value.toLowerCase()),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.email("Valid email is required").transform((value) => value.toLowerCase()),
  password: z.string().min(1, "Password is required"),
});

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.email("Valid email is required").transform((value) => value.toLowerCase()),
  goal: z.string().trim().min(1, "Goal is required"),
  message: z.string().trim().min(5, "Message is required"),
});

const feedbackSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.email("Valid email is required").transform((value) => value.toLowerCase()),
  message: z.string().trim().min(5, "Message is required"),
});

const enrollmentSchema = z.object({
  programId: z.string().trim().default("elite-transformation"),
  name: z.string().trim().min(2, "Name is required"),
  email: z.email("Valid email is required").transform((value) => value.toLowerCase()),
  phone: z.string().trim().min(7, "Phone is required"),
  goal: z.string().trim().min(1, "Goal is required"),
  paymentMethod: z.string().trim().min(1, "Payment method is required"),
});

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

function signToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
    },
    TOKEN_SECRET,
    { expiresIn: "7d" },
  );
}

function parseGoals(program) {
  return {
    ...program,
    goals: JSON.parse(program.goals),
  };
}

function asyncRoute(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

async function createNotification(type, title, message) {
  await prisma.notification.create({
    data: { type, title, message },
  });
}

async function getAuthUser(req) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return null;

  try {
    const payload = jwt.verify(header.slice(7), TOKEN_SECRET);
    return prisma.user.findUnique({ where: { id: payload.sub } });
  } catch {
    return null;
  }
}

function requireOwner(handler) {
  return asyncRoute(async (req, res, next) => {
    const user = await getAuthUser(req);
    if (!user || user.role !== "OWNER") {
      return res.status(403).json({ error: "Owner access is required" });
    }

    req.user = user;
    return handler(req, res, next);
  });
}

const slotSchema = z.object({
  title: z.string().trim().min(2, "Title is required"),
  startsAt: z.string().datetime("Valid start time is required"),
  endsAt: z.string().datetime("Valid end time is required"),
  mode: z.string().trim().min(1, "Mode is required"),
  capacity: z.coerce.number().int().min(1).max(20).default(1),
});

const bookingSchema = z.object({
  slotId: z.string().trim().min(1, "Slot is required"),
  name: z.string().trim().min(2, "Name is required"),
  email: z.email("Valid email is required").transform((value) => value.toLowerCase()),
  phone: z.string().trim().min(7, "Phone is required"),
  goal: z.string().trim().min(1, "Goal is required"),
  notes: z.string().trim().optional().or(z.literal("")),
});

const themeSchema = z.object({
  primary: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Primary color must be a hex color"),
  secondary: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Secondary color must be a hex color"),
  surface: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Surface color must be a hex color"),
});

const ownerSettingSchema = z.object({
  upiId: z.string().trim().min(1, "UPI ID is required"),
  upiName: z.string().trim().min(1, "Name is required"),
  meetLink: z.string().trim().optional(),
  elitePrice: z.string().trim().optional(),
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "amrut-api" });
});

app.get(
  "/api/programs",
  asyncRoute(async (req, res) => {
    const programs = await prisma.program.findMany({
      orderBy: { createdAt: "asc" },
    });

    res.json({ programs: programs.map(parseGoals) });
  }),
);

app.get(
  "/api/theme",
  asyncRoute(async (req, res) => {
    const theme =
      (await prisma.themeSetting.findUnique({ where: { id: "main" } })) ||
      (await prisma.themeSetting.create({ data: { id: "main" } }));

    res.json({ theme });
  }),
);

app.get(
  "/api/slots",
  asyncRoute(async (req, res) => {
    const slots = await prisma.sessionSlot.findMany({
      where: { status: "open", startsAt: { gte: new Date() } },
      include: { bookings: true },
      orderBy: { startsAt: "asc" },
    });

    const availableSlots = slots
      .map((slot) => ({
        ...slot,
        bookedCount: slot.bookings.length,
        availableSeats: Math.max(slot.capacity - slot.bookings.length, 0),
      }))
      .filter((slot) => slot.availableSeats > 0);

    res.json({ slots: availableSlots });
  }),
);

app.post(
  "/api/auth/register",
  asyncRoute(async (req, res) => {
    const input = registerSchema.parse(req.body);
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash: await bcrypt.hash(input.password, 12),
        role: "CLIENT",
      },
    });
    await createNotification("register", "New client registered", `${user.name} created a client account.`);

    res.status(201).json({ user: publicUser(user), token: signToken(user) });
  }),
);

app.post(
  "/api/auth/login",
  asyncRoute(async (req, res) => {
    const input = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    await createNotification("login", `${user.role === "OWNER" ? "Owner" : "Client"} login`, `${user.name} logged in.`);

    res.json({ user: publicUser(user), token: signToken(user) });
  }),
);

app.post(
  "/api/contact",
  asyncRoute(async (req, res) => {
    const input = contactSchema.parse(req.body);
    const contact = await prisma.contactMessage.create({ data: input });
    await createNotification("contact", "New contact message", `${contact.name} asked about ${contact.goal}.`);

    res.status(201).json({ contact });
  }),
);

app.post(
  "/api/feedback",
  asyncRoute(async (req, res) => {
    const input = feedbackSchema.parse(req.body);
    const feedback = await prisma.feedback.create({ data: input });
    await createNotification("feedback", "New feedback submitted", `${feedback.name} shared a testimonial.`);

    res.status(201).json({ feedback });
  }),
);

app.post(
  "/api/enrollments",
  asyncRoute(async (req, res) => {
    const input = enrollmentSchema.parse(req.body);
    const program =
      (await prisma.program.findUnique({ where: { id: input.programId } })) ||
      (await prisma.program.findUnique({ where: { id: "elite-transformation" } }));

    if (!program) {
      return res.status(400).json({ error: "Selected program is not available" });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        programId: program.id,
        programTitle: program.title,
        amount: program.price,
        name: input.name,
        email: input.email,
        phone: input.phone,
        goal: input.goal,
        paymentMethod: input.paymentMethod,
      },
    });
    await createNotification("enrollment", "New program enrollment", `${enrollment.name} enrolled for ${enrollment.programTitle}.`);

    res.status(201).json({ enrollment });
  }),
);

app.post(
  "/api/bookings",
  asyncRoute(async (req, res) => {
    const input = bookingSchema.parse(req.body);
    const user = await getAuthUser(req);
    const slot = await prisma.sessionSlot.findUnique({
      where: { id: input.slotId },
      include: { bookings: true },
    });

    if (!slot || slot.status !== "open") {
      return res.status(400).json({ error: "This slot is not available" });
    }

    if (slot.bookings.length >= slot.capacity) {
      return res.status(409).json({ error: "This slot is already full" });
    }

    let meetLink = null;
    if (slot.mode.toLowerCase() === "online") {
      const settings = await prisma.ownerSetting.findUnique({ where: { id: "main" } });
      meetLink = settings?.meetLink || null;
    }

    const booking = await prisma.booking.create({
      data: {
        slotId: slot.id,
        userId: user?.id,
        name: input.name,
        email: input.email,
        phone: input.phone,
        goal: input.goal,
        notes: input.notes || null,
        meetLink,
      },
    });

    await createNotification("booking", "New one-on-one booking", `${booking.name} booked ${slot.title}.`);

    res.status(201).json({ booking });
  }),
);

app.get(
  "/api/client/bookings",
  asyncRoute(async (req, res) => {
    const user = await getAuthUser(req);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const bookings = await prisma.booking.findMany({
      where: {
        OR: [{ userId: user.id }, { email: user.email }],
      },
      include: { slot: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({ bookings });
  }),
);

app.get(
  "/api/owner/summary",
  requireOwner(async (req, res) => {
    const [users, bookings, enrollments, unreadNotifications] = await Promise.all([
      prisma.user.count({ where: { role: "CLIENT" } }),
      prisma.booking.count(),
      prisma.enrollment.count(),
      prisma.notification.count({ where: { read: false } }),
    ]);

    res.json({ summary: { users, bookings, enrollments, unreadNotifications } });
  }),
);

app.get(
  "/api/owner/bookings",
  requireOwner(async (req, res) => {
    const bookings = await prisma.booking.findMany({
      include: { slot: true, user: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({ bookings });
  }),
);

app.put(
  "/api/owner/bookings/:id",
  requireOwner(async (req, res) => {
    const { id } = req.params;
    const { dietPlan } = req.body;
    
    const booking = await prisma.booking.update({
      where: { id },
      data: { dietPlan },
    });

    res.json({ booking });
  }),
);

app.get(
  "/api/owner/notifications",
  requireOwner(async (req, res) => {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    res.json({ notifications });
  }),
);

app.post(
  "/api/owner/notifications/read",
  requireOwner(async (req, res) => {
    await prisma.notification.updateMany({
      where: { read: false },
      data: { read: true },
    });

    res.json({ ok: true });
  }),
);

app.post(
  "/api/owner/slots",
  requireOwner(async (req, res) => {
    const input = slotSchema.parse(req.body);
    const slot = await prisma.sessionSlot.create({
      data: {
        title: input.title,
        startsAt: new Date(input.startsAt),
        endsAt: new Date(input.endsAt),
        mode: input.mode,
        capacity: input.capacity,
      },
    });

    res.status(201).json({ slot });
  }),
);

app.put(
  "/api/owner/theme",
  requireOwner(async (req, res) => {
    const input = themeSchema.parse(req.body);
    const theme = await prisma.themeSetting.upsert({
      where: { id: "main" },
      update: input,
      create: { id: "main", ...input },
    });

    await createNotification("theme", "Theme colors updated", "Owner updated the website theme colors.");
    res.json({ theme });
  }),
);

app.get(
  "/api/owner/settings",
  asyncRoute(async (req, res) => {
    const settings =
      (await prisma.ownerSetting.findUnique({ where: { id: "main" } })) ||
      (await prisma.ownerSetting.create({ data: { id: "main" } }));

    res.json({ settings });
  }),
);

app.put(
  "/api/owner/settings",
  requireOwner(async (req, res) => {
    const input = ownerSettingSchema.parse(req.body);
    const settings = await prisma.ownerSetting.upsert({
      where: { id: "main" },
      update: input,
      create: { id: "main", ...input },
    });

    await createNotification("settings", "Owner settings updated", "Owner updated UPI and Meet settings.");
    res.json({ settings });
  }),
);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((error, req, res, _next) => {
  void _next;
  if (error instanceof z.ZodError) {
    return res.status(400).json({ error: error.issues[0]?.message || "Invalid request" });
  }

  console.error(error);
  return res.status(500).json({ error: error.message || "Server error" });
});

app.listen(PORT, () => {
  console.log(`Amrut API running at http://localhost:${PORT}`);
});

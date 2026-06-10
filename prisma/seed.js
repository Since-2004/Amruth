import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./prisma/dev.db",
});
const prisma = new PrismaClient({
  adapter,
});

const programs = [
  {
    id: "fat-loss",
    title: "Fat Loss Program",
    duration: "8 Weeks",
    schedule: "5 Days / Week",
    price: 4999,
    goals: ["Fat Reduction", "Conditioning", "Core Strength"],
    results:
      "Lose body fat, improve stamina, and build discipline through structured workouts.",
  },
  {
    id: "muscle-building",
    title: "Muscle Building",
    duration: "12 Weeks",
    schedule: "6 Days / Week",
    price: 6999,
    goals: ["Muscle Gain", "Hypertrophy", "Strength"],
    results:
      "Build lean muscle mass while improving overall strength and physique aesthetics.",
  },
  {
    id: "strength-conditioning",
    title: "Strength & Conditioning",
    duration: "10 Weeks",
    schedule: "4 Days / Week",
    price: 5999,
    goals: ["Athleticism", "Endurance", "Power"],
    results:
      "Boost athletic performance, explosiveness, conditioning, and recovery.",
  },
  {
    id: "elite-transformation",
    title: "Elite Transformation",
    duration: "3 Months",
    schedule: "5 Days / Week",
    price: 7999,
    goals: ["Fat Loss", "Muscle Gain", "Custom Diet Plan", "1-on-1 Coaching"],
    results: "Personalized coaching for complete body recomposition.",
  },
];

const slots = [
  {
    id: "slot-morning-1",
    title: "One-on-One Strength Review",
    startsAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 25),
    mode: "Online",
    capacity: 1,
  },
  {
    id: "slot-evening-1",
    title: "Transformation Planning Call",
    startsAt: new Date(Date.now() + 1000 * 60 * 60 * 48),
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 49),
    mode: "In-person",
    capacity: 1,
  },
  {
    id: "slot-weekend-1",
    title: "Nutrition + Training Audit",
    startsAt: new Date(Date.now() + 1000 * 60 * 60 * 96),
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 97),
    mode: "Online",
    capacity: 1,
  },
];

async function main() {
  for (const program of programs) {
    await prisma.program.upsert({
      where: { id: program.id },
      update: {
        title: program.title,
        duration: program.duration,
        schedule: program.schedule,
        price: program.price,
        goals: JSON.stringify(program.goals),
        results: program.results,
      },
      create: {
        ...program,
        goals: JSON.stringify(program.goals),
      },
    });
  }

  await prisma.themeSetting.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      primary: "#dc2626",
      secondary: "#ef4444",
      surface: "#0b0b0b",
    },
  });

  for (const slot of slots) {
    await prisma.sessionSlot.upsert({
      where: { id: slot.id },
      update: {
        title: slot.title,
        startsAt: slot.startsAt,
        endsAt: slot.endsAt,
        mode: slot.mode,
        capacity: slot.capacity,
        status: "open",
      },
      create: {
        ...slot,
        status: "open",
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

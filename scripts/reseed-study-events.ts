// Reseeds only the college-wide StudyEvent rows (userId: null) with the
// corrected data from prisma/seed.ts — each MST is now 3 daily EXAM entries
// (matching the official 3-day exam window) instead of a single day.
// Idempotent: deletes all userId:null events first, matching seed.ts's own
// pattern, so this is safe to re-run.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.studyEvent.deleteMany({ where: { userId: null } });
  await prisma.studyEvent.createMany({
    data: [
      { title: "UDBHAV (Part 1) — Orientation Program begins", date: new Date("2026-08-04"), kind: "REMINDER" },
      { title: "Classes Begin", date: new Date("2026-08-10"), kind: "REMINDER" },
      { title: "UDAAN '26", date: new Date("2026-08-27"), kind: "REMINDER" },
      { title: "MST-1", date: new Date("2026-09-23"), kind: "EXAM" },
      { title: "MST-1", date: new Date("2026-09-24"), kind: "EXAM" },
      { title: "MST-1", date: new Date("2026-09-25"), kind: "EXAM" },
      { title: "AAROHAN '26", date: new Date("2026-10-09"), kind: "REMINDER" },
      { title: "MST-2", date: new Date("2026-10-27"), kind: "EXAM" },
      { title: "MST-2", date: new Date("2026-10-28"), kind: "EXAM" },
      { title: "MST-2", date: new Date("2026-10-29"), kind: "EXAM" },
      { title: "Diwali Break begins", date: new Date("2026-11-05"), kind: "REMINDER" },
      { title: "MST-3 (if needed)", date: new Date("2026-11-17"), kind: "EXAM" },
      { title: "MST-3 (if needed)", date: new Date("2026-11-18"), kind: "EXAM" },
      { title: "MST-3 (if needed)", date: new Date("2026-11-19"), kind: "EXAM" },
      { title: "Classes End", date: new Date("2026-11-19"), kind: "REMINDER" },
      { title: "Preparation Leave begins", date: new Date("2026-11-20"), kind: "REMINDER" },
      { title: "End-Semester Exams begin (Theory + Practical)", date: new Date("2026-11-30"), kind: "EXAM" },
      { title: "SAMARPAN '26", date: new Date("2026-12-20"), kind: "REMINDER" },
      { title: "Semester Break begins", date: new Date("2026-12-20"), kind: "REMINDER" },
      { title: "Holiday", date: new Date("2026-08-26"), kind: "REMINDER" },
      { title: "Holiday", date: new Date("2026-08-28"), kind: "REMINDER" },
      { title: "Holiday", date: new Date("2026-09-04"), kind: "REMINDER" },
      { title: "Holiday", date: new Date("2026-09-14"), kind: "REMINDER" },
      { title: "Holiday", date: new Date("2026-10-02"), kind: "REMINDER" },
      { title: "Holiday", date: new Date("2026-10-20"), kind: "REMINDER" },
      { title: "Holiday", date: new Date("2026-10-26"), kind: "REMINDER" },
      { title: "Holiday", date: new Date("2026-11-09"), kind: "REMINDER" },
      { title: "Holiday", date: new Date("2026-11-24"), kind: "REMINDER" },
    ],
  });
  const count = await prisma.studyEvent.count({ where: { userId: null } });
  console.log(`Reseeded. College-wide study events now: ${count}`);
  await prisma.$disconnect();
}

main();

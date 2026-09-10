import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Users, Leaf, Search, FolderTree, ArrowDownToLine, ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import TeamAvatar from '@/components/about/TeamAvatar';

export const metadata: Metadata = {
  title: 'About · SGSITS NotesVault',
  description:
    'SGSITS NotesVault solves the one problem every student runs into before an exam — finding the right study material in time. Notes, class slides and PYQs for every first-year subject, in one place, with no accounts.',
};

export const dynamic = 'force-dynamic';

const REASONS = [
  {
    Icon: BookOpen,
    title: 'The right material, in time',
    body:
      'The biggest problem before an exam is rarely effort — it is not finding correct, complete material when it matters. NotesVault exists to solve exactly that.',
  },
  {
    Icon: FolderTree,
    title: 'Organised the way you revise',
    body:
      'Every file is sorted by subject and by syllabus unit — Notes, Class Slides and PYQs (MST and End-Semester) — so you land on the exact chapter, not a folder.',
  },
  {
    Icon: Leaf,
    title: 'No barriers, no gatekeeping',
    body:
      'No logins, no profiles, no waiting for approval. Anyone can browse, and anyone can add a file back to the class in under a minute.',
  },
];

const STEPS = [
  {
    Icon: Search,
    title: 'Search or pick a subject',
    body: 'Start from the subject list or search a topic directly — "linked list", "MST 2", "fibre optics".',
  },
  {
    Icon: FolderTree,
    title: 'Open the right chapter',
    body: 'Each subject is split into Notes, Class Slides and PYQs, and grouped by the official syllabus units.',
  },
  {
    Icon: ArrowDownToLine,
    title: 'Read, download, or contribute',
    body: 'Open a file in the reader, download it for offline revision, or upload one the class is missing.',
  },
];

const TEAM = [
  {
    slug: 'viral-sharma',
    name: 'Viral Sharma',
    subtitle: 'B.Tech IT · SGSITS Indore',
    role: 'Concept & Frontend',
    body: 'Shaped the original idea and owns the interface — focused on making every page fast, clear, and something a student can use without a second thought.',
    socials: null as null | { linkedin?: string; instagram?: string },
  },
  {
    slug: 'animesh-agrawal',
    name: 'Animesh Agrawal',
    subtitle: 'B.Tech IT · SGSITS Indore',
    role: 'Backend & Data',
    body: 'Builds and maintains the backend — the database, the upload pipeline, and the syllabus-aware structure that keeps every file in the right place.',
    socials: {
      linkedin: 'https://www.linkedin.com/in/animeshagrawal13',
      instagram: 'https://www.instagram.com/_animesh_agrawal_',
    },
  },
];

function SocialLinks({ linkedin, instagram }: { linkedin?: string; instagram?: string }) {
  return (
    <div className="mt-3 flex items-center gap-2.5">
      {linkedin && (
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Animesh Agrawal on LinkedIn"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-100 text-sage-700 transition hover:bg-sage-200 hover:text-sage-800"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
            <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0z" />
          </svg>
        </a>
      )}
      {instagram && (
        <a
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Animesh Agrawal on Instagram"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-100 text-sage-700 transition hover:bg-sage-200 hover:text-sage-800"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden>
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
          </svg>
        </a>
      )}
    </div>
  );
}

export default async function AboutPage() {
  let stats = { subjects: 12, resources: 0, pyqs: 0, units: 0 };
  try {
    const [subjects, resources, pyqs, units] = await Promise.all([
      prisma.subject.count(),
      prisma.resource.count({ where: { status: 'APPROVED' } }),
      prisma.resource.count({ where: { status: 'APPROVED', type: 'PYQ' } }),
      prisma.unit.count(),
    ]);
    stats = { subjects, resources, pyqs, units };
  } catch {
    /* about page still renders fine without the live numbers */
  }

  const STAT_ITEMS = [
    { label: 'First-year subjects', value: stats.subjects },
    { label: 'Notes, slides & papers', value: stats.resources },
    { label: 'Previous year papers', value: stats.pyqs },
    { label: 'Syllabus units mapped', value: stats.units },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-20 pb-8 sm:space-y-24">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="grid items-center gap-8 md:grid-cols-[1.05fr_0.95fr] md:gap-10">
        <div>
          <p className="text-micro font-semibold uppercase tracking-[0.2em] text-text-faint">About the project</p>
          <h1 className="mt-4 text-[clamp(2.1rem,5.4vw,3.1rem)] font-heading font-bold leading-[1.08] tracking-[-0.025em] text-ink">
            The right material,
            <br />
            before the exam.
          </h1>
          <span aria-hidden className="mt-6 block h-[3px] w-24 rounded-full bg-sage-300" />
          <p className="mt-6 max-w-md text-body-lg leading-relaxed text-secondary">
            The single biggest problem students face before an exam is finding the correct, complete
            study material in time — it ends up scattered across a dozen chats and drives. SGSITS
            NotesVault exists to solve that one problem: the notes, class slides and previous year
            papers for every first-year subject, in one place, organised by subject and syllabus
            unit, open to everyone, with no account needed.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/subjects"
              className="inline-flex items-center gap-1.5 rounded-button bg-primary px-4 py-2.5 text-meta font-semibold text-white shadow-sm transition duration-calm ease-calm hover:bg-primary-strong"
            >
              Browse subjects
              <ArrowRight size={15} strokeWidth={2.4} />
            </Link>
            <Link
              href="/uploads"
              className="inline-flex items-center gap-1.5 rounded-button border border-border bg-surface px-4 py-2.5 text-meta font-semibold text-secondary shadow-sm transition duration-calm ease-calm hover:border-sage-300 hover:text-ink"
            >
              Contribute a file
            </Link>
          </div>
        </div>

        {/* Books + notes illustration */}
        <div aria-hidden className="order-first md:order-none">
          <svg viewBox="0 0 420 340" fill="none" className="h-auto w-full max-w-[420px] md:ml-auto">
            <ellipse cx="230" cy="150" rx="175" ry="140" fill="var(--sage-100)" opacity="0.55" />
            <g transform="rotate(4 250 96)">
              <rect x="176" y="24" width="148" height="150" rx="8" fill="var(--accent-cream)" />
              <rect x="196" y="52" width="82" height="6" rx="3" fill="var(--sage-500)" opacity="0.55" />
              <rect x="196" y="72" width="66" height="6" rx="3" fill="var(--sage-500)" opacity="0.45" />
              <rect x="196" y="92" width="94" height="6" rx="3" fill="var(--sage-500)" opacity="0.45" />
              <rect x="196" y="112" width="74" height="6" rx="3" fill="var(--sage-500)" opacity="0.35" />
            </g>
            <rect x="96" y="242" width="252" height="42" rx="9" fill="var(--accent-cream)" />
            <rect x="96" y="242" width="14" height="42" rx="5" fill="var(--sage-300)" opacity="0.7" />
            <rect x="112" y="198" width="236" height="42" rx="9" fill="var(--sage-200)" />
            <rect x="112" y="198" width="14" height="42" rx="5" fill="var(--sage-400)" opacity="0.7" />
            <rect x="126" y="154" width="222" height="42" rx="9" fill="var(--sage-500)" />
            <rect x="126" y="154" width="14" height="42" rx="5" fill="var(--sage-700)" opacity="0.7" />
            <rect x="330" y="212" width="66" height="62" rx="12" fill="var(--white)" />
            <path d="M396 228 h14 a14 14 0 0 1 0 28 h-14" stroke="var(--sage-300)" strokeWidth="7" fill="none" />
            <rect x="344" y="232" width="38" height="5" rx="2.5" fill="var(--sage-300)" />
            <rect x="344" y="246" width="28" height="5" rx="2.5" fill="var(--sage-300)" />
            <path d="M86 128 C112 148 112 186 86 208 C60 186 60 148 86 128 Z" fill="var(--sage-400)" opacity="0.6" />
            <path d="M366 96 C388 112 388 142 366 158 C344 142 344 112 366 96 Z" fill="var(--sage-300)" opacity="0.75" />
            <path d="M86 138 L86 214" stroke="var(--sage-600)" strokeWidth="2" opacity="0.4" strokeLinecap="round" />
          </svg>
        </div>
      </section>

      {/* ── Library at a glance ──────────────────────────────────────────── */}
      <section aria-label="The library in numbers">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border-soft sm:grid-cols-4">
          {STAT_ITEMS.map((s) => (
            <div key={s.label} className="bg-surface px-4 py-6 text-center">
              <p className="font-heading text-[clamp(1.6rem,4vw,2.2rem)] font-bold leading-none text-primary-strong">
                {s.value.toLocaleString('en-IN')}
              </p>
              <p className="mt-2 text-micro font-medium uppercase tracking-wide text-text-faint">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── The problem, stated plainly ──────────────────────────────────── */}
      <section aria-label="The problem this solves" className="border-l-2 border-sage-300 pl-5 sm:pl-7">
        <p className="max-w-2xl font-heading text-[clamp(1.25rem,3vw,1.7rem)] font-semibold leading-snug tracking-[-0.01em] text-ink">
          The biggest problem before an exam isn&rsquo;t effort — it&rsquo;s not being able to find
          the right material in time.
        </p>
        <p className="mt-3 max-w-2xl text-body leading-relaxed text-secondary">
          That is the only problem this website is built to solve. Everything below follows from it.
        </p>
      </section>

      {/* ── Why we built this ────────────────────────────────────────────── */}
      <section aria-labelledby="why-heading">
        <p className="text-micro font-semibold uppercase tracking-[0.2em] text-text-faint">How it answers that</p>
        <h2
          id="why-heading"
          className="mt-3 text-[clamp(1.5rem,3.4vw,2.05rem)] font-heading font-bold leading-tight tracking-[-0.02em] text-ink"
        >
          One problem, solved properly.
        </h2>
        <span aria-hidden className="mt-4 block h-[3px] w-16 rounded-full bg-sage-300" />

        <div className="mt-10 grid gap-9 sm:grid-cols-3 sm:gap-7">
          {REASONS.map(({ Icon, title, body }) => (
            <div key={title} className="sm:border-l sm:border-border-soft sm:pl-6 sm:first:border-l-0 sm:first:pl-0">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-100 text-sage-700">
                <Icon size={21} strokeWidth={1.7} />
              </span>
              <h3 className="mt-4 text-body-lg font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-body leading-relaxed text-secondary">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section aria-labelledby="how-heading">
        <p className="text-micro font-semibold uppercase tracking-[0.2em] text-text-faint">How it works</p>
        <h2
          id="how-heading"
          className="mt-3 text-[clamp(1.5rem,3.4vw,2.05rem)] font-heading font-bold leading-tight tracking-[-0.02em] text-ink"
        >
          Three steps, no sign-up.
        </h2>
        <span aria-hidden className="mt-4 block h-[3px] w-16 rounded-full bg-sage-300" />

        <ol className="mt-10 grid gap-8 sm:grid-cols-3 sm:gap-7">
          {STEPS.map(({ Icon, title, body }, i) => (
            <li key={title} className="relative">
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-meta font-bold text-primary-strong">
                  {i + 1}
                </span>
                <Icon size={18} strokeWidth={1.8} className="text-sage-600" />
              </span>
              <h3 className="mt-3 text-body-lg font-semibold text-ink">{title}</h3>
              <p className="mt-1.5 text-body leading-relaxed text-secondary">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Team ─────────────────────────────────────────────────────────── */}
      <section aria-labelledby="team-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-micro font-semibold uppercase tracking-[0.2em] text-text-faint">Built by students</p>
            <h2
              id="team-heading"
              className="mt-3 text-[clamp(1.5rem,3.4vw,2.05rem)] font-heading font-bold leading-tight tracking-[-0.02em] text-ink"
            >
              The people behind SGSITS NotesVault.
            </h2>
          </div>

          <div aria-hidden className="hidden items-end gap-2 pb-1 lg:flex">
            <svg viewBox="0 0 60 44" className="h-10 w-14 text-sage-400" fill="none">
              <path d="M54 4 C34 6 14 16 8 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M6 38 L10 26 M6 38 L18 34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <p className="font-hand text-[19px] leading-tight text-sage-700">
              Same classroom.
              <br />
              Same goal.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-10 sm:grid-cols-2 sm:gap-8">
          {TEAM.map((p, i) => (
            <div key={p.slug} className={i === 1 ? 'flex gap-5 sm:border-l sm:border-border-soft sm:pl-8' : 'flex gap-5'}>
              <TeamAvatar slug={p.slug} name={p.name} />
              <div className="min-w-0">
                <h3 className="text-body-lg font-semibold text-ink">{p.name}</h3>
                <p className="mt-0.5 text-meta text-secondary">{p.subtitle}</p>
                <span className="mt-2 inline-flex items-center rounded-full bg-sage-100 px-2.5 py-1 text-micro font-semibold text-sage-700">
                  {p.role}
                </span>
                <p className="mt-3 text-body leading-relaxed text-secondary">{p.body}</p>
                {p.socials && <SocialLinks linkedin={p.socials.linkedin} instagram={p.socials.instagram} />}
              </div>
            </div>
          ))}
        </div>

        <p aria-hidden className="mt-8 text-center font-hand text-[19px] leading-tight text-sage-700 lg:hidden">
          Same classroom. Same goal.
        </p>
      </section>

      {/* ── A note to the reader ─────────────────────────────────────────── */}
      <section aria-labelledby="note-heading" className="rounded-lg border border-sage-100 bg-primary-soft p-7 sm:p-9">
        <p className="text-micro font-semibold uppercase tracking-[0.2em] text-sage-700">A note to the reader</p>
        <h2
          id="note-heading"
          className="mt-3 text-[clamp(1.4rem,3vw,1.85rem)] font-heading font-bold leading-tight tracking-[-0.02em] text-primary-strong"
        >
          A resource is only as good as the class that keeps it alive.
        </h2>
        <p className="mt-5 max-w-2xl text-body-lg leading-relaxed text-sage-800">
          Our suggestion is a simple one: treat this platform as shared property, not a service. The
          few minutes it takes to upload a clean set of notes, a corrected question paper or a
          missing unit are minutes that save the entire batch hours during exam week. If a file is
          mislabelled, incomplete, or filed under the wrong chapter, replace it — accuracy here is a
          collective responsibility, and the library gets a little better every time someone gives
          back to it.
        </p>
      </section>

      {/* ── Closing ──────────────────────────────────────────────────────── */}
      <section className="pt-2 text-center">
        <p className="font-hand mx-auto max-w-lg text-[clamp(1.15rem,2.6vw,1.45rem)] leading-relaxed text-sage-700">
          Made for students, with the hope
          <br className="hidden sm:block" /> that learning feels a little less complicated.
        </p>
        <svg viewBox="0 0 24 24" aria-hidden className="mx-auto mt-4 h-5 w-5 text-sage-500" fill="none">
          <path
            d="M12 20 C6 15.5 3 12.6 3 9.2 A4.2 4.2 0 0 1 12 6.8 A4.2 4.2 0 0 1 21 9.2 C21 12.6 18 15.5 12 20 Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
        <svg viewBox="0 0 200 12" aria-hidden className="mx-auto mt-3 h-3 w-40 text-sage-300">
          <path d="M4 8 C60 0 140 0 196 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </section>
    </div>
  );
}

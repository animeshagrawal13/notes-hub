import type { Metadata } from 'next';
import { BookOpen, FolderTree, Leaf } from 'lucide-react';
import TeamAvatar from '@/components/about/TeamAvatar';

export const metadata: Metadata = {
  title: 'About · SGSITS NotesVault',
  description:
    'SGSITS NotesVault solves the one problem every student runs into before an exam — finding the right study material in time. Notes, class slides and PYQs for every first-year subject, in one place, with no accounts.',
};

const REASONS = [
  {
    Icon: BookOpen,
    title: 'Everything for a subject, together',
    body: 'Notes, class slides and previous year papers on one page — no hunting across chats, drives and seniors’ phones the night before.',
  },
  {
    Icon: FolderTree,
    title: 'Organised the way you revise',
    body: 'Every file is sorted by subject and by the official syllabus unit, so you land on the exact chapter you need.',
  },
  {
    Icon: Leaf,
    title: 'No barriers',
    body: 'No logins, no profiles, no waiting for approval. Anyone can browse, and anyone can add a file back to the class.',
  },
];

const TEAM = [
  {
    slug: 'viral-sharma',
    name: 'Viral Sharma',
    subtitle: 'B.Tech IT · SGSITS Indore',
    role: 'Co-founder · Product & Frontend',
    body: 'Had the original idea after one too many pre-exam scrambles for notes, and owns the product side — the layout, the flow, and the design system.',
    socials: null as null | { linkedin?: string; instagram?: string },
  },
  {
    slug: 'animesh-agrawal',
    name: 'Animesh Agrawal',
    subtitle: 'B.Tech IT · SGSITS Indore',
    role: 'Co-founder · Backend & Data',
    body: 'Built and runs everything behind the page — the database, the upload pipeline, search, and the syllabus-aware structure that files every note under the right subject and unit.',
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

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-16 pb-8 sm:space-y-20">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section>
        <p className="text-micro font-semibold uppercase tracking-[0.2em] text-text-faint">About</p>
        <h1 className="mt-4 text-[clamp(2rem,5vw,2.9rem)] font-heading font-bold leading-[1.1] tracking-[-0.025em] text-ink">
          The right material, before the exam.
        </h1>
        <span aria-hidden className="mt-6 block h-[3px] w-24 rounded-full bg-sage-300" />
        <p className="mt-6 max-w-2xl text-body-lg leading-relaxed text-secondary">
          The single biggest problem students face before an exam is finding the correct, complete
          study material in time — it ends up scattered across a dozen chats and drives. SGSITS
          NotesVault exists to solve that one problem: the notes, class slides and previous year
          papers for every first-year subject, in one place, organised by subject and syllabus unit,
          open to everyone, with no account needed.
        </p>
      </section>

      {/* ── What it gives you ────────────────────────────────────────────── */}
      <section aria-labelledby="reasons-heading">
        <h2 id="reasons-heading" className="sr-only">
          What SGSITS NotesVault gives you
        </h2>
        <div className="grid gap-8 sm:grid-cols-3 sm:gap-6">
          {REASONS.map(({ Icon, title, body }) => (
            <div key={title}>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sage-100 text-sage-700">
                <Icon size={20} strokeWidth={1.7} />
              </span>
              <h3 className="mt-4 text-body-lg font-semibold text-ink">{title}</h3>
              <p className="mt-1.5 text-body leading-relaxed text-secondary">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Founders ─────────────────────────────────────────────────────── */}
      <section aria-labelledby="team-heading">
        <p className="text-micro font-semibold uppercase tracking-[0.2em] text-text-faint">The founders</p>
        <h2
          id="team-heading"
          className="mt-3 text-[clamp(1.4rem,3.2vw,1.9rem)] font-heading font-bold leading-tight tracking-[-0.02em] text-ink"
        >
          Two classmates, tired of the exam-week scramble.
        </h2>
        <p className="mt-4 max-w-2xl text-body leading-relaxed text-secondary">
          SGSITS NotesVault is built and run by two first-year IT students at SGSITS Indore. It
          started as a shared folder for their own batch and grew into a proper, syllabus-organised
          library once it was clear how much time it was saving everyone.
        </p>

        <div className="mt-9 grid gap-9 sm:grid-cols-2 sm:gap-7">
          {TEAM.map((p) => (
            <div key={p.slug} className="flex gap-5">
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
      </section>

      {/* ── A note to the reader ─────────────────────────────────────────── */}
      <section aria-labelledby="note-heading" className="border-t border-border-soft pt-12">
        <h2
          id="note-heading"
          className="text-[clamp(1.3rem,3vw,1.7rem)] font-heading font-bold leading-tight tracking-[-0.02em] text-ink"
        >
          A resource is only as good as the class that keeps it alive.
        </h2>
        <p className="mt-4 max-w-2xl text-body-lg leading-relaxed text-secondary">
          Our one request: treat this as shared property, not a service. The few minutes it takes to
          upload a clean set of notes or a corrected paper save the whole batch hours during exam
          week. If a file is wrong, incomplete or in the wrong chapter, replace it — the library gets
          a little better every time someone gives back to it.
        </p>
      </section>
    </div>
  );
}

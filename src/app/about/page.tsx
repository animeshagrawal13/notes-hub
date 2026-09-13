import type { Metadata } from 'next';
import { BookOpen, FolderTree, Leaf } from 'lucide-react';
import OrganicBlob from '@/components/about/OrganicBlob';
import StudyDoodle from '@/components/about/StudyDoodle';
import Reveal from '@/components/about/Reveal';
import MadeBy, { type Person } from '@/components/about/MadeBy';

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

const TEAM: Person[] = [
  {
    slug: 'viral-sharma',
    name: 'Viral Sharma',
    linkedin: 'https://www.linkedin.com/in/viral-sharma-2977b2349?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    instagram: 'https://www.instagram.com/viral_.sharma?stkn=MXhmbGc2dHNvZXhhaw==',
  },
  {
    slug: 'animesh-agrawal',
    name: 'Animesh Agrawal',
    linkedin: 'https://www.linkedin.com/in/animeshagrawal13',
    instagram: 'https://www.instagram.com/_animesh_agrawal_',
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-24 pb-10 sm:space-y-32">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative">
        <OrganicBlob tone="sage" className="-left-16 -top-24 h-72 w-72" />
        <OrganicBlob tone="cream" className="right-0 top-10 h-56 w-56 sm:right-8" />

        <div className="relative z-10 grid items-center gap-10 sm:grid-cols-[1.15fr_0.85fr] sm:gap-8">
          <Reveal>
            <p className="text-micro font-semibold uppercase tracking-[0.2em] text-text-faint">About</p>
            <h1 className="mt-4 text-[clamp(2.4rem,5.4vw,3.6rem)] font-heading font-bold leading-[1.08] tracking-[-0.03em] text-ink">
              The right material,
              <br />
              <span className="text-sage-600 dark:text-sage-400">before the exam.</span>
            </h1>
            <span aria-hidden className="mt-7 block h-[3px] w-20 rounded-full bg-sage-300" />
            <p className="mt-6 max-w-xl text-body-lg leading-relaxed text-secondary">
              The single biggest problem students face before an exam is finding the correct, complete
              study material in time — it ends up scattered across a dozen chats and drives. SGSITS
              NotesVault exists to solve that one problem: the notes, class slides and previous year
              papers for every first-year subject, in one place, organised by subject and syllabus unit,
              open to everyone, with no account needed.
            </p>
          </Reveal>

          <Reveal delayMs={150} className="hidden sm:block">
            <div className="relative mx-auto w-full max-w-[240px]">
              <OrganicBlob tone="mint" className="-inset-6" />
              <StudyDoodle variant="hero" className="relative z-10 w-full" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── What it gives you ────────────────────────────────────────────── */}
      <Reveal>
        <section aria-labelledby="reasons-heading" className="relative">
          <h2 id="reasons-heading" className="sr-only">
            What SGSITS NotesVault gives you
          </h2>
          <div className="relative z-10 grid gap-10 sm:grid-cols-3 sm:gap-x-10 sm:gap-y-0 sm:divide-x sm:divide-border-soft">
            {REASONS.map(({ Icon, title, body }, i) => (
              <div key={title} className={i > 0 ? 'sm:pl-10' : ''}>
                <span className="relative flex h-12 w-12 items-center justify-center">
                  <OrganicBlob tone={i === 1 ? 'cream' : 'sage'} className="-inset-2 opacity-90" />
                  <Icon size={21} strokeWidth={1.6} className="relative z-10 text-sage-700 dark:text-sage-300" />
                </span>
                <h3 className="mt-5 text-body-lg font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-body leading-relaxed text-secondary">{body}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ── Founders ─────────────────────────────────────────────────────── */}
      <Reveal>
        <section aria-labelledby="team-heading" className="border-t border-border-soft pt-16">
          <MadeBy people={TEAM} />
        </section>
      </Reveal>

      {/* ── A note to the reader ─────────────────────────────────────────── */}
      <Reveal>
        <section aria-labelledby="note-heading" className="relative border-t border-border-soft pt-16">
          <OrganicBlob tone="sage" className="-right-20 bottom-0 h-64 w-64" />
          <div className="relative z-10 grid items-end gap-8 sm:grid-cols-[1.3fr_0.7fr]">
            <div>
              <h2
                id="note-heading"
                className="text-[clamp(1.5rem,3.4vw,2.1rem)] font-heading font-bold leading-tight tracking-[-0.02em] text-ink"
              >
                A resource is only as good
                <br className="hidden sm:block" /> as the class that keeps it alive.
              </h2>
              <p className="mt-5 max-w-xl text-body-lg leading-relaxed text-secondary">
                Our one request: treat this as shared property, not a service. The few minutes it takes to
                upload a clean set of notes or a corrected paper save the whole batch hours during exam
                week. If a file is wrong, incomplete or in the wrong chapter, replace it — the library gets
                a little better every time someone gives back to it.
              </p>
            </div>
            <div className="relative hidden justify-self-end sm:block">
              <StudyDoodle variant="closing" className="w-44" />
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}

import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  CircuitBoard,
  Cpu,
  GraduationCap,
  MonitorPlay,
  Rocket,
  School,
  Sparkles,
  Star,
  Trophy
} from "lucide-react";
import { QuickContactForm } from "@/components/QuickContactForm";
import { getPrograms, getPublicPortfolios } from "@/lib/store";

const hardware = [
  [Bot, "mBot", "Robot programmable pour capteurs, moteurs et challenges."],
  [CircuitBoard, "Arduino", "Électronique, IoT et prototypes physiques."],
  [Cpu, "Micro:bit", "Premiers circuits et logique embarquée."],
  [BrainCircuit, "Dadabit AI", "Vision, sons et projets IA éducatifs."],
  [Rocket, "Raspberry Pi", "Linux, serveurs, vision et projets avancés."],
  [Sparkles, "VinciBot", "Robot créatif avec vision et apprentissage."],
  [Trophy, "Mission Mars", "Compétition annuelle et portfolio final."]
] as const;

const learningSteps = [
  ["Play", "Jeux guidés, robots et mini-missions pour déclencher la curiosité."],
  ["Learn", "Concepts clairs: logique, algorithmique, hardware, IA et web."],
  ["Create", "Chaque élève finit par créer, présenter et documenter son projet."]
];

const trustBadges = ["No prep required", "Portfolio visible", "Parent privacy", "Teacher guided"];

export default async function HomePage() {
  const [programs, portfolios] = await Promise.all([getPrograms(), getPublicPortfolios()]);

  return (
    <div className="overflow-hidden bg-white">
      <section className="bg-white pt-28">
        <div className="container-shell grid items-center gap-10 pb-14 lg:grid-cols-[.95fr_1.05fr]">
          <div>
            <h1 className="font-display text-[3rem] font-black leading-[.95] tracking-[-0.04em] text-ink sm:text-6xl lg:text-[4.8rem]">
              The playful STEM school for future makers.
            </h1>
            <p className="mt-6 max-w-xl text-lg font-semibold leading-8 text-ink-soft">
              Coding, robotique et IA pour les 7–17 ans: des missions fun pour enfants, des vrais projets pour ados, et un suivi clair pour parents.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/inscription" className="btn-primary">
                Start learning today <ArrowRight data-icon="inline-end" />
              </Link>
              <Link href="/login" className="btn-outline">
                Log in
              </Link>
            </div>
            <Link href="/inscription" className="mt-5 inline-flex items-center gap-2 font-black text-pink">
              Try a free discovery session <ArrowRight className="size-4" />
            </Link>
          </div>
          <HeroPlayCard />
        </div>
      </section>

      <section className="bg-sky py-7 text-white">
        <div className="container-shell text-center">
          <h2 className="font-display text-3xl font-black">Trusted by young creators in Marrakech</h2>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {trustBadges.map((badge) => (
              <span key={badge} className="rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-wide text-sky-dark">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="formations" className="section-padding bg-white">
        <SectionHeader
          title="Type. Think. Code. Create."
          subtitle="Un parcours pour chaque âge: coding, STEM, robotique, créativité, IA et web."
        />
        <div className="container-shell grid gap-6 lg:grid-cols-[.78fr_1.22fr]">
          <div className="rounded-brand border-2 border-[#E8EEF6] bg-white p-6">
            <h3 className="font-display text-2xl font-black text-amber">Elite Code Basics</h3>
            <p className="mt-3 text-sm font-bold leading-6 text-ink-soft">
              Les premiers pas: logique, clavier, blocs, robots et petites victoires visibles dès la première séance.
            </p>
            <ul className="mt-5 grid gap-3 text-sm font-bold text-ink">
              {["Think logically and sequence steps", "Grow confident with coding tools", "Work independently from the start"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Star className="size-4 fill-amber text-amber" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 grid gap-3">
              {programs.slice(0, 4).map((program, index) => (
                <Link key={program.id} href="/inscription" className="flex items-center justify-between rounded-2xl border-2 border-[#EEF3FA] bg-surface p-4 font-black transition hover:border-sky">
                  <span>{program.title}</span>
                  <span className={`rounded-full px-3 py-1 text-xs ${programPill(index)}`}>{program.ageRange}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-brand border-2 border-sky bg-[#BFEFFF] p-5">
            <div className="rounded-[22px] border-2 border-white bg-sky p-4">
              <div className="rounded-[18px] bg-[#9BE7FF] p-5">
                <div className="grid min-h-[360px] place-items-center rounded-[18px] border-2 border-white bg-[#DFFAFF] p-6">
                  <GameBoard />
                </div>
                <div className="mt-4 flex items-center justify-between rounded-2xl bg-amber px-4 py-3 font-black text-ink">
                  <span>Mission: guide the robot</span>
                  <span className="rounded-full bg-white px-4 py-2 text-xs">Hint</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <Link href="/inscription" className="btn-primary">Explore our platform</Link>
        </div>
      </section>

      <section id="how-it-works" className="bg-[#F4F8FC] py-20">
        <SectionHeader
          title="How it works in your school"
          subtitle="Simple pour parents, clair pour teachers, motivant pour élèves."
        />
        <div className="container-shell grid gap-5 md:grid-cols-3">
            {([
    [School, "Sign up & validate", "Le parent fait une demande; l'admin valide avant de créer l'accès."],
    [MonitorPlay, "Students play", "L'élève apprend avec missions, robots, projets et badges."],
    [GraduationCap, "Track progress", "Parent et teacher voient portfolio, certifs et progression."]
  ] as const).map(([Icon, title, text]) => (
    <article key={title} className="rounded-brand border-2 border-[#E8EEF6] bg-white p-8 text-center">
      <Icon className="mx-auto size-12 text-sky" />
      <h3 className="mt-5 font-display text-2xl font-black">{title}</h3>
      <p className="mt-3 text-sm font-semibold leading-6 text-ink-soft">{text}</p>
    </article>
  ))}
        </div>
      </section>

      <section className="relative bg-sky py-20 text-center text-white">
        <div className="container-shell">
          <span className="tag bg-pink">Ready to get started?</span>
          <h2 className="mx-auto mt-4 max-w-3xl font-display text-5xl font-black tracking-[-0.04em]">
            Get started with your class today
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-bold leading-7 text-white/90">
            Crée une demande en quelques étapes. L'équipe confirme le niveau et le meilleur parcours.
          </p>
          <Link href="/inscription" className="mt-8 inline-flex rounded-full bg-white px-8 py-3 text-sm font-black uppercase tracking-wide text-sky-dark">
            Create your free account <ArrowRight data-icon="inline-end" />
          </Link>
        </div>
      </section>

      <section id="materiel" className="section-padding bg-white">
        <SectionHeader
          title="Building skills that last"
          subtitle="Des compétences durables grâce aux jeux, aux robots, aux projets et à la créativité."
        />
        <div className="container-shell grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <div className="grid gap-4">
            {learningSteps.map(([title, text], index) => (
              <article key={title} className={`rounded-brand border-2 bg-white p-6 ${["border-amber", "border-sky", "border-pink"][index]}`}>
                <h3 className={`font-display text-3xl font-black ${["text-amber", "text-sky", "text-pink"][index]}`}>{title}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-ink-soft">{text}</p>
              </article>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {hardware.map(([Icon, name, description], index) => (
              <article key={name} className="rounded-[1.4rem] border-2 border-[#E8EEF6] bg-surface p-6 transition hover:border-sky">
                <div className={`mb-5 flex size-12 items-center justify-center rounded-2xl ${programIconBg(index)}`}>
                  <Icon className="text-ink" />
                </div>
                <h3 className="font-display text-lg font-black">{name}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-ink-soft">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="competition" className="bg-[#FFF2D7] py-20">
        <div className="container-shell grid items-center gap-8 rounded-[34px] border-2 border-[#FFD489] bg-cream p-8 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <span className="tag">Mission annuelle</span>
            <h2 className="mt-4 font-display text-5xl font-black tracking-[-0.04em] text-ink">Mission Planète Mars</h2>
            <p className="mt-4 font-semibold leading-8 text-ink-soft">
              Une compétition façon mission control: stratégie, robotique, présentation et certificat final.
            </p>
            <Link href="/inscription" className="btn-primary mt-7">Join the mission</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {learningSteps.map(([title, text], index) => (
              <div key={title} className="rounded-3xl border-2 border-white bg-white p-5">
                <span className="flex size-12 items-center justify-center rounded-full bg-sky font-display text-xl font-black text-white">0{index + 1}</span>
                <h3 className="mt-4 font-display text-xl font-black">{title}</h3>
                <p className="mt-2 text-sm font-semibold text-ink-soft">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="portfolios" className="section-padding bg-[#C9F1FF]">
        <SectionHeader
          title="Loved by kids. Clear for parents."
          subtitle="Chaque élève a un portfolio: projets, certificats, galerie, progression et confidentialité parent."
        />
        <div className="container-shell grid gap-5 md:grid-cols-3">
          {portfolios.map((student, index) => (
            <Link
              key={student.id}
              href={`/portfolio/${student.slug}`}
              className="rounded-brand border-2 border-white bg-white p-6 transition hover:border-sky"
            >
              <div className="flex items-center gap-4">
                <div className={`flex size-16 items-center justify-center rounded-3xl font-display text-2xl font-black text-white ${studentAvatarBg(index)}`}>
                  {student.avatar}
                </div>
                <div>
                  <h3 className="font-display text-xl font-black">{student.firstName} {student.lastName}</h3>
                  <p className="text-sm font-bold text-ink-soft">{student.levelLabel}</p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-2 text-center text-sm">
                <MiniStat value={student.projects.length} label="Projets" />
                <MiniStat value={student.certifications.length} label="Certifs" />
                <MiniStat value={`${student.hours}h`} label="Code" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="contact-support" className="section-padding bg-white">
        <div className="container-shell grid gap-12 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <span className="tag">Support</span>
            <h2 className="mt-4 font-display text-5xl font-black tracking-[-0.04em]">Bring Elite Code to your child.</h2>
            <p className="mt-4 font-semibold leading-8 text-ink-soft">
              Question rapide avant l'inscription? Contactez l'équipe sans remplir la demande complète.
            </p>
            <Link href="/inscription" className="btn-primary mt-8 inline-flex">
              Aller à l'inscription <ArrowRight data-icon="inline-end" />
            </Link>
          </div>
          <QuickContactForm />
        </div>
      </section>
    </div>
  );
}

function HeroPlayCard() {
  return (
    <div className="rounded-[34px] border-2 border-[#FFE2A8] bg-[#FFE3A8] p-5">
      <div className="relative min-h-[340px] overflow-hidden rounded-[26px] border-2 border-white bg-[#FFD26D] p-6">
        <div className="absolute inset-x-0 top-0 h-24 bg-[#FFEBAF]" />
        <div className="relative grid min-h-[290px] place-items-center">
          <div className="grid w-full max-w-xl gap-5 sm:grid-cols-[.8fr_1.2fr_.8fr]">
            <Mascot name="Logic" color="bg-sky" face=":)" />
            <div className="grid place-items-center rounded-[28px] bg-white p-8 text-center">
              <div className="flex size-24 items-center justify-center rounded-[28px] bg-[#F20D0D] text-white">
                <MonitorPlay className="size-12 fill-white" />
              </div>
              <p className="mt-5 font-display text-2xl font-black">Watch a STEM mission</p>
            </div>
            <Mascot name="Robot" color="bg-lime" face=":D" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Mascot({ name, color, face }: { name: string; color: string; face: string }) {
  return (
    <div className="flex flex-col items-center justify-end gap-3">
      <div className={`grid size-28 place-items-center rounded-full border-4 border-white ${color} font-display text-3xl font-black text-white`}>
        {face}
      </div>
      <span className="rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-wide text-ink">{name}</span>
    </div>
  );
}

function GameBoard() {
  return (
    <div className="grid w-full max-w-xl gap-4">
      <div className="grid grid-cols-5 gap-3">
        {Array.from({ length: 15 }, (_, index) => (
          <div key={index} className={`aspect-square rounded-2xl border-2 border-white ${index % 4 === 0 ? "bg-amber" : index % 3 === 0 ? "bg-lime" : "bg-sky"}`} />
        ))}
      </div>
      <div className="flex justify-center gap-2">
        {["←", "↑", "→", "GO"].map((item) => (
          <span key={item} className="rounded-full bg-white px-4 py-2 font-display font-black text-sky-dark">{item}</span>
        ))}
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="container-shell mb-14 text-center">
      <h2 className="mx-auto max-w-3xl font-display text-4xl font-black tracking-[-0.05em] text-ink md:text-6xl">{title}</h2>
      <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-8 text-ink-soft">{subtitle}</p>
    </div>
  );
}

function MiniStat({ value, label }: { value: string | number; label: string }) {
  return (
    <span className="rounded-2xl border-2 border-[#E8EEF6] bg-surface p-3">
      <strong className="font-display text-lg font-black">{value}</strong>
      <br />
      <small className="font-bold text-ink-soft">{label}</small>
    </span>
  );
}

function programPill(index: number) {
  return ["bg-[#E8F7FF] text-sky-dark", "bg-[#EFF9D8] text-ink", "bg-[#FFF3D6] text-ink", "bg-[#F1EAFE] text-violet"][index % 4];
}

function programIconBg(index: number) {
  return ["bg-[#E8F7FF]", "bg-[#EFF9D8]", "bg-[#FFF3D6]", "bg-[#F1EAFE]", "bg-[#FFE8ED]", "bg-[#EAF0FF]"][index % 6];
}

function studentAvatarBg(index: number) {
  return ["bg-sky", "bg-pink", "bg-amber"][index % 3];
}



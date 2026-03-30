import Link from "next/link";
import { apps } from "./data/apps";
import {
  Wrench,
  Timer,
  Calculator,
  Droplet,
  Sparkles,
  Globe,
} from "lucide-react";

const icons: Record<string, any> = {
  "portail-pma": Wrench,
  garagetimer: Timer,
  "calculateur-assmat": Calculator,
  "calculateur-e-liquide": Droplet,
  "solution-sur-mesure": Sparkles,
  "site-internet-vitrine": Globe,
};

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#F2F4F7] text-[#0F172A] overflow-hidden">

      {/* LOGO HERO */}
      <div className="absolute inset-x-0 top-[20px] flex justify-center pointer-events-none">
        <img
          src="/logo-lysma.png"
          alt=""
          className="w-[360px] opacity-[0.18] select-none"
        />
      </div>

      {/* HERO */}
      <section className="relative z-10 max-w-4xl mx-auto text-center px-6 pt-28 pb-24">
        <h1 className="text-4xl md:text-6xl font-semibold mb-6 tracking-tight text-[#0A4D9B]">
          Vos outils métier
        </h1>

        <p className="text-lg md:text-xl text-[#1E73D8] max-w-2xl mx-auto">
          Accédez à vos solutions en un seul endroit, simplement.
        </p>
      </section>

      {/* GRID */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
        {apps.map((app) => {
          const Icon = icons[app.slug];

          return (
            <Link
              key={app.slug}
              href={`/apps/${app.slug}`}
              className="group relative rounded-3xl p-8 border border-[#E2E8F0] bg-white/80 backdrop-blur-sm shadow-[0_6px_20px_rgba(15,23,42,0.04)] hover:shadow-[0_14px_40px_rgba(15,23,42,0.08)] hover:-translate-y-1 hover:scale-[1.015] transition-all duration-300"
            >
              {/* ICON */}
              <div className="mb-6 w-12 h-12 rounded-xl bg-[#E8F1FB] flex items-center justify-center group-hover:bg-[#1E73D8] transition">
                <Icon className="w-5 h-5 text-[#0A4D9B] group-hover:text-white transition" />
              </div>

              {/* TITLE */}
              <h3 className="text-[20px] font-semibold mb-3 text-[#0F172A] group-hover:text-[#0A4D9B] transition">
                {app.name}
              </h3>

              {/* DESC */}
              <p className="text-[#6B7280] text-base mb-10 leading-relaxed">
                {app.description}
              </p>

              {/* CTA */}
              <div className="flex justify-between items-center">
               

                <div className="w-10 h-10 rounded-full bg-[#E8F1FB] text-[#0A4D9B] flex items-center justify-center group-hover:bg-[#1E73D8] group-hover:text-white transition-all duration-300">
                  →
                </div>
              </div>

              {/* HOVER LIGHT EFFECT */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1E73D8]/5 to-transparent rounded-3xl"></div>
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
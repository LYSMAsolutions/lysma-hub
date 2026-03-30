import Link from "next/link";
import { notFound } from "next/navigation";
import { apps } from "@/app/data/apps";

type PageProps = {
  params: {
    slug: string;
  };
};

export default function OutilPage({ params }: PageProps) {
  const app = apps.find((item) => item.slug === params.slug);

  if (!app) return notFound();

  return (
    <main className="min-h-screen bg-[#F2F4F7] text-[#0F172A]">

      {/* HEADER */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-16">

        <Link
          href="/"
          className="inline-flex items-center text-sm text-[#1E73D8] hover:text-[#0A4D9B] transition mb-10"
        >
          ← Retour au hub
        </Link>

        <div className="grid md:grid-cols-2 gap-10 items-center">

          {/* TEXTE */}
          <div>
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-[#0A4D9B] mb-4">
              {app.name}
            </h1>

            <p className="text-lg text-[#1E73D8] mb-6">
              {app.description}
            </p>

            <p className="text-[#6B7280] text-base leading-relaxed mb-10">
              {app.longDescription}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href={app.href}
                className="px-6 py-3 rounded-2xl bg-[#0A4D9B] text-white hover:bg-[#1E73D8] transition"
                >
                Accéder à l’outil
                </Link>

              <button className="px-6 py-3 rounded-2xl border border-[#DCE3EC] bg-white text-[#0F172A] hover:border-[#1E73D8] hover:text-[#0A4D9B] transition">
                Demander une démo
              </button>
            </div>
          </div>

          {/* VISUEL */}
          <div className="rounded-3xl border border-[#E2E8F0] bg-white/70 backdrop-blur-sm p-8 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <div className="h-[220px] flex items-center justify-center text-[#1E73D8]">
              Aperçu de l’outil
            </div>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 pb-20 grid md:grid-cols-3 gap-6">

        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]">
          <h3 className="font-semibold mb-2">Simple</h3>
          <p className="text-sm text-[#6B7280]">
            Une prise en main rapide pour tous les utilisateurs.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]">
          <h3 className="font-semibold mb-2">Efficace</h3>
          <p className="text-sm text-[#6B7280]">
            Pensé pour le terrain et les usages réels.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]">
          <h3 className="font-semibold mb-2">Évolutif</h3>
          <p className="text-sm text-[#6B7280]">
            Adapté à votre activité et à vos besoins.
          </p>
        </div>

      </section>

    </main>
  );
}
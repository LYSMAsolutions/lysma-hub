import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F2F4F7] text-[#0F172A] flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-4xl font-semibold text-[#0A4D9B] mb-4">
          Page introuvable
        </h1>

        <p className="text-[#6B7280] mb-8">
          Cette page n’existe pas ou n’est pas encore disponible.
        </p>

        <Link
          href="/"
          className="inline-flex px-6 py-3 rounded-2xl bg-[#0A4D9B] text-white hover:bg-[#1E73D8] transition"
        >
          Retour au hub
        </Link>
      </div>
    </main>
  );
}
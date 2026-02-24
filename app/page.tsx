import { PocDashboard } from "@/components/poc-dashboard";
import { getPocDashboardData } from "@/lib/poc-dashboard";

export const revalidate = 300;

async function loadDashboardData() {
  try {
    const data = await getPocDashboardData();
    return { data, hasError: false as const };
  } catch {
    return { data: null, hasError: true as const };
  }
}

export default async function HomePage() {
  const result = await loadDashboardData();

  if (result.hasError || !result.data) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10">
        <section className="rounded-xl border border-red-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-red-700">Kanboard indisponivel no momento</h1>
          <p className="mt-2 text-sm text-slate-600">
            Nao foi possivel carregar os dados da prova de conceito. Tente novamente em instantes.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <PocDashboard data={result.data} />
    </main>
  );
}

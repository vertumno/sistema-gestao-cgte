"use client";

import { useCallback, useEffect, useState } from "react";
import { useDashboardStore } from "@/stores/dashboard-store";
import type { AreaFilter, MetricsResponse, PeriodType } from "@/types/dashboard";

type DashboardSource = "api" | "csv";

type UseDashboardDataReturn = {
  data: MetricsResponse | null;
  loading: boolean;
  error: string | null;
  source: DashboardSource;
  period: PeriodType;
  area: AreaFilter;
  handleCsvImport: (data: MetricsResponse) => void;
};

const CSV_STORAGE_KEY = "cgte-csv-data";

function loadCsvFromStorage(): MetricsResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CSV_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { data: MetricsResponse };
    return parsed.data ?? null;
  } catch {
    return null;
  }
}

export function useDashboardData(): UseDashboardDataReturn {
  const period = useDashboardStore((state) => state.period);
  const area = useDashboardStore((state) => state.area);

  const [data, setData] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<DashboardSource>(() => {
    if (typeof window === "undefined") return "api";
    return localStorage.getItem(CSV_STORAGE_KEY) ? "csv" : "api";
  });

  // Hidratar dados CSV do localStorage na montagem inicial
  useEffect(() => {
    if (source === "csv") {
      const saved = loadCsvFromStorage();
      if (saved) {
        setData(saved);
        setLoading(false);
      } else {
        // Storage corrompido ou expirado — volta para API
        setSource("api");
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (source === "csv") {
      setLoading(false);
      return;
    }

    let mounted = true;

    async function loadMetrics() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/metrics?period=${period}&area=${encodeURIComponent(area)}`
        );
        if (!response.ok) throw new Error("Falha ao carregar métricas.");
        const payload = (await response.json()) as MetricsResponse;
        if (mounted) {
          setData(payload);
          setSource("api");
        }
      } catch {
        if (mounted) setError("Não foi possível carregar os dados do dashboard.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadMetrics();
    return () => {
      mounted = false;
    };
  }, [period, area, source]);

  const handleCsvImport = useCallback((metricsData: MetricsResponse) => {
    try {
      localStorage.setItem(CSV_STORAGE_KEY, JSON.stringify({ data: metricsData, savedAt: Date.now() }));
    } catch {
      // localStorage indisponível (ex: modo privado com storage cheio) — continua sem persistir
    }
    setData(metricsData);
    setError(null);
    setSource("csv");
    setLoading(false);
  }, []);

  return { data, loading, error, source, period, area, handleCsvImport };
}

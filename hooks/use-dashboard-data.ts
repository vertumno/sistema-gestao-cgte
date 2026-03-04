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

export function useDashboardData(): UseDashboardDataReturn {
  const period = useDashboardStore((state) => state.period);
  const area = useDashboardStore((state) => state.area);

  const [data, setData] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<DashboardSource>("api");

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
    setData(metricsData);
    setError(null);
    setSource("csv");
    setLoading(false);
  }, []);

  return { data, loading, error, source, period, area, handleCsvImport };
}

import { create } from "zustand";
import type { AreaFilter, PeriodType } from "@/types/dashboard";

type DashboardState = {
  period: PeriodType;
  area: AreaFilter;
  setPeriod: (period: PeriodType) => void;
  setArea: (area: AreaFilter) => void;
};

export const useDashboardStore = create<DashboardState>((set) => ({
  period: "trimestre",
  area: "Todas",
  setPeriod: (period) => set({ period }),
  setArea: (area) => set({ area })
}));
import { create } from "zustand";
import { getCurrentTrimesterLabel } from "@/lib/pgd-periods";

type ReportState = {
  trimestre: string;
  servidorId: string;
  ano: number;
  setTrimestre: (trimestre: string) => void;
  setServidor: (servidorId: string) => void;
  setAno: (ano: number) => void;
};

export const useReportStore = create<ReportState>((set) => ({
  trimestre: getCurrentTrimesterLabel(new Date()),
  servidorId: "todos",
  ano: new Date().getFullYear(),
  setTrimestre: (trimestre) => set({ trimestre }),
  setServidor: (servidorId) => set({ servidorId }),
  setAno: (ano) => set({ ano })
}));
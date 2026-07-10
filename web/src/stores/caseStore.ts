import { create } from "zustand";
import { ClinicalCase, CaseStatus } from "@/types/case";

interface CaseState {
  activeCase: ClinicalCase | null;
  cases: ClinicalCase[];
  safetyStatus: "safe" | "warning" | "danger";
  setActiveCase: (activeCase: ClinicalCase | null) => void;
  updateCaseStatus: (caseId: string, status: CaseStatus) => void;
}

export const useCaseStore = create<CaseState>((set) => ({
  activeCase: null,
  cases: [],
  safetyStatus: "safe",
  setActiveCase: (activeCase) => set({ activeCase }),
  updateCaseStatus: (caseId, status) => set((state) => ({
    cases: state.cases.map((c) => (c.id === caseId ? { ...c, status } : c)),
    activeCase: state.activeCase?.id === caseId ? { ...state.activeCase, status } : state.activeCase
  })),
}));

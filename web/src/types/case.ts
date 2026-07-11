export type CaseStatus = 'en_analisis' | 'enfermo' | 'derivado' | 'en_tratamiento' | 'curado' | 'archivado';

export interface TimelineEvent {
  id: string;
  type: string;
  timestamp: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
}

export interface ClinicalCase {
  id: string;
  title: string;
  status: CaseStatus;
  timeline: TimelineEvent[];
}

"use client";

import { ContextRail } from "@/components/ContextRail";
import { ConversationalCareCanvas } from "@/components/ConversationalCareCanvas";
import { ClinicalTimelineRiver } from "@/components/ClinicalTimelineRiver";

export default function ConsultationPage() {
  return (
    <div className="flex flex-col lg:flex-row h-full gap-4 relative z-10 w-full">
      {/* Context Rail */}
      <div className="hidden lg:block w-[300px] shrink-0 h-full overflow-y-auto rounded-xl">
        <ContextRail />
      </div>

      {/* Main Canvas */}
      <div className="flex-1 h-full min-w-0 bg-background/50 rounded-xl border border-glass-border overflow-hidden">
        <ConversationalCareCanvas />
      </div>

      {/* Timeline River */}
      <div className="hidden xl:block w-[350px] shrink-0 h-full overflow-y-auto rounded-xl">
        <ClinicalTimelineRiver />
      </div>
    </div>
  );
}

"use client";

import { ContextRail } from "@/components/ContextRail";
import { ConversationalCareCanvas } from "@/components/ConversationalCareCanvas";
import { ClinicalTimelineRiver } from "@/components/ClinicalTimelineRiver";

export default function Home() {
  return (
    <main className="relative flex h-full w-full p-4 lg:p-6 gap-6 overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-secondary/10 rounded-full blur-[150px] -z-10 pointer-events-none" />

      {/* Main Grid Layout */}
      <div className="flex flex-col lg:flex-row w-full h-full max-w-[1600px] mx-auto gap-6 z-10">
        
        {/* Left: Context Rail (Hidden on small, drawer logic could go here later) */}
        <div className="hidden lg:block w-[300px] shrink-0">
          <ContextRail />
        </div>

        {/* Center: Conversational Canvas */}
        <div className="flex-1 min-w-0 h-full">
          <ConversationalCareCanvas />
        </div>

        {/* Right: Clinical Timeline (Hidden on medium/small, stack later) */}
        <div className="hidden xl:block w-[350px] shrink-0">
          <ClinicalTimelineRiver />
        </div>

      </div>

    </main>
  );
}

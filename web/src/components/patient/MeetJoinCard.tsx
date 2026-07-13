"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/providers/LanguageProvider";

interface MeetJoinCardProps {
  meetLink: string;
  dateTime: string;
  doctorName?: string | null;
  caseTitle?: string | null;
}

export function MeetJoinCard({ meetLink, dateTime, doctorName, caseTitle }: MeetJoinCardProps) {
  const { locale } = useLanguage();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(meetLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const dateStr = new Date(dateTime).toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className="glass-panel border-glass-border bg-primary/5">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/20 rounded-xl">
            <Video className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{locale === "es" ? "Cita Virtual Programada" : "Virtual Appointment Scheduled"}</h3>
            <p className="text-xs text-muted-foreground">{dateStr}</p>
          </div>
        </div>

        {doctorName && (
          <div className="text-sm">
            <span className="text-muted-foreground">{locale === "es" ? "Médico:" : "Doctor:"}</span>{" "}
            <span className="font-medium">{doctorName}</span>
          </div>
        )}

        {caseTitle && (
          <div className="text-sm">
            <span className="text-muted-foreground">{locale === "es" ? "Motivo:" : "Reason:"}</span>{" "}
            <span className="font-medium">{caseTitle}</span>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={() => window.open(meetLink, "_blank")} className="flex-1 gap-2">
            <Video className="w-4 h-4" />
            {locale === "es" ? "Unirse a la reunión" : "Join Meeting"}
          </Button>
          <Button variant="outline" size="icon" onClick={copyLink}>
            {copied ? <CheckCircle2 className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
"use client";

import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

export function RegionDetectorNotice() {
  const [region, setRegion] = useState<string | null>(null);

  useEffect(() => {
    const detectRegion = () => {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz.includes("America/Mexico")) return "México";
      if (tz.includes("America/Argentina")) return "Argentina";
      if (tz.includes("America/Chile")) return "Chile";
      if (tz.includes("America/Colombia")) return "Colombia";
      if (tz.includes("America/Spain")) return "España";
      return "Latinoamérica";
    };
    setRegion(detectRegion());
  }, []);

  if (!region) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge variant="outline" className="fixed bottom-4 right-4 z-40 bg-background/80 backdrop-blur-sm border-glass-border">
            <MapPin className="w-3 h-3 mr-1" />
            {region}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Zona configurada automáticamente basada en tu ubicación</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
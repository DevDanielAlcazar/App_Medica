import { cn } from "@/lib/utils";
import { ShieldAlert, ShieldCheck, Shield } from "lucide-react";
import { useTranslation } from "@/lib/i18n/config";

interface SafetyRibbonProps {
  status: "safe" | "warning" | "danger";
  className?: string;
}

export function SafetyRibbon({ status, className }: SafetyRibbonProps) {
  const { t } = useTranslation();
  
  const statusConfig = {
    safe: {
      color: "bg-success/20 text-success border-success/30",
      icon: ShieldCheck,
      text: t("safety.general_followup"),
      description: t("safety.safe_description")
    },
    warning: {
      color: "bg-warning/20 text-warning border-warning/30",
      icon: Shield,
      text: t("safety.vigilance_required"),
      description: t("safety.warning_description")
    },
    danger: {
      color: "bg-danger/20 text-danger border-danger/30",
      icon: ShieldAlert,
      text: t("safety.urgent_referral"),
      description: t("safety.danger_description")
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={cn(
      "w-full px-4 py-2 flex items-center justify-center gap-3 text-sm backdrop-blur-md border-b z-50",
      config.color,
      className
    )}>
      <Icon className="w-4 h-4" />
      <span className="font-semibold">{config.text}</span>
      <span className="hidden md:inline opacity-80">- {config.description}</span>
    </div>
  );
}

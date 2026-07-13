"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, MapPin, RefreshCw, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/config";

interface LocationShareData {
  token: string;
  expiresAt: string;
  expiresInHours: number;
}

export function LocationShareCard() {
  const { t } = useTranslation();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [shareData, setShareData] = useState<LocationShareData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const getCurrentLocation = () => {
    setLoading(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      (err) => {
        setError(t("patient.location_permission"));
        setLoading(false);
      }
    );
  };

  const generateShareToken = async (hours: number) => {
    if (!location) return;
    setLoading(true);
    try {
      const res = await fetch("/api/patient/location/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat: location.lat, lng: location.lng, hours }),
      });
      const data = await res.json();
      if (data.success) {
        setShareData(data);
      } else {
        setError(data.error || t("patient.location_share"));
      }
    } catch (err) {
      setError(t("admin.error_connection"));
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (!shareData) return;
    navigator.clipboard.writeText(shareData.token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="glass-panel border-glass-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          {t("patient.location_share")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!location ? (
          <div className="text-center py-4">
            <p className="text-xs text-muted-foreground mb-4">
              {t("patient.location_permission")}
            </p>
            <Button
              onClick={getCurrentLocation}
              disabled={loading}
              size="sm"
              className="gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <MapPin className="w-4 h-4" />
              )}
              {t("patient.get_location")}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-3 bg-muted/30 rounded-lg text-xs">
              <p className="text-muted-foreground mb-1">
                {t("patient.coordinates")}:
              </p>
              <code className="font-mono">
                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </code>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium">
                {t("patient.expiry_hours")}:
              </p>
              <div className="flex gap-2">
                {[1, 4, 12, 24].map((h) => (
                  <Button
                    key={h}
                    variant="outline"
                    size="sm"
                    className={cn(
                      "flex-1 h-9 text-xs gap-1",
                      shareData?.expiresInHours === h && "border-primary"
                    )}
                    onClick={() => generateShareToken(h)}
                    disabled={loading}
                  >
                    {h}h
                  </Button>
                ))}
              </div>
            </div>

            {shareData && (
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-xs font-medium text-foreground mb-2">
                  {t("patient.share_link")}:
                </p>
                <div className="flex gap-2">
                  <code className="flex-1 text-xs font-mono bg-background/50 p-2 rounded break-all">
                    {shareData.token}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={copyLink}
                    className="h-8 w-8 p-0"
                  >
                    {copied ? (
                      <RefreshCw className="w-3 h-3 text-success" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">
                  {t("patient.expires_at")}:{" "}
                  {new Date(shareData.expiresAt).toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            )}

            {shareData && (
              <div className="p-3 bg-muted/30 rounded-lg text-xs text-muted-foreground">
                <p>
                  <strong>Nota:</strong> {t("patient.location_disclaimer")}
                </p>
              </div>
            )}

            {error && (
              <p className="text-xs text-destructive bg-destructive/10 p-2 rounded-lg">
                {error}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, Loader2, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/providers/LanguageProvider";

interface EvidenceDropzoneProps {
  caseId: string;
  onUploadComplete?: () => void;
}

export function EvidenceDropzone({ caseId, onUploadComplete }: EvidenceDropzoneProps) {
  const { locale } = useLanguage();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    const valid = dropped.filter((f) => f.type.startsWith("image/") || f.type === "application/pdf");
    setFiles((prev) => [...prev, ...valid]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    const valid = selected.filter((f) => f.type.startsWith("image/") || f.type === "application/pdf");
    setFiles((prev) => [...prev, ...valid]);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    setSuccess(false);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        await fetch(`/api/patient/cases/${caseId}/attachments`, {
          method: "POST",
          body: formData,
        });
      }
      setFiles([]);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      onUploadComplete?.();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const t = (key: string) => {
    const translations: Record<string, string> = {
      dropzone_hint: locale === "es" ? "Arrastra fotos o PDFs aquí" : "Drag photos or PDFs here",
      select_files: locale === "es" ? "Seleccionar archivos" : "Select files",
      upload: locale === "es" ? "Subir evidencia" : "Upload evidence",
      max_files: locale === "es" ? "Máximo 10 archivos" : "Maximum 10 files",
    };
    return translations[key] || key;
  };

  return (
    <div className="glass-panel p-6 rounded-xl border border-glass-border bg-background/25">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Upload className="w-4 h-4 text-primary" />
        {t("upload")}
      </h3>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-glass-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-xs text-muted-foreground mb-2">{t("dropzone_hint")}</p>
        <p className="text-[10px] text-muted-foreground mb-4">{t("max_files")}</p>
        <Button variant="outline" size="sm" onClick={() => document.getElementById("evidence-input")?.click()}>
          {t("select_files")}
        </Button>
        <input
          id="evidence-input"
          type="file"
          accept="image/*,application/pdf"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center justify-between text-xs bg-muted/20 p-2 rounded">
              <span className="truncate">{f.name}</span>
              <X className="w-3 h-3 cursor-pointer" onClick={() => setFiles(files.filter((_, idx) => idx !== i))} />
            </div>
          ))}
          <Button onClick={handleUpload} disabled={uploading} className="w-full gap-2 mt-2">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : success ? <CheckCircle2 className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
            {t("upload")}
          </Button>
        </div>
      )}
    </div>
  );
}
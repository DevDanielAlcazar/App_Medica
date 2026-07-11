"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Loader2, Plus, Trash2, Bot, Key, Cpu, GitBranch,
  CheckCircle2, XCircle, RefreshCw, Shield, Zap, Eye, EyeOff,
  AlertCircle, Search, Download, ChevronDown, ChevronUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

/* ─── Tipos ─────────────────────────────────────────────── */
interface Provider { id: string; name: string; protocol: string; baseUrl: string; completionEndpoint: string; status: string; priority: number; supportsStreaming: boolean; supportsVision: boolean; supportsTools: boolean; apiKeys: ApiKey[]; models: AiModel[]; }
interface ApiKey { id: string; label: string; encryptedSecret: string; status: string; rateLimit: number | null; monthlyBudget: number | null; provider: { name: string }; }
interface AiModel { id: string; modelName: string; displayName: string; enabled: boolean; clinicalAllowed: boolean; costTier: string; latencyTier: string; capabilities: string[]; provider: { name: string; status: string }; }
interface Policy { id: string; useCase: string; riskLevel: string; allowedModels: string[]; fallbackChain: string[]; maxCost: string; maxLatency: string; requireClinicalApproved: boolean; }
interface RemoteModel { id: string; alreadyImported: boolean; }

export default function AdminIAPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [models, setModels] = useState<AiModel[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);

  /* Forms */
  const [newProv, setNewProv] = useState({ name: "", protocol: "openai", baseUrl: "", completionEndpoint: "/v1/chat/completions" });
  const [newKey, setNewKey] = useState({ providerId: "", label: "", secret: "", rateLimit: "", monthlyBudget: "" });
  const [showSecret, setShowSecret] = useState(false);
  const [newModel, setNewModel] = useState({ providerId: "", modelName: "", displayName: "" });
  const [newPolicy, setNewPolicy] = useState({ useCase: "", riskLevel: "low", requireClinicalApproved: false });

  const [submitting, setSubmitting] = useState(false);

  /* Auto-discovery state */
  const [syncProviderId, setSyncProviderId] = useState("");
  const [discoveredModels, setDiscoveredModels] = useState<RemoteModel[] | null>(null);
  const [discoverySearch, setDiscoverySearch] = useState("");
  const [selectedModels, setSelectedModels] = useState<Set<string>>(new Set());
  const [discovering, setDiscovering] = useState(false);
  const [importing, setImporting] = useState(false);

  /* Models search */
  const [modelSearch, setModelSearch] = useState("");

  const loadAll = async () => {
    setLoading(true);
    try {
      const [pRes, kRes, mRes, polRes] = await Promise.all([
        fetch("/api/admin/ai/providers"), fetch("/api/admin/ai/keys"),
        fetch("/api/admin/ai/models"), fetch("/api/admin/ai/policies"),
      ]);
      const [pData, kData, mData, polData] = await Promise.all([pRes.json(), kRes.json(), mRes.json(), polRes.json()]);
      if (pData.success) setProviders(pData.providers);
      if (kData.success) setKeys(kData.keys);
      if (mData.success) setModels(mData.models);
      if (polData.success) setPolicies(polData.policies);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  /* ─── Helpers ──────────────────────────────────────────── */
  const riskColor = (r: string) => r === "high" ? "text-destructive border-destructive/30 bg-destructive/10" : r === "medium" ? "text-yellow-500 border-yellow-500/30 bg-yellow-500/10" : "text-emerald-500 border-emerald-500/30 bg-emerald-500/10";

  /* ─── Proveedores ──────────────────────────────────────── */
  const handleAddProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/ai/providers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newProv) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Proveedor creado.");
      setNewProv({ name: "", protocol: "openai", baseUrl: "", completionEndpoint: "/v1/chat/completions" });
      loadAll();
    } catch (e: any) { toast.error(e.message); } finally { setSubmitting(false); }
  };
  const handleDeleteProvider = async (id: string) => {
    if (!confirm("¿Eliminar este proveedor y todas sus keys y modelos?")) return;
    await fetch(`/api/admin/ai/providers?id=${id}`, { method: "DELETE" });
    toast.success("Proveedor eliminado."); loadAll();
  };

  /* ─── API Keys ─────────────────────────────────────────── */
  const handleAddKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/ai/keys", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newKey) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("API Key registrada.");
      setNewKey({ providerId: "", label: "", secret: "", rateLimit: "", monthlyBudget: "" });
      loadAll();
    } catch (e: any) { toast.error(e.message); } finally { setSubmitting(false); }
  };
  const handleDeleteKey = async (id: string) => {
    await fetch(`/api/admin/ai/keys?id=${id}`, { method: "DELETE" });
    toast.success("Key eliminada."); loadAll();
  };

  /* ─── Modelos ──────────────────────────────────────────── */
  const handleToggleModel = async (modelId: string, field: "enabled" | "clinicalAllowed", value: boolean) => {
    const res = await fetch("/api/admin/ai/models", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ modelId, [field]: value }) });
    const data = await res.json();
    if (!res.ok) { toast.error(data.error); return; }
    setModels(prev => prev.map(m => m.id === modelId ? { ...m, [field]: value } : m));
  };
  const handleAddModel = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/ai/models", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newModel) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Modelo registrado.");
      setNewModel({ providerId: "", modelName: "", displayName: "" });
      loadAll();
    } catch (e: any) { toast.error(e.message); } finally { setSubmitting(false); }
  };
  const handleDeleteModel = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar el modelo "${name}"? Esta acción no se puede deshacer.`)) return;
    const res = await fetch(`/api/admin/ai/models?id=${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) { toast.error(data.error || "Error al eliminar modelo."); return; }
    toast.success(`Modelo "${name}" eliminado.`);
    setModels(prev => prev.filter(m => m.id !== id));
  };

  /* ─── Auto-discovery ────────────────────────────────────── */
  const handleDiscoverModels = async () => {
    if (!syncProviderId) { toast.error("Selecciona un proveedor."); return; }
    setDiscovering(true);
    setDiscoveredModels(null);
    setSelectedModels(new Set());
    setDiscoverySearch("");
    try {
      const res = await fetch(`/api/admin/ai/models/sync?providerId=${syncProviderId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDiscoveredModels(data.models);
      const newOnes = data.models.filter((m: RemoteModel) => !m.alreadyImported).map((m: RemoteModel) => m.id);
      setSelectedModels(new Set(newOnes)); // Pre-seleccionar solo los nuevos
      toast.success(`${data.models.length} modelos descubiertos. ${newOnes.length} nuevos disponibles para importar.`);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setDiscovering(false);
    }
  };

  const handleImportSelected = async () => {
    if (selectedModels.size === 0) { toast.error("Selecciona al menos un modelo para importar."); return; }
    setImporting(true);
    try {
      const res = await fetch("/api/admin/ai/models/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerId: syncProviderId, selectedModelIds: Array.from(selectedModels) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`${data.importedCount} modelo(s) importados exitosamente (deshabilitados por defecto, habilítalos en la lista).`);
      setDiscoveredModels(null);
      setSelectedModels(new Set());
      loadAll();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setImporting(false);
    }
  };

  const toggleModelSelection = (modelId: string) => {
    setSelectedModels(prev => {
      const next = new Set(prev);
      if (next.has(modelId)) next.delete(modelId);
      else next.add(modelId);
      return next;
    });
  };

  const selectAllVisible = () => {
    if (!discoveredModels) return;
    const visible = filteredDiscovered.filter(m => !m.alreadyImported).map(m => m.id);
    setSelectedModels(new Set(visible));
  };

  const deselectAll = () => setSelectedModels(new Set());

  const filteredDiscovered = discoveredModels?.filter(m =>
    !discoverySearch || m.id.toLowerCase().includes(discoverySearch.toLowerCase())
  ) ?? [];

  /* ─── Políticas ─────────────────────────────────────────── */
  const handleAddPolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/ai/policies", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newPolicy) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Política de ruteo creada.");
      setNewPolicy({ useCase: "", riskLevel: "low", requireClinicalApproved: false });
      loadAll();
    } catch (e: any) { toast.error(e.message); } finally { setSubmitting(false); }
  };
  const handleDeletePolicy = async (id: string) => {
    await fetch(`/api/admin/ai/policies?id=${id}`, { method: "DELETE" });
    toast.success("Política eliminada."); loadAll();
  };

  // Filtered models for list
  const filteredModels = models.filter(m =>
    !modelSearch || m.modelName.toLowerCase().includes(modelSearch.toLowerCase()) || m.displayName.toLowerCase().includes(modelSearch.toLowerCase()) || m.provider?.name.toLowerCase().includes(modelSearch.toLowerCase())
  );

  /* ─── Render ─────────────────────────────────────────────── */
  return (
    <div className="max-w-6xl mx-auto space-y-6 z-10 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-outfit font-bold">Configuración de IA</h1>
        <Button variant="outline" size="sm" onClick={loadAll} className="gap-2 rounded-xl">
          <RefreshCw className="w-4 h-4" /> Recargar
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span>Cargando configuración de IA...</span>
        </div>
      ) : (
        <Tabs defaultValue="providers" className="w-full">
          <TabsList className="border-b border-glass-border rounded-none bg-transparent h-12 p-0 space-x-6 mb-6 flex overflow-x-auto">
            {[
              { value: "providers", label: "Proveedores", icon: Bot },
              { value: "keys", label: "API Keys", icon: Key },
              { value: "models", label: "Modelos", icon: Cpu },
              { value: "policies", label: "Políticas de Ruteo", icon: GitBranch },
            ].map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value} className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent px-0 text-sm font-semibold flex items-center gap-1.5 whitespace-nowrap">
                <Icon className="w-4 h-4" /> {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ── PROVEEDORES ─────────────────────────────── */}
          <TabsContent value="providers" className="space-y-5">
            {/* Formulario nuevo proveedor */}
            <Card className="glass-panel border-glass-border bg-background/25">
              <CardHeader><CardTitle className="text-sm font-bold text-primary uppercase flex items-center gap-2"><Plus className="w-4 h-4" />Agregar Proveedor IA</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleAddProvider} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="space-y-1"><label className="text-[10px] font-bold text-muted-foreground uppercase">Nombre ID</label><Input value={newProv.name} onChange={e => setNewProv(p => ({ ...p, name: e.target.value }))} placeholder="openai, anthropic, deepseek..." required className="rounded-xl border-glass-border bg-elevated/35" /></div>
                  <div className="space-y-1"><label className="text-[10px] font-bold text-muted-foreground uppercase">Protocolo</label>
                    <select value={newProv.protocol} onChange={e => setNewProv(p => ({ ...p, protocol: e.target.value }))} className="w-full bg-elevated/35 border border-glass-border text-foreground text-sm rounded-xl p-2.5 outline-none">
                      <option value="openai">OpenAI-compatible</option>
                      <option value="claude">Anthropic / Claude</option>
                      <option value="generic">Genérico</option>
                    </select>
                  </div>
                  <div className="space-y-1"><label className="text-[10px] font-bold text-muted-foreground uppercase">Base URL</label><Input value={newProv.baseUrl} onChange={e => setNewProv(p => ({ ...p, baseUrl: e.target.value }))} placeholder="https://api.openai.com" required className="rounded-xl border-glass-border bg-elevated/35" /></div>
                  <div className="space-y-1 sm:col-span-2"><label className="text-[10px] font-bold text-muted-foreground uppercase">Endpoint de completions</label><Input value={newProv.completionEndpoint} onChange={e => setNewProv(p => ({ ...p, completionEndpoint: e.target.value }))} placeholder="/v1/chat/completions" required className="rounded-xl border-glass-border bg-elevated/35" /></div>
                  <div className="flex items-end"><Button type="submit" disabled={submitting} className="w-full bg-primary text-primary-foreground rounded-xl gap-2">{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}Agregar</Button></div>
                </form>
              </CardContent>
            </Card>

            {/* Lista de proveedores */}
            {providers.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-glass-border rounded-2xl text-muted-foreground text-sm">No hay proveedores configurados.</div>
            ) : (
              <div className="grid gap-3">
                {providers.map(p => (
                  <Card key={p.id} className="glass-panel border-glass-border bg-background/25 hover:border-primary/30 transition-colors">
                    <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">{p.name}</span>
                          <Badge variant="outline" className={`text-[9px] font-bold rounded-full ${p.status === "active" ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/10" : "border-glass-border text-muted-foreground"}`}>{p.status}</Badge>
                          <Badge variant="outline" className="text-[9px] font-mono border-glass-border text-muted-foreground">{p.protocol}</Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground font-mono">{p.baseUrl}{p.completionEndpoint}</p>
                        <div className="flex gap-2 text-[10px] text-muted-foreground">
                          {p.supportsStreaming && <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-primary" />Streaming</span>}
                          {p.supportsVision && <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-secondary" />Vision</span>}
                          <span>{p.apiKeys.length} key(s) · {p.models.length} modelo(s)</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteProvider(p.id)} className="text-destructive hover:bg-destructive/10 rounded-lg gap-1 self-end sm:self-center">
                        <Trash2 className="w-3.5 h-3.5" /> Eliminar
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── API KEYS ─────────────────────────────────── */}
          <TabsContent value="keys" className="space-y-5">
            <Card className="glass-panel border-glass-border bg-background/25">
              <CardHeader><CardTitle className="text-sm font-bold text-primary uppercase flex items-center gap-2"><Key className="w-4 h-4" />Agregar API Key</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleAddKey} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="space-y-1"><label className="text-[10px] font-bold text-muted-foreground uppercase">Proveedor</label>
                    <select value={newKey.providerId} onChange={e => setNewKey(k => ({ ...k, providerId: e.target.value }))} required className="w-full bg-elevated/35 border border-glass-border text-foreground text-sm rounded-xl p-2.5 outline-none">
                      <option value="">Seleccionar proveedor...</option>
                      {providers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1"><label className="text-[10px] font-bold text-muted-foreground uppercase">Etiqueta</label><Input value={newKey.label} onChange={e => setNewKey(k => ({ ...k, label: e.target.value }))} placeholder="Ej. Key Producción #1" required className="rounded-xl border-glass-border bg-elevated/35" /></div>
                  <div className="space-y-1"><label className="text-[10px] font-bold text-muted-foreground uppercase">Límite de Rate (req/min)</label><Input type="number" value={newKey.rateLimit} onChange={e => setNewKey(k => ({ ...k, rateLimit: e.target.value }))} placeholder="Opcional" className="rounded-xl border-glass-border bg-elevated/35" /></div>
                  <div className="space-y-1 sm:col-span-2 relative"><label className="text-[10px] font-bold text-muted-foreground uppercase">API Secret Key</label>
                    <div className="relative"><Input type={showSecret ? "text" : "password"} value={newKey.secret} onChange={e => setNewKey(k => ({ ...k, secret: e.target.value }))} placeholder="sk-..." required className="rounded-xl border-glass-border bg-elevated/35 pr-10 font-mono" />
                      <button type="button" onClick={() => setShowSecret(!showSecret)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">{showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                    </div>
                  </div>
                  <div className="flex items-end"><Button type="submit" disabled={submitting} className="w-full bg-primary text-primary-foreground rounded-xl gap-2">{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}Registrar</Button></div>
                </form>
              </CardContent>
            </Card>

            {keys.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-glass-border rounded-2xl text-muted-foreground text-sm">No hay API Keys registradas.</div>
            ) : (
              <div className="grid gap-3">
                {keys.map(k => (
                  <Card key={k.id} className="glass-panel border-glass-border bg-background/25 hover:border-primary/30 transition-colors">
                    <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2"><span className="font-semibold text-sm text-foreground">{k.label}</span><Badge variant="outline" className="text-[9px] border-glass-border text-muted-foreground">{k.provider?.name}</Badge></div>
                        <p className="text-[11px] font-mono text-muted-foreground">{k.encryptedSecret}</p>
                        {k.rateLimit && <span className="text-[10px] text-muted-foreground">{k.rateLimit} req/min</span>}
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteKey(k.id)} className="text-destructive hover:bg-destructive/10 rounded-lg gap-1 self-end sm:self-center">
                        <Trash2 className="w-3.5 h-3.5" /> Revocar
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── MODELOS ──────────────────────────────────── */}
          <TabsContent value="models" className="space-y-5">
            <Card className="glass-panel border-glass-border bg-background/25">
              <CardHeader><CardTitle className="text-sm font-bold text-primary uppercase flex items-center gap-2"><Plus className="w-4 h-4" />Registrar Modelo</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleAddModel} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="space-y-1"><label className="text-[10px] font-bold text-muted-foreground uppercase">Proveedor</label>
                    <select value={newModel.providerId} onChange={e => setNewModel(m => ({ ...m, providerId: e.target.value }))} required className="w-full bg-elevated/35 border border-glass-border text-foreground text-sm rounded-xl p-2.5 outline-none">
                      <option value="">Seleccionar...</option>
                      {providers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1"><label className="text-[10px] font-bold text-muted-foreground uppercase">Model Name (API)</label><Input value={newModel.modelName} onChange={e => setNewModel(m => ({ ...m, modelName: e.target.value }))} placeholder="gpt-4o, claude-3-5..." required className="rounded-xl border-glass-border bg-elevated/35 font-mono text-xs" /></div>
                  <div className="space-y-1"><label className="text-[10px] font-bold text-muted-foreground uppercase">Nombre Display</label><Input value={newModel.displayName} onChange={e => setNewModel(m => ({ ...m, displayName: e.target.value }))} placeholder="GPT-4o" required className="rounded-xl border-glass-border bg-elevated/35" /></div>
                  <div className="flex items-end"><Button type="submit" disabled={submitting} className="w-full bg-primary text-primary-foreground rounded-xl gap-2">{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Cpu className="w-4 h-4" />}Agregar</Button></div>
                </form>
              </CardContent>
            </Card>

            {/* ── AUTO-DISCOVERY (2 pasos) ── */}
            <Card className="glass-panel border-glass-border bg-background/25">
              <CardHeader><CardTitle className="text-sm font-bold text-primary uppercase flex items-center gap-2"><RefreshCw className="w-4 h-4" />Sincronizar Modelos (Auto-Discovery)</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {/* Paso 1: Seleccionar proveedor y descubrir */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Proveedor a sincronizar</label>
                    <select
                      value={syncProviderId}
                      onChange={e => { setSyncProviderId(e.target.value); setDiscoveredModels(null); setSelectedModels(new Set()); }}
                      className="w-full bg-elevated/35 border border-glass-border text-foreground text-sm rounded-xl p-2.5 outline-none"
                    >
                      <option value="">Seleccionar proveedor con API Key activa...</option>
                      {providers.filter(p => p.apiKeys && p.apiKeys.length > 0).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      onClick={handleDiscoverModels}
                      disabled={discovering || !syncProviderId}
                      className="w-full sm:w-auto bg-secondary text-secondary-foreground rounded-xl gap-2 hover:bg-secondary/80"
                    >
                      {discovering ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                      Descubrir modelos
                    </Button>
                  </div>
                </div>

                {/* Paso 2: Lista de modelos descubiertos con checkboxes */}
                <AnimatePresence>
                  {discoveredModels !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-3 border border-glass-border rounded-xl p-4 bg-background/30"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">
                            {discoveredModels.length} modelos encontrados
                          </span>
                          <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-500 bg-emerald-500/10">
                            {discoveredModels.filter(m => !m.alreadyImported).length} nuevos
                          </Badge>
                          <Badge variant="outline" className="text-[9px] border-glass-border text-muted-foreground">
                            {discoveredModels.filter(m => m.alreadyImported).length} ya importados
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={selectAllVisible} className="text-[10px] text-primary hover:underline">Selec. nuevos</button>
                          <span className="text-muted-foreground text-[10px]">|</span>
                          <button type="button" onClick={deselectAll} className="text-[10px] text-muted-foreground hover:underline">Deseleccionar todo</button>
                        </div>
                      </div>

                      {/* Buscador */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <Input
                          value={discoverySearch}
                          onChange={e => setDiscoverySearch(e.target.value)}
                          placeholder="Buscar por nombre (ej: free, fast, claude...)"
                          className="pl-8 rounded-xl border-glass-border bg-elevated/30 text-xs h-9"
                        />
                      </div>

                      {/* Lista de modelos con checkboxes */}
                      <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
                        {filteredDiscovered.length === 0 ? (
                          <p className="text-xs text-muted-foreground text-center py-4">No se encontraron modelos con ese filtro.</p>
                        ) : (
                          filteredDiscovered.map(m => (
                            <label
                              key={m.id}
                              className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors hover:bg-elevated/30 ${m.alreadyImported ? "opacity-50" : ""}`}
                            >
                              <input
                                type="checkbox"
                                checked={selectedModels.has(m.id)}
                                onChange={() => !m.alreadyImported && toggleModelSelection(m.id)}
                                disabled={m.alreadyImported}
                                className="w-4 h-4 accent-primary rounded"
                              />
                              <span className="font-mono text-xs text-foreground flex-1">{m.id}</span>
                              {m.alreadyImported && (
                                <Badge variant="outline" className="text-[9px] border-glass-border text-muted-foreground shrink-0">ya importado</Badge>
                              )}
                            </label>
                          ))
                        )}
                      </div>

                      {/* Botón de importar */}
                      <div className="flex items-center justify-between pt-2 border-t border-glass-border">
                        <span className="text-xs text-muted-foreground">{selectedModels.size} modelo(s) seleccionado(s)</span>
                        <Button
                          type="button"
                          onClick={handleImportSelected}
                          disabled={importing || selectedModels.size === 0}
                          className="bg-primary text-primary-foreground rounded-xl gap-2 text-xs"
                        >
                          {importing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                          Importar seleccionados
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Buscador de modelos existentes */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={modelSearch}
                onChange={e => setModelSearch(e.target.value)}
                placeholder="Buscar en modelos configurados (nombre, proveedor, ID)..."
                className="pl-10 rounded-xl border-glass-border bg-background/30"
              />
            </div>

            {filteredModels.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-glass-border rounded-2xl text-muted-foreground text-sm">
                {modelSearch ? "No se encontraron modelos con ese filtro." : "No hay modelos configurados."}
              </div>
            ) : (
              <div className="grid gap-3">
                {filteredModels.map(m => (
                  <Card key={m.id} className="glass-panel border-glass-border bg-background/25 hover:border-primary/20 transition-colors">
                    <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-foreground">{m.displayName}</span>
                          <Badge variant="outline" className="text-[9px] border-glass-border text-muted-foreground font-mono">{m.modelName}</Badge>
                          <Badge variant="outline" className="text-[9px] border-glass-border text-muted-foreground">{m.provider?.name}</Badge>
                        </div>
                        <div className="flex gap-3 text-[10px] text-muted-foreground">
                          <span>Costo: {m.costTier}</span>
                          <span>Latencia: {m.latencyTier}</span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Activo</span>
                          <Switch checked={m.enabled} onCheckedChange={v => handleToggleModel(m.id, "enabled", v)} />
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="w-3.5 h-3.5 text-primary" />
                          <span className="text-xs text-muted-foreground">Uso clínico</span>
                          <Switch checked={m.clinicalAllowed} onCheckedChange={v => handleToggleModel(m.id, "clinicalAllowed", v)} />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteModel(m.id, m.modelName)}
                          className="text-destructive hover:bg-destructive/10 rounded-lg gap-1 self-end sm:self-auto h-8 px-2"
                          title="Eliminar modelo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── POLÍTICAS DE RUTEO ───────────────────────── */}
          <TabsContent value="policies" className="space-y-5">
            <Card className="glass-panel border-glass-border bg-background/25">
              <CardHeader><CardTitle className="text-sm font-bold text-primary uppercase flex items-center gap-2"><Plus className="w-4 h-4" />Nueva Política de Ruteo</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleAddPolicy} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="space-y-1 sm:col-span-2"><label className="text-[10px] font-bold text-muted-foreground uppercase">Caso de Uso (ID único)</label><Input value={newPolicy.useCase} onChange={e => setNewPolicy(p => ({ ...p, useCase: e.target.value }))} placeholder="clinical_consultation, pediatric_triage..." required className="rounded-xl border-glass-border bg-elevated/35 font-mono text-xs" /></div>
                  <div className="space-y-1"><label className="text-[10px] font-bold text-muted-foreground uppercase">Nivel de Riesgo</label>
                    <select value={newPolicy.riskLevel} onChange={e => setNewPolicy(p => ({ ...p, riskLevel: e.target.value }))} className="w-full bg-elevated/35 border border-glass-border text-foreground text-sm rounded-xl p-2.5 outline-none">
                      <option value="low">Bajo</option><option value="medium">Medio</option><option value="high">Alto</option>
                    </select>
                  </div>
                  <div className="flex flex-col justify-between">
                    <div className="flex items-center gap-2 pt-5"><Switch checked={newPolicy.requireClinicalApproved} onCheckedChange={v => setNewPolicy(p => ({ ...p, requireClinicalApproved: v }))} /><span className="text-xs text-muted-foreground">Solo modelos con aprobación clínica</span></div>
                    <Button type="submit" disabled={submitting} className="mt-2 w-full bg-primary text-primary-foreground rounded-xl text-xs gap-1">{submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <GitBranch className="w-3.5 h-3.5" />}Crear</Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Nota informativa sobre la política clinical_triage */}
            <Card className="border-amber-500/20 bg-amber-500/5 glass-panel">
              <CardContent className="p-4 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs text-muted-foreground space-y-1">
                  <p className="font-semibold text-amber-500">Importante sobre la política <span className="font-mono">clinical_triage</span></p>
                  <p>Si el chat de IA no funciona, verifica que la política <span className="font-mono">clinical_triage</span> tenga <span className="font-mono">allowedModels</span> vacío (permite cualquier modelo clínico) o que contenga los IDs exactos de los modelos configurados con <strong>Uso clínico</strong> activado.</p>
                  <p>El gateway de IA aplica un fallback inteligente: si ningún modelo del sistema coincide con <span className="font-mono">allowedModels</span>, usará automáticamente cualquier modelo habilitado.</p>
                </div>
              </CardContent>
            </Card>

            {policies.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-glass-border rounded-2xl text-muted-foreground text-sm">No hay políticas de ruteo configuradas.</div>
            ) : (
              <div className="grid gap-3">
                {policies.map(p => (
                  <Card key={p.id} className="glass-panel border-glass-border bg-background/25 hover:border-primary/20 transition-colors">
                    <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-sm font-bold text-foreground">{p.useCase}</span>
                          <Badge variant="outline" className={`text-[9px] font-bold rounded-full border ${riskColor(p.riskLevel)}`}>{p.riskLevel}</Badge>
                          {p.requireClinicalApproved && <Badge variant="outline" className="text-[9px] border-primary/30 text-primary bg-primary/10"><Shield className="w-2.5 h-2.5 mr-0.5" />Clínico</Badge>}
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          Costo: {p.maxCost} · Latencia: {p.maxLatency}
                          {p.allowedModels.length > 0 && ` · Modelos: ${p.allowedModels.join(", ")}`}
                          {p.fallbackChain.length > 0 && ` · Cadena: ${p.fallbackChain.join(" → ")}`}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleDeletePolicy(p.id)} className="text-destructive hover:bg-destructive/10 rounded-lg gap-1 self-end sm:self-center">
                        <Trash2 className="w-3.5 h-3.5" /> Eliminar
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

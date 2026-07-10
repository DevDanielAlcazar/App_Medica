import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-outfit font-bold">Pagos a Médicos</h1>
      <Card className="glass-panel border-glass-border">
        <CardHeader>
          <CardTitle>Contenido en desarrollo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Esta sección será desarrollada en las próximas iteraciones.</p>
        </CardContent>
      </Card>
    </div>
  );
}

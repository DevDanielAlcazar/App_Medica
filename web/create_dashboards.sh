#!/bin/bash
set -e

# Helper to create a page
create_page() {
  local path=$1
  local title=$2
  mkdir -p $(dirname $path)
  cat << TSX > $path
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-outfit font-bold">$title</h1>
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
TSX
}

# Doctor Dashboard
create_page "src/app/(dashboard)/medico/page.tsx" "Dashboard Médico"
create_page "src/app/(dashboard)/medico/verificacion/page.tsx" "Verificación Profesional"
create_page "src/app/(dashboard)/medico/agenda/page.tsx" "Mi Agenda"
create_page "src/app/(dashboard)/medico/citas/page.tsx" "Citas Programadas"
create_page "src/app/(dashboard)/medico/pagos/page.tsx" "Pagos y Datos Bancarios"
create_page "src/app/(dashboard)/medico/perfil/page.tsx" "Perfil Profesional"

# Admin Dashboard
create_page "src/app/(dashboard)/admin/page.tsx" "Dashboard Administrador"
create_page "src/app/(dashboard)/admin/usuarios/page.tsx" "Gestión de Usuarios"
create_page "src/app/(dashboard)/admin/ia/page.tsx" "Configuración de IA"
create_page "src/app/(dashboard)/admin/planes/page.tsx" "Planes de Suscripción"
create_page "src/app/(dashboard)/admin/stripe/page.tsx" "Configuración Stripe"
create_page "src/app/(dashboard)/admin/gmail/page.tsx" "Notificaciones Gmail"
create_page "src/app/(dashboard)/admin/anuncios/page.tsx" "Anuncios Globales"
create_page "src/app/(dashboard)/admin/permisos/page.tsx" "Roles y Permisos"

# Support Dashboard
create_page "src/app/(dashboard)/soporte/page.tsx" "Dashboard de Soporte"
create_page "src/app/(dashboard)/soporte/tickets/page.tsx" "Gestión de Tickets"
create_page "src/app/(dashboard)/soporte/usuarios/page.tsx" "Búsqueda de Usuarios"
create_page "src/app/(dashboard)/soporte/compensaciones/page.tsx" "Compensaciones"

# Accounting Dashboard
create_page "src/app/(dashboard)/contabilidad/page.tsx" "Dashboard Contabilidad"
create_page "src/app/(dashboard)/contabilidad/pagos-medicos/page.tsx" "Pagos a Médicos"
create_page "src/app/(dashboard)/contabilidad/cortes/page.tsx" "Periodos de Corte"
create_page "src/app/(dashboard)/contabilidad/penalizaciones/page.tsx" "Penalizaciones"
create_page "src/app/(dashboard)/contabilidad/reportes/page.tsx" "Reportes Financieros"

echo "Dashboards creados correctamente."

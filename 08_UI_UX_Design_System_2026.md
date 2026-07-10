# UI/UX y Design System 2026 — Angélica Med

> **Última Actualización:** 2026-07-10  
> **Actualizado por:** Antigravity (Claude Opus 4.6)  
> **Propósito:** Documento definitivo de diseño visual, interacción y arquitectura de componentes.

---

## Norte UX

La app no debe sentirse como dashboard médico genérico ni como chatbot frío. Debe sentirse como un **centro de acompañamiento clínico personal**, con tres atributos:

- **Claridad:** Información jerarquizada, legible, sin ruido visual.
- **Confianza:** Estética que transmita autoridad médica y seguridad.
- **Acción segura:** Cada acción sensible requiere confirmación y genera recibo.

---

## Identidad Visual Premium

### Paleta de Color (Dark Mode — Modo Principal)

| Token | Hex | Uso |
| :--- | :--- | :--- |
| `--background` | `#050505` | Fondo principal de la app |
| `--surface` | `#0a0a0a` | Paneles y cards |
| `--elevated` | `#141414` | Elementos elevados (inputs, dropdowns) |
| `--foreground` | `#f8fafc` | Texto principal |
| `--muted` | `#64748b` | Texto secundario, labels |
| `--primary` | `#0ea5e9` | Acciones principales, enlaces, cian bioluminiscente |
| `--primary-dark` | `#0284c7` | Hover de primary |
| `--secondary` | `#8b5cf6` | Acciones secundarias, acentos púrpura eléctrico |
| `--danger` | `#ef4444` | Errores, alertas rojas, Safety Ribbon rojo |
| `--warning` | `#f59e0b` | Precaución, vigilancia, Safety Ribbon amarillo |
| `--success` | `#10b981` | Éxito, curado, Safety Ribbon verde |
| `--clinical` | `#0ea5e9` | Indicadores clínicos |
| `--glass-border` | `rgba(255,255,255,0.08)` | Bordes de paneles glassmorphism |
| `--glass-bg` | `rgba(10,10,10,0.4)` | Fondo de paneles glassmorphism |

### Paleta de Color (Light Mode)

| Token | Hex | Uso |
| :--- | :--- | :--- |
| `--background` | `#fafafa` | Fondo principal |
| `--surface` | `#ffffff` | Paneles y cards |
| `--elevated` | `#f4f4f5` | Inputs, dropdowns |
| `--foreground` | `#09090b` | Texto principal |
| `--muted` | `#71717a` | Texto secundario |
| Resto | Mismos valores | Se mantienen los colores de acento |

### Tipografía

- **Principal:** Inter (Google Fonts) — legibilidad máxima en interfaces médicas.
- **Alternativa:** Outfit — para títulos y headings cuando se busque más personalidad.
- **Monospace:** JetBrains Mono — para códigos de caso, IDs, datos técnicos.

### Glassmorphism (Firma Visual)

Todos los paneles principales (ContextRail, ConversationalCareCanvas, Timeline) deben usar:

```css
.glass-panel {
  background: rgba(10, 10, 10, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border-radius: 1.5rem; /* rounded-3xl */
}
```

### Animaciones (Framer Motion)

- **Entrada de paneles:** `opacity: 0 → 1`, `y: 20 → 0`, duración `0.5s`, ease `easeOut`.
- **Transiciones de página:** `AnimatePresence` con fade + slide.
- **Micro-interacciones:** `whileHover: { scale: 1.02 }`, `whileTap: { scale: 0.98 }`.
- **Skeleton loaders:** Pulsado suave con gradiente animado sobre `--elevated`.
- **Toast notifications:** Slide-in desde arriba con `spring` physics.

---

## Patrones Propios (NO negociables)

### 1. Conversational Care Canvas

Pantalla principal tipo conversación, pero con acciones clínicas integradas:

- Adjuntar evidencia (fotos, PDFs, resultados de laboratorio).
- Crear recordatorio de medicamentos o citas.
- Vincular mensaje a expediente existente.
- Generar reporte de derivación.
- Agendar cita humana virtual.
- Compartir resumen por WhatsApp.
- Confirmar cambios sensibles antes de ejecutar.

**Diferenciador:** Los mensajes de la IA pueden contener componentes interactivos embebidos (botones de acción, cards de recomendación, selectores de caso). NO es un chat plano.

### 2. Context Rail

Panel lateral en desktop y drawer/bottom sheet en móvil con:

- Caso activo (nombre del paciente, ID de caso).
- Estado actual del caso (badge de color).
- Evidencia faltante (con iconos de advertencia).
- Últimas señales clínicas.
- Próxima acción recomendada.
- Nivel de riesgo.
- Acceso rápido a reportes.

### 3. Clinical Timeline River

Timeline vertical por caso con indicadores de color:

- Síntomas reportados.
- Evidencias adjuntadas.
- Medicamentos recomendados/tomados.
- Recomendaciones sintomatológicas emitidas.
- Derivaciones a especialista/urgencias.
- Citas agendadas/completadas.
- Cambios de estado del caso.

### 4. Safety Ribbon

Indicador discreto pero siempre visible en la parte superior:

- **Verde** (`--success`): Seguimiento general, sin alertas.
- **Amarillo** (`--warning`): Vigilancia requerida, datos pendientes.
- **Rojo** (`--danger`): Derivación urgente, red flags activas.

No debe ser alarmista, pero sí visible. Incluye ícono + texto descriptivo corto.

### 5. Action Receipts

Después de cada acción clínica sensible, mostrar recibo inline:

- Qué se hizo (ej: "Nota clínica añadida al expediente").
- Dónde quedó (ej: "Caso #AM-204").
- Qué sigue (ej: "Pendiente: resultados de biometría hemática").
- Cómo revertir si aplica.

---

## Componentes del Design System

### Core (AppShell)
- `AppShell` — Contenedor principal con sidebar, header, área de contenido.
- `ThemeToggle` — Botón de modo claro/oscuro. Respeta preferencia del sistema en primer ingreso. Persiste por usuario.
- `LanguageToggle` — Selector ES/EN.
- `RegionDetectorNotice` — Banner discreto de detección de región.

### Consulta y Chat
- `ConversationComposer` — Input con soporte para texto, imágenes, PDFs.
- `EvidenceDropzone` — Zona de arrastre para adjuntar evidencia clínica.
- `AuditActionReceipt` — Recibo visual de cada acción ejecutada.

### Expediente Clínico
- `MedicalCaseTimeline` — Timeline River completa con filtros.
- `ContextRail` — Panel lateral de contexto del caso activo.
- `SafetyRibbon` — Indicador de nivel de riesgo.
- `RecommendationCard` — Card de Recomendación Sintomatológica descargable.
- `HumanReferralReportButton` — Botón para generar reporte de derivación.

### Citas y Videollamadas
- `AppointmentScheduler` — Selector de fecha/hora con disponibilidad.
- `MeetJoinCard` — Card con link de Google Meet y botón de unirse.

### Pagos y Wallet
- `WalletLedger` — Vista de saldo, movimientos y recarga.

### Administración
- `DoctorVerificationPanel` — Panel de revisión de cédula e INE.
- `AdminAiProviderManager` — CRUD de proveedores IA con auto-descubrimiento.
- `GmailNotificationSettings` — Configuración de correo notificador.

---

## Responsive

| Breakpoint | Ancho | Comportamiento |
| :--- | :--- | :--- |
| Mobile | 360px | Context Rail → Bottom Sheet. Timeline → 1 columna. Acciones frecuentes en barra inferior. |
| Tablet | 768px | Context Rail → Drawer deslizable. Timeline visible. |
| Laptop | 1024px | Layout de 2 columnas (Canvas + Rail). |
| Desktop | 1440px | Layout de 3 columnas (Rail + Canvas + Timeline). |

Reglas adicionales:
- Dashboards administrativos usan listas densas filtrables, no tablas imposibles en móvil.
- Formularios se apilan verticalmente en mobile.

---

## Accesibilidad (WCAG 2.2 AA)

- Foco visible en todos los elementos interactivos.
- Navegación completa por teclado.
- Labels explícitos en todos los inputs.
- Roles ARIA donde aplique.
- No depender solo de color para comunicar información.
- Tamaño táctil mínimo de 44x44px.
- Lectura clara para usuarios no técnicos.
- Contraste validado en ambos temas.

---

## Fuentes y referencias base

- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- WAI WCAG Overview: https://www.w3.org/WAI/standards-guidelines/wcag/
- Material Design 3 Dynamic Color: https://m3.material.io/styles/color/dynamic
- shadcn/ui: https://ui.shadcn.com/docs
- Radix Primitives: https://www.radix-ui.com/primitives
- Base UI: https://base-ui.com/
- Google Meet API: https://developers.google.com/workspace/meet/api/guides/overview
- Cloudflare Tunnel: https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/
- PostgreSQL JSON/JSONB: https://www.postgresql.org/docs/current/datatype-json.html
- FDA Clinical Decision Support: https://www.fda.gov/regulatory-information/search-fda-guidance-documents/clinical-decision-support-software
- WHO guidance on LMMs: https://www.who.int/publications/i/item/9789240084759

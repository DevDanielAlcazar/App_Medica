# 🩺 ANGÉLICA MED — DOCUMENTO MAESTRO DE TAREAS UI/UX

> **Propósito**: Este es el ÚNICO documento de referencia para toda la implementación UI/UX del proyecto Angélica Med. Si una pantalla, componente o comportamiento NO está aquí, NO se construye.
>
> **Última actualización**: 2026-07-10
>
> **Agente asignado**: Jules

---

> [!CAUTION]
> **REGLA ABSOLUTA**: NO sobreescribas, borres ni renombres ningún archivo existente a menos que este documento lo indique EXPLÍCITAMENTE con la etiqueta `[REEMPLAZAR]`. Si dice `[CONSERVAR]` o `[MEJORAR]`, trabaja SOBRE el archivo existente.

---

## 1. INVENTARIO DE ARCHIVOS EXISTENTES

| Archivo | Acción | Nota |
|---|---|---|
| `web/src/app/globals.css` | `[CONSERVAR]` | Tokens CSS y clase `.glass-panel` ya definidos. NO borrar. Puedes AÑADIR tokens si faltan. |
| `web/src/app/layout.tsx` | `[MEJORAR]` | Ya tiene SafetyRibbon y modo oscuro. Necesita: Google Fonts (Inter/Outfit), providers de tema e i18n, meta PWA. |
| `web/src/app/page.tsx` | `[REEMPLAZAR]` | Actualmente muestra layout de 3 columnas con mocks. Debe convertirse en la Landing Page / Hero. |
| `web/src/components/ConversationalCareCanvas.tsx` | `[MEJORAR]` | Existe con datos hardcodeados. Conectar a estado real (ver Fase 2). |
| `web/src/components/ContextRail.tsx` | `[MEJORAR]` | Existe con datos hardcodeados. Conectar a estado real (ver Fase 2). |
| `web/src/components/ClinicalTimelineRiver.tsx` | `[MEJORAR]` | Existe con datos hardcodeados. Conectar a estado real (ver Fase 2). |
| `web/src/components/SafetyRibbon.tsx` | `[MEJORAR]` | Funcional pero básico. Añadir animación Framer Motion y transición suave entre estados. |
| `web/src/lib/utils.ts` | `[CONSERVAR]` | Función `cn()` con clsx + twMerge. NO tocar. |

---

## 2. ARQUITECTURA DE CARPETAS — App Router

```
web/src/
├── app/
│   ├── globals.css                    ← [CONSERVAR] tokens + glass-panel
│   ├── layout.tsx                     ← [MEJORAR] root layout global
│   ├── page.tsx                       ← [REEMPLAZAR] → Landing/Hero
│   ├── manifest.ts                    ← PWA manifest (crear)
│   │
│   ├── (public)/                      ← Grupo: páginas sin autenticación
│   │   ├── layout.tsx                 ← Layout limpio sin sidebar
│   │   ├── login/
│   │   │   └── page.tsx               ← Pantalla de login
│   │   ├── register/
│   │   │   └── page.tsx               ← Registro con selección de rol
│   │   ├── privacy-policy/
│   │   │   └── page.tsx               ← Política de privacidad versionada
│   │   └── terms/
│   │       └── page.tsx               ← Términos y disclaimer médico
│   │
│   ├── (dashboard)/                   ← Grupo: todas las vistas autenticadas
│   │   ├── layout.tsx                 ← AppShell con sidebar, header, SafetyRibbon
│   │   │
│   │   ├── paciente/                  ← Dashboard Paciente
│   │   │   ├── page.tsx               ← Home: bienvenida + frase motivacional + resumen
│   │   │   ├── consulta/
│   │   │   │   └── page.tsx           ← Conversational Care Canvas (pantalla principal)
│   │   │   ├── historial/
│   │   │   │   ├── page.tsx           ← Lista de casos clínicos
│   │   │   │   └── [caseId]/
│   │   │   │       └── page.tsx       ← Detalle de caso + Clinical Timeline River
│   │   │   ├── calendario/
│   │   │   │   └── page.tsx           ← Calendario de citas y medicamentos
│   │   │   ├── wallet/
│   │   │   │   └── page.tsx           ← Wallet, créditos, historial de pagos
│   │   │   ├── nutricion/
│   │   │   │   └── page.tsx           ← Plan nutricional personalizado
│   │   │   ├── soporte/
│   │   │   │   └── page.tsx           ← Chat de soporte del paciente
│   │   │   └── perfil/
│   │   │       └── page.tsx           ← Perfil, preferencias, idioma, tema
│   │   │
│   │   ├── medico/                    ← Dashboard Médico
│   │   │   ├── page.tsx               ← Home: agenda del día + métricas
│   │   │   ├── verificacion/
│   │   │   │   └── page.tsx           ← Subida de cédula + INE
│   │   │   ├── agenda/
│   │   │   │   └── page.tsx           ← Gestión de horarios disponibles
│   │   │   ├── citas/
│   │   │   │   ├── page.tsx           ← Lista de citas
│   │   │   │   └── [appointmentId]/
│   │   │   │       └── page.tsx       ← Detalle de cita + Meet
│   │   │   ├── pagos/
│   │   │   │   └── page.tsx           ← Historial de pagos + datos bancarios
│   │   │   └── perfil/
│   │   │       └── page.tsx           ← Perfil profesional
│   │   │
│   │   ├── admin/                     ← Dashboard Admin
│   │   │   ├── page.tsx               ← Home: métricas globales + gráficas
│   │   │   ├── usuarios/
│   │   │   │   ├── page.tsx           ← Lista de usuarios con filtros
│   │   │   │   └── [userId]/
│   │   │   │       └── page.tsx       ← Detalle de usuario
│   │   │   ├── ia/
│   │   │   │   └── page.tsx           ← Configuración de proveedor AI
│   │   │   ├── planes/
│   │   │   │   └── page.tsx           ← Gestión de planes y suscripciones
│   │   │   ├── stripe/
│   │   │   │   └── page.tsx           ← Config Stripe + webhooks
│   │   │   ├── gmail/
│   │   │   │   └── page.tsx           ← Config notificaciones Gmail
│   │   │   ├── anuncios/
│   │   │   │   └── page.tsx           ← Anuncios y notificaciones globales
│   │   │   └── permisos/
│   │   │       └── page.tsx           ← Roles y permisos
│   │   │
│   │   ├── soporte/                   ← Dashboard Soporte
│   │   │   ├── page.tsx               ← Home: tickets activos + métricas
│   │   │   ├── tickets/
│   │   │   │   ├── page.tsx           ← Lista de tickets
│   │   │   │   └── [ticketId]/
│   │   │   │       └── page.tsx       ← Detalle del ticket
│   │   │   ├── usuarios/
│   │   │   │   └── page.tsx           ← Buscar/ver usuarios (ban, unblock)
│   │   │   └── compensaciones/
│   │   │       └── page.tsx           ← Créditos y reembolsos
│   │   │
│   │   └── contabilidad/             ← Dashboard Contabilidad
│   │       ├── page.tsx               ← Home: resumen financiero
│   │       ├── pagos-medicos/
│   │       │   ├── page.tsx           ← Lista de pagos a médicos
│   │       │   └── [paymentId]/
│   │       │       └── page.tsx       ← Detalle de pago
│   │       ├── cortes/
│   │       │   └── page.tsx           ← Cortes y periodos de pago
│   │       ├── penalizaciones/
│   │       │   └── page.tsx           ← Tracking de penalizaciones
│   │       └── reportes/
│   │           └── page.tsx           ← Descarga de reportes
│   │
│   └── api/                           ← API Routes (backend, no UI)
│       └── ...                        ← No es responsabilidad de este task
│
├── components/
│   ├── ui/                            ← shadcn/ui generados (Button, Input, Dialog, etc.)
│   ├── layout/
│   │   ├── AppShell.tsx               ← Shell principal con sidebar + header
│   │   ├── Sidebar.tsx                ← Navegación lateral por rol
│   │   ├── Header.tsx                 ← Header con user menu, notificaciones
│   │   ├── MobileBottomBar.tsx        ← Barra inferior en móvil
│   │   └── BreadcrumbNav.tsx          ← Breadcrumbs contextuales
│   ├── shared/
│   │   ├── ThemeToggle.tsx            ← Toggle dark/light con persistencia
│   │   ├── LanguageToggle.tsx         ← Toggle ES/EN con persistencia
│   │   ├── RegionDetectorNotice.tsx   ← Aviso de detección de región
│   │   ├── SafetyRibbon.tsx           ← [MEJORAR] ya existe
│   │   ├── AuditActionReceipt.tsx     ← Toast/modal post-acción
│   │   └── MotivationalGreeting.tsx   ← Frase motivacional dinámica
│   ├── patient/
│   │   ├── ConversationalCareCanvas.tsx ← [MEJORAR] ya existe
│   │   ├── ConversationComposer.tsx   ← Input con acciones clínicas
│   │   ├── EvidenceDropzone.tsx       ← Drag & drop de archivos médicos
│   │   ├── ContextRail.tsx            ← [MEJORAR] ya existe
│   │   ├── ClinicalTimelineRiver.tsx  ← [MEJORAR] ya existe
│   │   ├── MedicalCaseTimeline.tsx    ← Timeline dentro del detalle de caso
│   │   ├── RecommendationCard.tsx     ← Tarjeta de recomendación sintomática
│   │   ├── HumanReferralReportButton.tsx ← Botón para generar reporte de derivación
│   │   ├── AppointmentScheduler.tsx   ← Selector de cita con horarios
│   │   ├── MeetJoinCard.tsx           ← Card para unirse a Google Meet
│   │   ├── WalletLedger.tsx           ← Historial de movimientos del wallet
│   │   ├── NutritionPlanCard.tsx      ← Tarjeta de plan nutricional
│   │   └── CaseStatusBadge.tsx        ← Badge con estado del caso
│   ├── doctor/
│   │   ├── DoctorVerificationPanel.tsx ← Panel de subida de cédula + INE
│   │   ├── ScheduleManager.tsx        ← Gestión de horarios
│   │   ├── AppointmentList.tsx        ← Lista de citas del doctor
│   │   ├── BankDataForm.tsx           ← Formulario datos bancarios (CLABE doble validación)
│   │   └── DoctorPaymentHistory.tsx   ← Historial de cobros
│   ├── admin/
│   │   ├── AdminAiProviderManager.tsx ← Config de proveedor AI
│   │   ├── GmailNotificationSettings.tsx ← Config Gmail
│   │   ├── UserManagementTable.tsx    ← Tabla de usuarios con acciones
│   │   ├── PlanEditor.tsx             ← Editor de planes/suscripciones
│   │   ├── StripeConfigPanel.tsx      ← Panel de Stripe
│   │   └── AnnouncementEditor.tsx     ← Editor de anuncios
│   ├── support/
│   │   ├── TicketList.tsx             ← Lista de tickets
│   │   ├── TicketDetail.tsx           ← Detalle de ticket con chat
│   │   └── CompensationForm.tsx       ← Formulario de compensación
│   └── accounting/
│       ├── PaymentTable.tsx           ← Tabla de pagos a médicos
│       ├── CutoffPeriodCard.tsx       ← Card de periodo de corte
│       ├── PenaltyTracker.tsx         ← Tracker de penalizaciones
│       └── ReportDownloader.tsx       ← Descarga de reportes
│
├── lib/
│   ├── utils.ts                       ← [CONSERVAR] cn()
│   ├── constants.ts                   ← Frases motivacionales + constantes UI
│   ├── i18n/
│   │   ├── config.ts                  ← Configuración de i18n
│   │   ├── es.json                    ← Traducciones español
│   │   └── en.json                    ← Traducciones inglés
│   └── hooks/
│       ├── useTheme.ts                ← Hook para tema dark/light
│       ├── useLanguage.ts             ← Hook para idioma
│       ├── useMotivationalPhrase.ts   ← Hook para frase diaria
│       └── useSafetyStatus.ts         ← Hook para estado de Safety Ribbon
│
├── stores/                            ← Estado global (Zustand)
│   ├── chatStore.ts                   ← Estado de la conversación activa
│   ├── caseStore.ts                   ← Estado del caso clínico activo
│   ├── uiStore.ts                     ← Estado UI (sidebar, modals, drawers)
│   └── userStore.ts                   ← Estado del usuario autenticado + rol
│
├── types/
│   ├── chat.ts                        ← Tipos: Message, Conversation, Attachment
│   ├── case.ts                        ← Tipos: ClinicalCase, CaseStatus, TimelineEvent
│   ├── user.ts                        ← Tipos: User, Role, DoctorProfile
│   ├── wallet.ts                      ← Tipos: WalletBalance, Transaction
│   └── appointment.ts                 ← Tipos: Appointment, Schedule, MeetLink
│
└── providers/
    ├── ThemeProvider.tsx               ← Provider de tema (next-themes)
    ├── LanguageProvider.tsx            ← Provider de idioma (context)
    └── QueryProvider.tsx              ← Provider de React Query / TanStack Query
```

---

## 3. FASE 0 — CIMIENTOS TÉCNICOS

### 0.1 Inicializar shadcn/ui
- Ejecutar `npx shadcn@latest init` dentro de `web/`.
- Configurar para Tailwind CSS v4, TypeScript, alias `@/components/ui`.
- Instalar componentes base: `button`, `input`, `dialog`, `dropdown-menu`, `sheet`, `tooltip`, `tabs`, `badge`, `card`, `separator`, `avatar`, `scroll-area`, `toast`, `popover`, `calendar`, `select`, `switch`, `textarea`, `command`, `table`.
- **Satisface**: Fundamento técnico para todos los REQ.

### 0.2 Google Fonts
- En `web/src/app/layout.tsx`, importar `Inter` y `Outfit` desde `next/font/google`.
- `Inter` como fuente body (variable `--font-inter`). `Outfit` como fuente de headings (variable `--font-outfit`).
- Aplicar en `<body>` con `className={cn(inter.variable, outfit.variable, "antialiased font-sans")}`.
- Actualizar `globals.css` para mapear `font-sans` a `var(--font-inter)`.
- **Satisface**: Requisito visual del Design System.

### 0.3 Instalar dependencias
```bash
npm install framer-motion lucide-react zustand @tanstack/react-query next-themes
npm install -D @types/node
```

### 0.4 ThemeProvider + ThemeToggle
- **Archivo**: `web/src/providers/ThemeProvider.tsx` — Wrapper de `next-themes` con `attribute="class"`, `defaultTheme="dark"`.
- **Archivo**: `web/src/components/shared/ThemeToggle.tsx` — Botón con iconos `Sun`/`Moon` de Lucide. Animación de rotación con Framer Motion. Persistencia automática vía `next-themes`.
- Integrar `ThemeProvider` en `layout.tsx` envolviendo `{children}`.
- **Satisface**: REQ-004, US-014.

### 0.5 LanguageProvider + LanguageToggle
- **Archivo**: `web/src/providers/LanguageProvider.tsx` — React Context con `locale` (`es` | `en`), persistido en `localStorage`.
- **Archivo**: `web/src/lib/i18n/config.ts` — Función `t(key)` que lee del JSON correspondiente.
- **Archivos**: `web/src/lib/i18n/es.json` y `en.json` — Todas las cadenas UI traducidas.
- **Archivo**: `web/src/components/shared/LanguageToggle.tsx` — Botón toggle `ES`/`EN` con banderita o texto.
- **Satisface**: REQ-005, US-014.

### 0.6 Stores de Zustand
- **`web/src/stores/userStore.ts`**: `{ user, role, isAuthenticated, setUser, logout }`. El `role` determina qué dashboard se muestra.
- **`web/src/stores/chatStore.ts`**: `{ messages, isStreaming, activeConversationId, addMessage, setStreaming, clearMessages }`.
- **`web/src/stores/caseStore.ts`**: `{ activeCase, cases, safetyStatus, setActiveCase, updateCaseStatus }`.
- **`web/src/stores/uiStore.ts`**: `{ sidebarOpen, contextRailOpen, activeModal, toggleSidebar, toggleContextRail }`.
- **Satisface**: Fundamento para estado real en todos los componentes.

### 0.7 Types
- Crear todos los archivos en `web/src/types/` según la estructura de carpetas. Cada tipo debe ser exportado con `export type` o `export interface`.
- `CaseStatus` debe ser un union type: `'en_analisis' | 'enfermo' | 'derivado' | 'en_tratamiento' | 'curado' | 'archivado'`.
- **Satisface**: REQ-014.

### 0.8 Middleware de enrutamiento por rol
- **Archivo**: `web/src/middleware.ts` — Next.js Middleware que:
  1. Lee la sesión/token del usuario.
  2. Si NO está autenticado y accede a `/(dashboard)/*`, redirige a `/login`.
  3. Si está autenticado, redirige a `/(dashboard)/<su-rol>/` según el `role` del token.
  4. Si un `paciente` intenta acceder a `/admin/*`, redirige a su dashboard.
  5. `superadmin` tiene acceso a TODO. `superadmin` NO puede ser bloqueado por `admin` (REQ-039).
- **Satisface**: REQ-006, REQ-039.

---

## 4. FASE 1 — LANDING PAGE Y AUTENTICACIÓN

### 4.1 Landing Page / Hero
- **Ruta**: `/` (archivo: `web/src/app/page.tsx` `[REEMPLAZAR]`)
- **Componente**: `LandingHero`
- **Qué muestra**:
  - Header fijo con logo "Angélica Med", navegación (`Características`, `Planes`, `Contacto`), botones `Iniciar Sesión` y `Registrarse`.
  - Sección Hero: título grande con gradiente cyan→purple, subtítulo describiendo el servicio, CTA principal "Comenzar Ahora", ilustración/mockup animada con Framer Motion.
  - Sección Features: los 5 patrones propietarios como cards con glassmorphism.
  - Sección Planes: 3 cards de suscripción (Free, Pro, Premium) con precios y features.
  - Footer: links a política de privacidad, términos, contacto.
- **Interacción**: Scroll suave entre secciones. Parallax sutil en orbs de fondo. Entry animations con Framer Motion `whileInView`.
- **Estado**: Ninguno (página estática).
- **Satisface**: REQ-001 (PWA responsive).

### 4.2 Pantalla de Login
- **Ruta**: `/login`
- **Componente**: `LoginPage`
- **Qué muestra**:
  - Card centrada con glassmorphism sobre fondo con orbs cyan/purple.
  - Logo Angélica Med arriba.
  - Campos: email, contraseña.
  - Botón "Iniciar Sesión" con loading state.
  - Link "¿Olvidaste tu contraseña?" y "Crear cuenta".
  - **OBLIGATORIO**: Disclaimer médico visible debajo del formulario: _"Angélica Med es un asistente informativo. No sustituye el diagnóstico ni tratamiento de un profesional de la salud."_
  - Link a Política de Privacidad (abre `/privacy-policy`).
  - ThemeToggle y LanguageToggle en esquina superior.
- **Interacción**: Validación en tiempo real. Feedback de error con toast. Redirección post-login al dashboard correspondiente según rol.
- **Estado**: Formulario local + `userStore.setUser()` post-login exitoso.
- **Satisface**: REQ-006.

### 4.3 Pantalla de Registro
- **Ruta**: `/register`
- **Componente**: `RegisterPage`
- **Qué muestra**:
  - Card centrada similar al login.
  - Paso 1: Nombre, email, contraseña, confirmar contraseña.
  - Paso 2: Selección de rol con cards visuales: `Paciente` (ícono Heart), `Médico` (ícono Stethoscope). Los roles `Soporte`, `Contabilidad`, `Admin` NO son seleccionables — se asignan internamente.
  - Paso 3 (solo Médico): Campos de cédula profesional y subida de documento de identidad.
  - Checkbox de aceptación de términos y política de privacidad (obligatorio).
  - Disclaimer médico visible.
- **Interacción**: Wizard de 2-3 pasos con animación de transición Framer Motion. Validación por paso.
- **Estado**: Formulario local multi-step.
- **Satisface**: REQ-006, REQ-007, REQ-017, US-006.

### 4.4 Política de Privacidad
- **Ruta**: `/privacy-policy`
- **Componente**: `PrivacyPolicyPage`
- **Qué muestra**: Documento legal renderizado desde markdown o contenido estático. Número de versión visible. Botón de descarga en PDF. Fecha de última actualización.
- **Satisface**: REQ-007.

### 4.5 Términos y Disclaimer
- **Ruta**: `/terms`
- **Componente**: `TermsPage`
- **Qué muestra**: Términos de servicio + disclaimer médico completo.
- **Satisface**: REQ-007.

---

## 5. FASE 2 — DASHBOARD DEL PACIENTE

### 5.0 AppShell (Layout del Dashboard)
- **Archivo**: `web/src/app/(dashboard)/layout.tsx` + `web/src/components/layout/AppShell.tsx`
- **Qué muestra**:
  - **Desktop (≥1024px)**: Sidebar colapsable a la izquierda (250px expandida, 64px colapsada) + header superior + contenido central.
  - **Tablet (768-1023px)**: Sidebar oculta, activable con hamburger. Header siempre visible.
  - **Mobile (<768px)**: Sin sidebar. Header compacto + `MobileBottomBar` fija abajo con 4-5 acciones frecuentes según rol.
  - SafetyRibbon integrado entre header y contenido (solo para paciente).
  - Header contiene: breadcrumbs, barra de búsqueda, ThemeToggle, LanguageToggle, notificaciones (bell icon con badge), avatar con dropdown (perfil, cerrar sesión).
- **Sidebar items por rol**:
  - **Paciente**: Inicio, Consulta, Historial, Calendario, Wallet, Nutrición, Soporte, Perfil.
  - **Médico**: Inicio, Verificación, Agenda, Citas, Pagos, Perfil.
  - **Admin**: Inicio, Usuarios, IA, Planes, Stripe, Gmail, Anuncios, Permisos.
  - **Soporte**: Inicio, Tickets, Usuarios, Compensaciones.
  - **Contabilidad**: Inicio, Pagos Médicos, Cortes, Penalizaciones, Reportes.
- **Estado**: `uiStore` para sidebar open/close. `userStore.role` para menú dinámico.
- **Satisface**: REQ-001, REQ-003, REQ-004, US-014.

### 5.1 Home del Paciente
- **Ruta**: `/(dashboard)/paciente`
- **Componente**: `PatientHomePage`
- **Qué muestra**:
  - **Saludo motivacional dinámico**: "Buenos días, {nombre}. {frase_motivacional}". La frase viene de un banco de 365-1000 frases almacenadas en `web/src/lib/constants.ts` como array `MOTIVATIONAL_PHRASES: string[]`. El hook `useMotivationalPhrase()` selecciona una frase basada en el día del año (`dayOfYear % phrases.length`), garantizando una frase diferente cada día. Las frases deben ser empáticas, positivas, y relacionadas con salud y bienestar. **NUNCA** incluir frases tipo "Soy solo una IA" o similares. Ejemplo: _"Tu salud es tu mayor tesoro. Hoy es un buen día para cuidarte."_
  - **Resumen rápido**: Cards con glassmorphism mostrando: casos activos (count + estado más reciente), próxima cita (fecha + doctor), saldo del wallet, acceso rápido a "Nueva Consulta".
  - **Actividad reciente**: Lista de las últimas 3-5 acciones (mensaje enviado, evidencia subida, cita agendada) con timestamps.
  - **CTA principal**: Botón grande "Iniciar Consulta" que lleva a `/paciente/consulta`.
- **Interacción**: Cards clickeables. Animaciones `staggerChildren` de Framer Motion al cargar.
- **Estado**: Datos del usuario desde `userStore`. Resumen desde API (React Query).
- **Satisface**: REQ-003, Nota 24 (frase motivacional).

### 5.2 Consulta — Conversational Care Canvas
- **Ruta**: `/(dashboard)/paciente/consulta`
- **Componente**: `ConsultationPage` que orquesta `ConversationalCareCanvas`, `ContextRail`, `ConversationComposer`, `EvidenceDropzone`
- **Layout**:
  - **Desktop**: 3 columnas — ContextRail (300px izq) | ConversationalCareCanvas (centro) | ClinicalTimelineRiver (350px der, visible solo si hay caso activo).
  - **Tablet**: 2 columnas — Canvas centro | ContextRail como Sheet desde la derecha.
  - **Mobile**: Canvas fullscreen | ContextRail como BottomSheet (Radix Sheet) | Timeline accesible desde tab.

#### ConversationalCareCanvas `[MEJORAR]`
- **Qué muestra**: Lista de mensajes estilo chat premium (NO WhatsApp genérico). Cada mensaje tiene:
  - Avatar del remitente (usuario o "Angélica").
  - Texto con markdown renderizado.
  - Timestamp discreto.
  - Indicador de estado (enviado, procesando, respondido).
  - Si hay adjuntos: preview inline (imagen thumbnail, PDF con nombre e ícono).
  - Si hay acción clínica: `AuditActionReceipt` integrado en el flujo del chat (card especial con fondo `elevated`, ícono de check, descripción de la acción, botón "Deshacer" si aplica).
- **Comportamiento IA**: La IA (Angélica) responde con rigor clínico. **NUNCA** muestra textos tipo "Soy una IA y no puedo diagnosticar". En su lugar, usa guardrails internos y responde con confianza dentro de sus límites. Si necesita derivar, lo hace profesionalmente: _"Basándome en tus síntomas, te recomiendo consultar con un especialista. He preparado un reporte de derivación para ti."_
- **Estado**: `chatStore` para mensajes. `caseStore` para caso activo. Streaming via `isStreaming`.
- **Satisface**: REQ-003, REQ-008, Nota 02, Nota 07.

#### ConversationComposer
- **Componente**: `ConversationComposer.tsx`
- **Qué muestra**: Barra de input inferior con:
  - Textarea autoexpandible (1-4 líneas).
  - Botón enviar (ícono `Send`).
  - Botón de acciones clínicas (ícono `Plus` o `Paperclip`) que abre un popover con:
    - 📎 Adjuntar evidencia (abre `EvidenceDropzone`)
    - ⏰ Crear recordatorio
    - 📋 Vincular expediente
    - 📄 Generar reporte
    - 📅 Agendar cita
    - 📤 Compartir resumen
    - ⚠️ Confirmar cambio sensible
  - Botón de voz (futuro, deshabilitado con tooltip "Próximamente").
- **Interacción**: Enter para enviar. Shift+Enter para nueva línea. Drag & drop de archivos en toda el área del canvas activa el `EvidenceDropzone`.
- **Satisface**: REQ-003 (acciones clínicas integradas), US-001.

#### EvidenceDropzone
- **Componente**: `EvidenceDropzone.tsx`
- **Qué muestra**: Zona de dropzone con borde dashed, ícono de upload, texto "Arrastra tu evidencia aquí o haz clic para seleccionar". Acepta: imágenes (jpg, png), PDFs, documentos. Preview del archivo seleccionado antes de enviar. Detección inteligente de contexto: si es imagen, muestra preview; si es PDF, muestra nombre + ícono + tamaño.
- **Interacción**: Drag & drop + click para file picker. Barra de progreso de upload. Feedback de éxito/error.
- **Estado**: Local + upload a API.
- **Satisface**: US-001, Nota 10.

#### ContextRail `[MEJORAR]`
- **Componente**: `ContextRail.tsx`
- **Qué muestra** (conectado a estado REAL, no hardcodeado):
  - **Caso activo**: nombre del caso, estado (badge con `CaseStatusBadge`), fecha de inicio.
  - **Safety Ribbon mini**: indicador verde/amarillo/rojo inline.
  - **Evidencia faltante**: checklist de lo que la IA necesita para avanzar (ej: "Subir resultados de laboratorio").
  - **Últimas señales**: resumen de los últimos hallazgos de la IA.
  - **Siguiente acción recomendada**: texto + botón de acción.
  - **Riesgos identificados**: lista con severity badges.
  - **Reportes disponibles**: links a reportes generados.
- **Estado**: `caseStore.activeCase` para todo el contenido. Se actualiza en tiempo real cuando la IA genera nueva info.
- **Satisface**: REQ-003 (patrón Context Rail), REQ-013.

#### ClinicalTimelineRiver `[MEJORAR]`
- Se muestra en el detalle del caso Y como columna derecha en consulta si hay caso activo.
- **Qué muestra** (conectado a estado REAL):
  - Timeline vertical con nodos de diferentes tipos: síntoma, evidencia, medicamento, recomendación, derivación, cita, cambio de estado.
  - Cada nodo: ícono por tipo, timestamp, título, descripción breve, color por severidad.
  - Filtros por tipo de evento.
  - Scroll vertical con lazy loading.
- **Estado**: `caseStore.activeCase.timeline` — array de `TimelineEvent`.
- **Satisface**: REQ-003 (patrón Clinical Timeline River), Nota 09.

### 5.3 Historial Clínico
- **Ruta**: `/(dashboard)/paciente/historial`
- **Componente**: `ClinicalHistoryPage`
- **Qué muestra**: Lista de todos los casos clínicos del paciente. Cada caso muestra: nombre/título, estado (badge con colores), fecha de creación, última actualización, conteo de eventos. Filtros por estado. Búsqueda por texto. Botón "Nuevo Caso".
- **Interacción**: Click en caso → navega a `/(dashboard)/paciente/historial/[caseId]`. Botón borrar con **diálogo de confirmación con warning** explícito: _"Esta acción eliminará permanentemente este expediente y toda su información asociada. ¿Estás seguro?"_.
- **Estado**: Lista de casos desde API con React Query.
- **Satisface**: REQ-013, REQ-014, REQ-015, US-005, Nota 09.

### 5.4 Detalle de Caso Clínico
- **Ruta**: `/(dashboard)/paciente/historial/[caseId]`
- **Componente**: `CaseDetailPage`
- **Qué muestra**:
  - Header con nombre del caso, `CaseStatusBadge`, `SafetyRibbon` inline.
  - Tabs: `Timeline` | `Documentos` | `Recomendaciones` | `Citas`.
  - Tab Timeline: `ClinicalTimelineRiver` full-width.
  - Tab Documentos: grid de documentos subidos con preview.
  - Tab Recomendaciones: lista de `RecommendationCard` con disclaimer: _"Recomendación orientativa. Consulte a su médico."_
  - Tab Citas: citas relacionadas con este caso.
  - Botón "Generar Reporte de Derivación" → descarga PDF.
  - Botón "Compartir a WhatsApp" → genera link o abre WhatsApp con resumen.
- **Estado**: Caso desde API por `caseId`.
- **Satisface**: REQ-010, REQ-013, REQ-014, REQ-034, US-003, US-004.

### 5.5 Calendario
- **Ruta**: `/(dashboard)/paciente/calendario`
- **Componente**: `PatientCalendarPage`
- **Qué muestra**: Calendario mensual/semanal con:
  - Citas médicas (color primary).
  - Recordatorios de medicamentos (color clinical).
  - Eventos personalizados.
  - Vista de lista para la semana actual.
- **Interacción**: Click en día → ver detalle de eventos. Botón "Agendar Cita" → abre `AppointmentScheduler` como Dialog.
- **Estado**: Eventos desde API con React Query.
- **Satisface**: REQ-032.

### 5.6 Wallet
- **Ruta**: `/(dashboard)/paciente/wallet`
- **Componente**: `PatientWalletPage`
- **Qué muestra**:
  - Saldo actual en créditos (card grande con glassmorphism).
  - Botón "Comprar Créditos" → abre Stripe Checkout.
  - Historial de transacciones (`WalletLedger`): fecha, concepto, monto, estado.
  - Método de pago guardado (si existe).
- **Interacción**: Compra de créditos vía Stripe. Filtros de historial por fecha.
- **Estado**: Balance y transacciones desde API.
- **Satisface**: REQ-021, REQ-022, Nota 02.

### 5.7 Nutrición
- **Ruta**: `/(dashboard)/paciente/nutricion`
- **Componente**: `NutritionPage`
- **Qué muestra**:
  - Plan nutricional personalizado según condiciones del paciente (`NutritionPlanCard`).
  - Secciones: Desayuno, Comida, Cena, Colaciones.
  - Cada sección: lista de alimentos recomendados con cantidades.
  - Disclaimer: _"Plan orientativo. Consulte a su nutriólogo."_
  - Notas de la IA sobre alimentos a evitar según condiciones activas.
- **Estado**: Plan desde API (generado por IA basado en casos activos).
- **Satisface**: REQ-043, Nota 17.

### 5.8 Soporte del Paciente
- **Ruta**: `/(dashboard)/paciente/soporte`
- **Componente**: `PatientSupportPage`
- **Qué muestra**:
  - Lista de tickets: activos y resueltos (tabs).
  - Botón "Nuevo Ticket" → formulario con asunto, categoría, descripción.
  - Chat por ticket con historial de mensajes.
  - Estado del ticket: `Activo` | `En revisión` | `Resuelto`.
- **Interacción**: Enviar mensajes en el chat de soporte. Cerrar ticket resuelto.
- **Estado**: Tickets desde API.
- **Satisface**: REQ-036.

### 5.9 Perfil del Paciente
- **Ruta**: `/(dashboard)/paciente/perfil`
- **Componente**: `PatientProfilePage`
- **Qué muestra**:
  - Avatar, nombre, email (no editable), fecha de registro.
  - Sección Preferencias: `ThemeToggle`, `LanguageToggle`.
  - Sección Datos Personales: nombre, teléfono, fecha de nacimiento, género.
  - Sección Seguridad: cambiar contraseña.
  - Botón "Descargar Mis Datos" (GDPR/compliance).
  - Botón "Eliminar Cuenta" con confirmación doble.
- **Estado**: Datos del usuario desde API. Actualización via mutation.
- **Satisface**: US-014, REQ-004, REQ-005.

---

## 6. FASE 3 — DASHBOARD DEL MÉDICO

### 6.1 Home del Médico
- **Ruta**: `/(dashboard)/medico`
- **Componente**: `DoctorHomePage`
- **Qué muestra**:
  - Agenda del día: lista de citas con hora, paciente, estado.
  - Métricas rápidas: citas completadas esta semana, citas pendientes, ingresos del mes, rating promedio.
  - Estado de verificación: badge de `Verificado`, `En revisión`, o `Pendiente`.
  - Notificaciones: nuevas citas, cancelaciones.
- **Satisface**: Nota 14.

### 6.2 Verificación del Médico
- **Ruta**: `/(dashboard)/medico/verificacion`
- **Componente**: `DoctorVerificationPage` con `DoctorVerificationPanel`
- **Qué muestra**:
  - Estado actual de verificación con stepper visual: 1) Datos enviados → 2) En revisión → 3) Verificado.
  - Formulario de cédula profesional (texto + upload de foto de cédula).
  - Upload de INE/documento de identidad (frente y reverso). Indicador de que se almacena cifrado.
  - Si ya está enviado: muestra los documentos subidos (miniatura) y estado "En revisión".
  - Si fue rechazado: muestra motivo y permite re-envío.
- **Interacción**: Upload con preview. Submit deshabilitado hasta tener todos los campos. Feedback con `AuditActionReceipt`.
- **Estado**: Estado de verificación desde API.
- **Satisface**: REQ-017, REQ-018, REQ-019, US-006.

### 6.3 Agenda del Médico
- **Ruta**: `/(dashboard)/medico/agenda`
- **Componente**: `DoctorSchedulePage` con `ScheduleManager`
- **Qué muestra**:
  - Calendario semanal con bloques de disponibilidad.
  - Configuración de horarios: días de la semana, rango de horas, duración de cita (30/45/60 min).
  - Citas ya agendadas sobre el calendario (read-only, no se pueden mover).
  - Botón para marcar días como "No disponible" (vacaciones, etc.).
- **Interacción**: Arrastrar para crear bloques de horario. Click para editar/eliminar. Toggle de día completo.
- **Estado**: Schedule desde API con React Query. Mutations para crear/editar.
- **Satisface**: REQ-040, Nota 14.

### 6.4 Citas del Médico
- **Ruta**: `/(dashboard)/medico/citas`
- **Componente**: `DoctorAppointmentsPage` con `AppointmentList`
- **Qué muestra**: Tabla/lista de citas con: fecha, hora, paciente, estado (Pendiente, Confirmada, En curso, Completada, Cancelada), monto, acciones.
- **Ruta detalle**: `/(dashboard)/medico/citas/[appointmentId]`
- **Componente detalle**: `DoctorAppointmentDetailPage` con `MeetJoinCard`
  - Información del paciente (nombre, caso asociado).
  - Link de Google Meet (`MeetJoinCard`): botón grande "Unirse a Videollamada" que abre Meet en nueva pestaña. Muestra estado: "La cita comienza en X minutos" o "En curso".
  - Notas del médico: textarea para escribir notas post-consulta.
  - Botón "Marcar como Completada".
- **Satisface**: REQ-020, REQ-040, US-008, Nota 12.

### 6.5 Pagos del Médico
- **Ruta**: `/(dashboard)/medico/pagos`
- **Componente**: `DoctorPaymentsPage` con `BankDataForm`, `DoctorPaymentHistory`
- **Qué muestra**:
  - **Datos bancarios**: formulario con banco, titular, CLABE (18 dígitos). **Doble validación de CLABE**: el usuario debe ingresar la CLABE dos veces y ambas deben coincidir. Feedback visual cuando coinciden (check verde) o no (error rojo).
  - **Historial de pagos**: tabla con periodo, monto bruto, penalizaciones, monto neto, estado (Pendiente, Pagado, En revisión), fecha de pago.
  - **Recurrencia**: indicador de próximo pago programado.
- **Estado**: Datos bancarios y pagos desde API.
- **Satisface**: REQ-040, Nota 14 (CLABE doble validación, recurrencia).

---

## 7. FASE 4 — DASHBOARD DEL ADMIN

### 7.1 Home del Admin
- **Ruta**: `/(dashboard)/admin`
- **Componente**: `AdminHomePage`
- **Qué muestra**:
  - Métricas en cards: total usuarios, usuarios activos, médicos verificados, ingresos del mes, citas del mes, tickets abiertos.
  - Gráficas en tiempo real: usuarios registrados por semana, ingresos por semana (gráficas de línea/barras con `recharts` o similar).
  - Alertas del sistema: API keys próximas a vencer, errores de webhook, etc.
- **Satisface**: REQ-038, Nota 13.

### 7.2 Gestión de Usuarios
- **Ruta**: `/(dashboard)/admin/usuarios`
- **Componente**: `AdminUsersPage` con `UserManagementTable`
- **Qué muestra**: Tabla paginada con: nombre, email, rol, estado (activo/suspendido/baneado), fecha de registro, plan. Filtros por rol, estado, plan. Búsqueda por nombre/email.
- **Acciones por fila**: Ver detalle, Suspender, Banear, Desbloquear, Cambiar rol, Asignar plan manualmente, Asignar saldo.
- **Ruta detalle**: `/(dashboard)/admin/usuarios/[userId]` — Perfil completo del usuario, historial de acciones, logs de auditoría.
- **REGLA**: Si el usuario es `superadmin`, el botón Banear/Suspender está deshabilitado con tooltip: _"No se puede modificar a un Superadmin."_
- **Satisface**: REQ-038, REQ-039, REQ-045, Nota 13.

### 7.3 Configuración de IA
- **Ruta**: `/(dashboard)/admin/ia`
- **Componente**: `AdminAiPage` con `AdminAiProviderManager`
- **Qué muestra**:
  - Selector de proveedor: OpenAI, Claude (Anthropic), Genérico (compatible OpenAI API).
  - Input de API key (tipo password, con toggle de visibilidad).
  - Botón "Detectar Modelos" → al ingresar API key, hace auto-discover de modelos disponibles y los muestra como lista seleccionable.
  - Modelo seleccionado activo con badge "En uso".
  - Configuración de parámetros: temperatura, max tokens, system prompt base.
  - Botón "Probar Conexión" con feedback de éxito/error.
- **Interacción**: Guardar configuración con `AuditActionReceipt`: _"Proveedor de IA actualizado a Claude (claude-sonnet-4-20250514). Guardado correctamente."_
- **Satisface**: REQ-024, REQ-025, US-009.

### 7.4 Gestión de Planes
- **Ruta**: `/(dashboard)/admin/planes`
- **Componente**: `AdminPlansPage` con `PlanEditor`
- **Qué muestra**: Lista de planes de suscripción. Cada plan: nombre, precio, Stripe `price_id`, módulos incluidos, límites (consultas/mes, storage, etc.). Formulario para crear/editar planes.
- **Interacción**: CRUD de planes. Vincular `price_id` de Stripe. Configurar módulos y límites por plan.
- **Satisface**: REQ-038, REQ-044.

### 7.5 Configuración de Stripe
- **Ruta**: `/(dashboard)/admin/stripe`
- **Componente**: `AdminStripePage` con `StripeConfigPanel`
- **Qué muestra**: API key (enmascarada), webhook secret, webhook URL para copiar, tabla de webhooks recibidos (últimos 50) con estado y timestamp. Botón "Probar Webhook".
- **Satisface**: REQ-021, REQ-023, Nota 13.

### 7.6 Configuración de Gmail
- **Ruta**: `/(dashboard)/admin/gmail`
- **Componente**: `AdminGmailPage` con `GmailNotificationSettings`
- **Qué muestra**: Cuenta de Gmail configurada, estado de conexión OAuth, plantillas de email (bienvenida, reset password, notificación de cita, confirmación de pago). Editor básico de plantillas.
- **Satisface**: REQ-030.

### 7.7 Anuncios
- **Ruta**: `/(dashboard)/admin/anuncios`
- **Componente**: `AdminAnnouncementsPage` con `AnnouncementEditor`
- **Qué muestra**: Lista de anuncios (activos/pasados). Editor de anuncio: título, contenido, audiencia (todos, rol específico), fecha de inicio/fin, prioridad. Preview del anuncio.
- **Satisface**: REQ-038, Nota 13.

### 7.8 Roles y Permisos
- **Ruta**: `/(dashboard)/admin/permisos`
- **Componente**: `AdminPermissionsPage`
- **Qué muestra**: Matriz de permisos: filas = roles, columnas = acciones/módulos. Checkboxes para activar/desactivar. Los permisos de `superadmin` son inmutables (todos activados, no editables).
- **Satisface**: REQ-038, REQ-039.

---

## 8. FASE 5 — SOPORTE Y CONTABILIDAD

### 8.1 Dashboard de Soporte — Home
- **Ruta**: `/(dashboard)/soporte`
- **Componente**: `SupportHomePage`
- **Qué muestra**: Métricas: tickets abiertos, resueltos hoy, tiempo medio de respuesta, tickets escalados. Lista rápida de tickets urgentes.
- **Satisface**: Nota 15.

### 8.2 Soporte — Tickets
- **Ruta**: `/(dashboard)/soporte/tickets`
- **Componente**: `SupportTicketsPage` con `TicketList`
- **Qué muestra**: Tabla de tickets con: ID, usuario, asunto, categoría (técnico, pago, queja, otro), prioridad, estado, fecha, asignado a.
- **Filtros**: por estado, prioridad, categoría. Búsqueda por texto.
- **Ruta detalle**: `/(dashboard)/soporte/tickets/[ticketId]`
- **Componente detalle**: `SupportTicketDetailPage` con `TicketDetail`
  - Información del ticket completa.
  - Chat/historial de mensajes entre usuario y soporte.
  - Panel lateral con info del usuario (nombre, rol, plan, casos activos, historial de tickets previos).
  - Acciones: responder, escalar, cerrar, categorizar, asignar prioridad.
  - Si es queja: botón de resolución con opciones (disculpa, compensación, escalamiento).
- **Satisface**: REQ-036, REQ-037, Nota 15.

### 8.3 Soporte — Usuarios
- **Ruta**: `/(dashboard)/soporte/usuarios`
- **Componente**: `SupportUsersPage`
- **Qué muestra**: Búsqueda de usuarios. Perfil resumido con: actividad reciente, tickets, pagos, estado. Acciones: banear (con motivo), desbloquear (con motivo). Cada acción genera `AuditActionReceipt`.
- **Satisface**: REQ-037, Nota 15.

### 8.4 Soporte — Compensaciones
- **Ruta**: `/(dashboard)/soporte/compensaciones`
- **Componente**: `SupportCompensationsPage` con `CompensationForm`
- **Qué muestra**: Historial de compensaciones otorgadas. Formulario: seleccionar usuario, tipo (crédito wallet, extensión de plan, reembolso parcial), monto, motivo. Aprobación requerida antes de ejecutar.
- **Satisface**: REQ-037, Nota 15.

### 8.5 Dashboard de Contabilidad — Home
- **Ruta**: `/(dashboard)/contabilidad`
- **Componente**: `AccountingHomePage`
- **Qué muestra**: Resumen financiero: total pagos pendientes, total pagados este mes, penalizaciones acumuladas. Card con próximo periodo de corte (fecha). Lookahead de 3 meses con proyecciones.
- **Satisface**: REQ-041, Nota 16.

### 8.6 Contabilidad — Pagos a Médicos
- **Ruta**: `/(dashboard)/contabilidad/pagos-medicos`
- **Componente**: `AccountingPaymentsPage` con `PaymentTable`
- **Qué muestra**: Tabla con: médico, periodo, citas completadas, monto bruto, penalizaciones, monto neto, estado (`Pendiente` | `En revisión` | `Pagado` | `Anulado`), comentarios, fecha de pago.
- **Acciones**: Cambiar estado (con comentario obligatorio al anular). Ver datos bancarios del médico (read-only). Marcar como pagado.
- **Ruta detalle**: `/(dashboard)/contabilidad/pagos-medicos/[paymentId]` — Detalle del pago con breakdown de citas.
- **Satisface**: REQ-041, Nota 16.

### 8.7 Contabilidad — Cortes
- **Ruta**: `/(dashboard)/contabilidad/cortes`
- **Componente**: `AccountingCutoffsPage` con `CutoffPeriodCard`
- **Qué muestra**: Lista de periodos de corte (quincenal o mensual). Cada periodo: fechas, total citas, total a pagar, estado. Timeline de próximos 3 cortes.
- **Satisface**: Nota 16.

### 8.8 Contabilidad — Penalizaciones
- **Ruta**: `/(dashboard)/contabilidad/penalizaciones`
- **Componente**: `AccountingPenaltiesPage` con `PenaltyTracker`
- **Qué muestra**: Tabla de penalizaciones: médico, tipo (cancelación tardía, no-show, queja), monto, fecha, estado (aplicada/disputada/revertida).
- **Satisface**: Nota 14, Nota 16.

### 8.9 Contabilidad — Reportes
- **Ruta**: `/(dashboard)/contabilidad/reportes`
- **Componente**: `AccountingReportsPage` con `ReportDownloader`
- **Qué muestra**: Generador de reportes con filtros: rango de fechas (hasta 1 año), médico específico o todos, tipo de reporte (pagos, penalizaciones, resumen). Botón "Generar y Descargar" → descarga CSV/Excel/PDF.
- **Satisface**: Nota 16 (descarga de reporte de 1 año).

---

## 9. FASE 6 — PULIDO FINAL

### 9.1 i18n Completo
- Revisar que TODAS las cadenas visibles usen `t('key')` desde el `LanguageProvider`.
- No dejar NINGÚN texto hardcodeado en español o inglés.
- Los archivos `es.json` y `en.json` deben tener las mismas keys.
- **Satisface**: REQ-005.

### 9.2 Accesibilidad — WCAG 2.2 AA
- Todos los botones interactivos: `aria-label` descriptivo.
- Contraste de colores: verificar ratios sobre glassmorphism (mínimo 4.5:1 para texto normal, 3:1 para texto grande).
- Navegación por teclado: Tab order lógico, focus rings visibles (`ring-2 ring-primary/50`).
- Lectores de pantalla: `role` y `aria-*` en componentes custom.
- Los formularios: labels asociados a inputs, mensajes de error vinculados con `aria-describedby`.
- Los modales/sheets de Radix ya son accesibles, pero verificar que se cierran con Escape.
- Skip to content link en el AppShell.
- **Satisface**: WCAG 2.2 AA obligatorio.

### 9.3 Responsive — Pruebas en breakpoints
- **360px** (Mobile): Todo funciona en single column. BottomBar visible. Context Rail como BottomSheet. Timeline como tab.
- **768px** (Tablet): Sidebar como drawer. 2 columnas donde aplique.
- **1024px** (Laptop): Sidebar visible. Layout completo.
- **1440px** (Desktop): Layout óptimo, todo visible.
- Probar que NO hay overflow horizontal en ningún breakpoint.
- **Satisface**: REQ-001.

### 9.4 Animaciones con Framer Motion
- **Transiciones de página**: `motion.div` con `initial={{ opacity: 0, y: 20 }}`, `animate={{ opacity: 1, y: 0 }}`, `exit={{ opacity: 0, y: -20 }}`.
- **Cards y listas**: `staggerChildren` con delay de 0.05s entre cada item.
- **Sidebar**: `AnimatePresence` + `motion.nav` para aparecer/desaparecer.
- **SafetyRibbon**: Transición suave entre estados (cambio de color con `layout` animation).
- **Toast/ActionReceipt**: Slide-in desde la derecha con spring physics.
- **Botón de enviar**: Scale pulse al enviar mensaje.
- **NO abusar**: máximo 300ms de duración. Respetar `prefers-reduced-motion`.
- **Satisface**: REQ-003 (UI moderna premium).

### 9.5 PWA Manifest
- **Archivo**: `web/src/app/manifest.ts` — Generar manifest con:
  - `name`: "Angélica Med"
  - `short_name`: "Angélica"
  - `theme_color`: "#050505"
  - `background_color`: "#050505"
  - `display`: "standalone"
  - `start_url`: "/"
  - `icons`: al menos 192x192 y 512x512.
- Verificar que la app es instalable en Chrome/Safari.
- **Satisface**: REQ-001 (PWA usable sin APK).

### 9.6 Action Receipts (Patrón transversal)
- El componente `AuditActionReceipt` se usa como toast persistente (no auto-dismiss en acciones críticas) después de CADA acción importante:
  - **Qué se hizo**: "Evidencia de laboratorio subida al caso #23."
  - **Dónde se guardó**: "Guardado en Historial > Caso Migraña Crónica > Documentos."
  - **Qué sigue**: "Angélica analizará los resultados en tu próxima consulta."
  - **Cómo revertir** (si aplica): botón "Deshacer" con timer de 10s.
- **Satisface**: REQ-003 (patrón Action Receipts).

---

## 10. REGLAS ABSOLUTAS PARA JULES

### ✅ SÍ HACER:
1. Usar `cn()` de `@/lib/utils` para todas las clases condicionales.
2. Usar componentes shadcn/ui como base para TODO (Button, Input, Dialog, Sheet, etc.).
3. Aplicar `glass-panel` class para superficies glassmorphism.
4. Usar Lucide React para TODOS los íconos. No instalar otro icon set.
5. Cada componente en su propio archivo `.tsx`.
6. Exportar componentes con `export function ComponentName()` (named exports).
7. Tipar TODAS las props con interfaces TypeScript.
8. Usar React Server Components donde sea posible. `"use client"` SOLO cuando se necesite interactividad (hooks, event handlers, Framer Motion).
9. Colores SOLO via tokens semánticos (`text-primary`, `bg-surface`, `border-glass-border`, etc.). NUNCA hex directo en JSX.
10. Cada formulario con validación client-side antes de submit.
11. Usar `<Image>` de `next/image` para todas las imágenes.
12. Usar `<Link>` de `next/link` para toda navegación interna.
13. Las frases motivacionales deben ser 365 como MÍNIMO, empáticas, sobre salud y bienestar. Almacenadas en `lib/constants.ts`.

### ❌ NO HACER:
1. **NO borrar** `globals.css`, `layout.tsx` (root), `utils.ts`, `SafetyRibbon.tsx`, `ContextRail.tsx`, `ConversationalCareCanvas.tsx`, `ClinicalTimelineRiver.tsx`.
2. **NO usar** colores hex directos en componentes. Siempre via tokens.
3. **NO instalar** Chakra UI, Material UI, Ant Design, ni ninguna otra librería de componentes.
4. **NO crear** páginas que no estén en este documento.
5. **NO escribir** texto de la IA que diga "Soy una IA", "No puedo diagnosticar", "Soy un modelo de lenguaje" o similares. La IA se llama "Angélica" y habla con confianza clínica dentro de sus límites.
6. **NO usar** `any` en TypeScript. Tipar todo correctamente.
7. **NO dejar** textos hardcodeados sin pasar por el sistema de i18n (excepto en Fase 0-1 donde se puede hacer progresivamente).
8. **NO crear** un chatbot genérico con burbujas redondeadas tipo ChatGPT. El Conversational Care Canvas es un CENTRO CLÍNICO INTERACTIVO con acciones integradas.
9. **NO usar** `fetch` directamente para datos del servidor. Usar React Query / TanStack Query con hooks custom.
10. **NO poner** lógica de negocio en componentes de UI. Los componentes consumen hooks y stores.
11. **NO usar** `localStorage` directamente en componentes. Abstraer en hooks o stores.
12. **NO crear** animaciones mayores a 300ms ni ignorar `prefers-reduced-motion`.

---

## 11. ORDEN DE EJECUCIÓN

```
FASE 0 → FASE 1 → FASE 2 → FASE 3 → FASE 4 → FASE 5 → FASE 6
```

Cada fase debe completarse antes de iniciar la siguiente. Dentro de cada fase, los items se ejecutan en el orden listado. Si un componente depende de otro, el dependido se crea primero.

**Prioridad máxima**: FASE 0 (sin cimientos no hay nada) → FASE 1 (sin auth no se ve nada) → FASE 2 (el paciente es el usuario principal).

---

> _Documento generado el 2026-07-10. Cualquier cambio debe coordinarse con el arquitecto UI/UX._

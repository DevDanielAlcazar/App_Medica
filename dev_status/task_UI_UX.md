# Mapa de Tareas de Construcción UI/UX (Handoff a Jules)

**Atención Jules (IA de Frontend):** Este documento es tu plano maestro para construir la aplicación "Angélica Med". Hasta ahora, solo reemplazaste `page.tsx` para hacer un mock visual. A partir de este momento, **DEBES construir una aplicación multicapa real** y no sobrescribir la landing page base sin necesidad.

---

## 1. Arquitectura de Navegación y Roles

La aplicación no es de "un solo dashboard". Todos los usuarios entrarán por la misma pantalla de login, y el middleware de Next.js los ruteará a su portal correspondiente. Debes crear la siguiente estructura de carpetas dentro de `web/src/app/`:

- `/ (Landing Page)`: La landing premium con animaciones (ya está creada en `page.tsx`).
- `/auth/login`: Pantalla de inicio de sesión genérica (un solo formulario para todos).
- `/auth/register`: Registro de paciente/médico.
- `/dashboard/paciente`:
  - `page.tsx`: Pantalla principal (**Conversational Care Canvas** + **Context Rail** + **Clinical Timeline River**).
  - `/expediente`: Historial, reportes y evidencias.
  - `/citas`: Agendamiento de Google Meet.
- `/dashboard/medico`:
  - `page.tsx`: Panel de citas pendientes, métricas y pacientes.
  - `/consultas`: El visor del médico para atender videollamadas y dictaminar.
  - `/wallet`: Pagos Stripe y Ledger de saldo.
  - `/validacion`: Captura de cédula e INE (proceso de validación).
- `/dashboard/admin`:
  - `page.tsx`: Gestión global, soporte, quejas, y bans.
  - `/ai-providers`: Configuración de LLMs (Gemini, OpenAI, Claude).
  - `/contabilidad`: Cortes y reportes.

**REGLA:** NO construyas todos los componentes dentro del mismo archivo. Crea la carpeta `web/src/components/` (si no existe) y abstrae la lógica.

## 2. Sistema de Diseño y Estética (UI Premium 2026)

Revisa el archivo `08_UI_UX_Design_System_2026.md` en la raíz. Tienes prohibido usar interfaces tipo ChatGPT genérico. 

1. **Instala Shadcn UI y Radix:** Configura `npx shadcn-ui@latest init` en la carpeta `web/`.
2. **Glassmorphism y Dark Mode:** Usa las variables CSS ya configuradas en `globals.css`. Los paneles laterales deben tener fondo negro traslúcido y desenfoque (`backdrop-blur`).
3. **Framer Motion:** Agrega micro-animaciones (fade in, slide up) a las transiciones de página y apertura de modales.
4. **Context Rail:** Un drawer en móvil y un panel lateral fijo en Desktop.
5. **Safety Ribbon:** Un indicador semántico arriba (Verde/Amarillo/Rojo) discreto.

## 3. Manejo de Base de Datos

El archivo `.env` ya ha sido creado en `/web` con el formato PostgreSQL por la IA Arquitecta anterior.
- **Tu tarea:** No tienes acceso directo al servidor, pero debes asumir que la conexión funciona.
- **Acción:** Instala **Prisma ORM** (`npm install prisma --save-dev`, `npx prisma init`) y empieza a modelar los esquemas básicos para:
  - `User` (Rol: ADMIN, PACIENTE, MEDICO, SOPORTE)
  - `MedicalCase` (El expediente por padecimiento)
  - `Message` (Historial de chat con IA)
  - `Appointment` (Cita de Meet)

## 4. Orden de Ejecución para Jules

1. **Paso 1:** Configura Shadcn UI y crea el `layout.tsx` anidado para la carpeta `/dashboard`.
2. **Paso 2:** Construye las pantallas de Login y Registro en `/auth`.
3. **Paso 3:** Implementa la estructura del `/dashboard/paciente` creando e integrando de forma real los componentes `ConversationalCareCanvas`, `ContextRail` y `ClinicalTimelineRiver`.
4. **Paso 4:** Inicializa el esquema de Prisma para los usuarios.

> **NOTA PARA JULES:** Siempre documenta tu avance en `master_status.md` cuando termines un bloque. No cambies las variables estéticas ya establecidas en `globals.css` sin autorización expresa.

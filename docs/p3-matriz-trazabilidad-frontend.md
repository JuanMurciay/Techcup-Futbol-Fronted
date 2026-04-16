# Punto 3 - Matriz de trazabilidad frontend

Este documento define la trazabilidad del frontend tomando como fuente los requerimientos funcionales RF-01 a RF-14 y su traducción a pantallas, flujos, componentes y estados visuales.

## Criterios transversales para todos los RF

- Estructura front por `pages`, `components`, `hooks`, `services`, `types`, `routes`, `features`.
- Tipado fuerte en props, modelos, DTOs request/response.
- Estados visuales por vista: `loading`, `error`, `empty` (si aplica), `success`.
- Validaciones de formularios en cliente y manejo de errores de negocio/red.
- UX/UI consistente con mockups, usando `Poppins`, `Orbitron`, `#799852`, `#47622B`.

## Matriz de trazabilidad por requerimiento funcional

### RF-01: Gestión de Usuarios y Autenticación
- **Pantallas:** `home`, `login`, `register`, recuperación de contraseña (pendiente).
- **Rutas base:** `/`, `/login`, `/register`.
- **Componentes front:** formularios de autenticación, campos validados, feedback de error.
- **Conectividad:** `apiClient`, `auth.service`, `useAuth`.
- **Flujo:** inicio -> login/registro -> redirección por rol.

### RF-02: Gestión del Perfil Deportivo
- **Pantallas:** perfil de jugador/usuario, edición de perfil.
- **Rutas base:** `/players/:id` (actual), `/profile` (propuesta).
- **Componentes front:** formulario de perfil, carga de foto, selects (posición, género).
- **Conectividad:** servicios de jugador/perfil.
- **Flujo:** ver perfil -> editar -> guardar -> refrescar vista.

### RF-03: Creación y Configuración de Equipos
- **Pantallas:** crear equipo, detalle/configuración de equipo.
- **Rutas base:** `/teams/create`, `/teams/:id`.
- **Componentes front:** formulario de equipo, escudo, colores, listado de jugadores.
- **Conectividad:** `team.service`.
- **Flujo:** crear equipo -> configurar -> publicar.

### RF-04: Búsqueda e Invitación de Jugadores
- **Pantallas:** búsqueda de jugadores, panel de invitaciones emitidas.
- **Rutas base:** `/teams/:id/invitations` (propuesta).
- **Componentes front:** buscador, tabla/listado, acciones invitar/cancelar.
- **Conectividad:** endpoints de invitaciones en `team.service`.
- **Flujo:** buscar -> seleccionar -> invitar -> confirmar estado.

### RF-05: Configuración del Torneo
- **Pantallas:** panel organizador, creación/edición de torneo.
- **Rutas base:** `/organizer/dashboard`, `/tournaments/config` (propuesta).
- **Componentes front:** formulario torneo (fechas, cupos, reglas).
- **Conectividad:** `tournament.service`.
- **Flujo:** crear torneo -> validar -> guardar -> publicar.

### RF-06: Gestión de Pagos
- **Pantallas:** estado de pago de equipos, carga de soporte/recibo.
- **Rutas base:** `/payments` (propuesta), sección en `team detail`.
- **Componentes front:** tabla de pagos, uploader de comprobante, badges de estado.
- **Conectividad:** `payment.service`.
- **Flujo:** registrar pago -> validar -> aprobar/rechazar -> notificar estado.

### RF-07: Configuración de Alineaciones
- **Pantallas:** configuración previa al partido.
- **Rutas base:** `/matches/:id/lineup` (propuesta).
- **Componentes front:** selector de jugadores, esquema táctico, validaciones.
- **Conectividad:** `match.service`.
- **Flujo:** seleccionar jugadores -> guardar alineación -> confirmar.

### RF-08: Registro de Resultados
- **Pantallas:** detalle de partido y reporte arbitral.
- **Rutas base:** `/matches/:id`, `/referee/reports`.
- **Componentes front:** formulario de goles/tarjetas/eventos.
- **Conectividad:** `match.service`, `referee.service`.
- **Flujo:** árbitro registra -> sistema calcula -> publica resultado.

### RF-09: Tabla de Posiciones y Generación de Llaves
- **Pantallas:** tabla de posiciones, vista de llaves.
- **Rutas base:** `/standings`, `/brackets` (propuesta).
- **Componentes front:** tabla ordenable, visualización de cruces.
- **Conectividad:** `tournament.service`, `stats.service`.
- **Flujo:** consultar jornada -> actualizar tabla -> visualizar llaves.

### RF-10: Gestión del Estado del Torneo
- **Pantallas:** administración de estados del torneo.
- **Rutas base:** `/organizer/dashboard` (módulo estado torneo).
- **Componentes front:** controles de cambio de estado, confirmaciones.
- **Conectividad:** `tournament.service`.
- **Flujo:** cambiar estado -> validar reglas -> reflejar cambios globales.

### RF-11: Gestión de Invitaciones (Recepción y Decisión)
- **Pantallas:** bandeja de invitaciones para jugador.
- **Rutas base:** `/player/invitations` (propuesta).
- **Componentes front:** lista de invitaciones, botones aceptar/rechazar.
- **Conectividad:** `team.service`/servicio de invitaciones.
- **Flujo:** recibir invitación -> decidir -> actualizar equipo/estado.

### RF-12: Consulta de Programación para Árbitros
- **Pantallas:** agenda de partidos asignados.
- **Rutas base:** `/referee/dashboard`, `/referee/schedule` (propuesta).
- **Componentes front:** calendario/lista de partidos, filtros por fecha.
- **Conectividad:** `referee.service`, `match.service`.
- **Flujo:** consultar programación -> abrir detalle de partido.

### RF-13: Consulta de Estadísticas Globales e Historial
- **Pantallas:** dashboard de estadísticas.
- **Rutas base:** `/stats` (propuesta), módulos por rol.
- **Componentes front:** tarjetas KPI, tablas, filtros históricos.
- **Conectividad:** `stats.service`.
- **Flujo:** seleccionar filtros -> consultar -> mostrar métricas e historial.

### RF-14: Consulta de la Alineación Rival
- **Pantallas:** detalle prepartido y alineación rival.
- **Rutas base:** `/matches/:id/rival-lineup` (propuesta).
- **Componentes front:** lista/formación rival, estado de disponibilidad.
- **Conectividad:** `match.service`.
- **Flujo:** abrir partido -> consultar rival -> ajustar estrategia propia.

## Flujo macro de pantallas (frontend)

`/` -> `login | register` -> dashboard por rol -> módulos por RF según permisos

## Priorización sugerida para implementación por features

1. RF-01 y RF-02 (base de acceso e identidad).
2. RF-03, RF-04 y RF-11 (ciclo de equipos e invitaciones).
3. RF-05, RF-10 y RF-06 (gestión de torneo y pagos).
4. RF-07, RF-08, RF-14 (operación de partidos).
5. RF-09 y RF-13 (visualización de resultados y analítica).

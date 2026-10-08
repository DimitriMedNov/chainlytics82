# Sistema visual y piezas compartidas de Chainlytics

Los tokens viven en `src/index.css` (su comentario inicial es el resumen). Todo se importa de
`@/ui/shared`. Guía para quien escribe una pantalla: `.claude/viernes/guias/BASE.md`.

## 1. Tokens

Forma: tres números HSL. Se leen `hsl(var(--x))` o `hsl(var(--x) / 0.5)`; en clases,
`bg-card`, `text-muted-foreground`, `border-border`. Nunca un color, tamaño o radio escrito a mano.

| Token | Clase | Para qué |
|---|---|---|
| `--background` | `bg-background` | Lienzo de la página |
| `--card` | `bg-card` | Tarjetas y secciones (lo normal) |
| `--elevated` | `bg-elevated` | Bloque DENTRO de una tarjeta que debe despegar (cifra destacada, cabecera de tabla, fila activa) |
| `--popover` | `bg-popover` | Lo que flota: menús, diálogos, hojas laterales, avisos |
| `--muted` | `bg-muted` | Relleno neutro: esqueletos, chips, pistas |
| `--accent` | `bg-accent` | Hover y selección |
| `--foreground` / `--muted-foreground` | `text-foreground` / `text-muted-foreground` | Texto normal / atenuado |
| `--primary` + `--primary-foreground` | `bg-primary text-primary-foreground` | Rellenos de marca (botón principal, logo) |
| `--link` | `text-link` | Violeta legible como TEXTO en los dos temas (enlaces, destino activo). `text-primary` no llega a 4,5:1 en oscuro: no usarlo para texto |
| `--success` / `--warning` / `--destructive` | `text-success`... | Sube = success · baja = warning (naranja; también avisos) · `destructive` solo para errores y acciones destructivas. Siempre con signo, flecha o texto, nunca solo color |
| `--chart-1..5` | `text-chart-1`, `var(--bklit-chart-1)` | Series: violeta, azul, ámbar, turquesa, rosa |
| `--border` / `--input` / `--ring` | `border`, `border-input` | Divisores y tarjetas / campos / foco |

Radios: `rounded-sm` 6 px (chips, botones dentro de grupos) · `rounded-md` 8 (botones, campos) ·
`rounded-lg` 10 (tarjetas) · `rounded-xl` 14 (diálogos) · `rounded-full` (avatares).

Sombras: `shadow-card` (tarjeta en reposo) · `shadow-raised` (hover, botón flotante) ·
`shadow-overlay` (menús, diálogos, avisos).

## 2. Texto

| Clase | Tamaño | Uso |
|---|---|---|
| `type-title` | 24/32 semibold | `h1` de la página (lo pone `PageHeader`) |
| `type-section` | 15/22 semibold | Título de sección o tarjeta (`Panel.Title`) |
| `type-eyebrow` | 11/16 medium, mayúsculas | Etiqueta de cifra, cabecera de tabla |
| `type-figure-lg` | 28/34 semibold, tabular | Cifra principal |
| `type-figure` | 18/26 semibold, tabular | Cifra secundaria |
| `type-num` | — | Cifras tabulares a cualquier tamaño: toda columna de números la lleva |
| `text-sm` | 14/20 | Cuerpo |
| `text-xs` / `text-2xs` | 12/16 · 11/16 | Ayuda / mínimo |

## 3. Página

Ancho máximo `max-w-page` (1440 px). Márgenes `px-4 sm:px-6 lg:px-8`. Entre secciones `gap-6`;
dentro de una tarjeta `p-4 sm:p-5`. Cortes: `xs` 380 · `sm` 640 · `md` 768 · `lg` 1024 (aparecen
los destinos en la barra) · `xl` 1280.

```tsx
<PageContainer>
  <PageHeader title="Mercados" description="…" actions={<Button>…</Button>}>
    <StorageBadge isSynced={isSynced} />
  </PageHeader>
  <StatGrid columns={4}>
    <Stat label="Capitalización" value={formatCompact(x)} change={2.4} changePeriod="24 h" />
  </StatGrid>
  <PageGrid layout="main">
    <Panel aria-labelledby="t1">
      <Panel.Header>
        <div><Panel.Title id="t1">Precio</Panel.Title><Panel.Description>…</Panel.Description></div>
        <Panel.Actions><RangeSelector value={days} onChange={setDays} /></Panel.Actions>
      </Panel.Header>
      <Panel.Body>…</Panel.Body>
      <Panel.Footer>…</Panel.Footer>
    </Panel>
    <Panel>…</Panel>
  </PageGrid>
</PageContainer>
```

## 4. Los 4 estados (en este orden)

1. Error: `<ErrorState error={query.error} onRetry={() => query.refetch()} isRetrying={query.isFetching} />`.
2. Cargando: `<LoadingRegion label="Cargando mercados">` con `StatSkeleton`, `ListSkeleton`,
   `RowSkeleton`, `ChartSkeleton` o `PageHeaderSkeleton` dentro. Nunca un spinner centrado.
3. Vacío: `<EmptyState icon title description action />`, siempre con acción.
4. Éxito.

## 5. Reglas fijas

- Todo lo pulsable mide 44×44 px: `min-h-11` (y `min-w-11` o `size-11` si es solo icono).
- Icono sin texto: `aria-label` en el botón y `aria-hidden="true"` en el icono.
- El foco ya se ve solo (contorno de 2 px con `--ring`): no quitarlo.
- Avisos: `notify.success/error/info/warning` de `@/ui/shared`. No importar `sonner`.
- Imágenes: `CoinAvatar` (tamaño fijo, `loading="lazy"`, reserva si falla).
- Contraste medido (claro / oscuro): texto 17,5 / 17,9 · atenuado 6,4 / 7,9 (sobre tarjeta
  6,7 / 7,5) · texto sobre primario 5,7 · éxito 6,2 / 9,5 · peligro 6,4 / 5,9.

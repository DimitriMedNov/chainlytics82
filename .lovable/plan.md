## Objetivo
Quitar todo rastro posible de Lovable del repositorio de GitHub, tanto en el código actual como en el historial de commits.

## Importante antes de empezar
Esto **romperá la sincronización con Lovable** (los hashes de commit van a cambiar). Después de aplicar esto, los cambios que hagas en Lovable ya no se van a reflejar limpiamente en GitHub, y viceversa. Vas a tener que trabajar solo desde tu IDE local de ahora en adelante, o desconectar y reconectar el repo aceptando que se va a "ensuciar" de nuevo.

## Qué se va a limpiar

### En el código actual del repo
1. `README.md` — quitar cualquier mención a Lovable, URLs `lovable.app`, badges, instrucciones de "Edit with Lovable", etc.
2. `package.json` — revisar `name`, `description`, scripts y dependencias residuales.
3. `index.html` — quitar `<title>`, meta tags `og:image`, `twitter:image` que apunten a `lovable.dev` o `lovable.app`.
4. Buscar en todo el repo strings: `lovable`, `Lovable`, `gpteng`, `gptengineer`, `lovable.app`, `lovable.dev` y limpiar lo que aparezca (excepto `LOVABLE_API_KEY` en la edge function `ai-crypto-analyst`, que pediste preservar).
5. `.github/`, workflows, o cualquier archivo de configuración que mencione Lovable.

### En el historial de Git (lo que ves en la captura)
6. Reescribir **todos los commits** del historial para:
   - Cambiar el author/committer de `lovable-dev[bot]` a tu usuario de GitHub (`DimitriMedNov`).
   - Quitar las líneas `Co-authored-by: lovable-dev[bot] <...>` de los mensajes de commit.
   - Quitar los trailers `X-Lovable-Edit-ID: edt-...` de los mensajes de commit.
7. Force-push a `main` para reemplazar el historial en GitHub.

## Cómo se va a hacer (detalles técnicos)

Como Lovable no puede ejecutar `git` contra tu repo de GitHub directamente, el flujo será:

**Parte A — Lo que hago yo en Lovable (automático):**
- Limpiar el código fuente (puntos 1–5). Esto va a generar un commit nuevo en Lovable que se sincroniza a GitHub.

**Parte B — Lo que tenés que correr vos en tu máquina local (te dejo los comandos exactos):**
Un script con `git filter-repo` (o `git filter-branch` como fallback) que:
```text
1. Clona el repo
2. Reescribe author/committer de lovable-dev[bot] -> DimitriMedNov
3. Limpia mensajes de commit (quita Co-authored-by y X-Lovable-Edit-ID)
4. Force-push a origin/main
```

Te voy a entregar el script listo para copiar/pegar, con tus datos (`DimitriMedNov`, email `72107871+DimitriMedNov@users.noreply.github.com`).

## Resultado esperado
- El repo en GitHub no menciona Lovable en ningún archivo (excepto `LOVABLE_API_KEY` en la edge function).
- Todos los commits aparecen como autoría tuya (`DimitriMedNov`), sin co-author bot ni `X-Lovable-Edit-ID`.
- La columna de "68 Commits" se mantiene, pero ninguno muestra al bot.

## Lo que NO se puede quitar
- El nombre del repo si contiene "lovable" (lo podés renombrar vos desde GitHub Settings).
- Webhooks/Apps de GitHub instaladas (las desinstalás desde GitHub → Settings → Integrations si querés).
- Si dejás conectado el repo a Lovable y volvés a editar desde acá, los commits nuevos van a volver a tener el bot como co-author.

¿Procedo con la Parte A (limpiar el código) y te preparo el script de la Parte B?

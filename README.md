# Padel-Copones-2026

## 📸 Fotos del repo

- Van en `fotos/<tipo>/<fecha>.jpg` (tipo: `kia`, `pala`, `mvp`, `cafe`; más fotos del mismo día: `<fecha>-2.jpg`, `-3`, `-4`) y las de perfil en `fotos/perfil/<apodo>.jpg`.
- Después de subir fotos, corré `bash miniaturas.sh` (necesita ImageMagick): crea `fotos/<tipo>/min/<mismo nombre>.jpg` de 360 px, que es lo que muestran las grillas, el Inicio y los avatares (el visor abre la grande). Si te olvidás no se rompe nada: la app muestra la grande, solo pesa más.

## 🚀 Publicar una versión nueva (y cómo volver atrás)

La app se publica sola con GitHub Pages desde la rama `main` (tarda 1-2 minutos).

**Publicar** las mejoras de una rama (ej. `claude/mejoras-30`):

1. Unir la rama a `main` (en GitHub: *Pull request → Merge*, o `git checkout main && git merge --ff-only claude/mejoras-30 && git push`).
2. Abrir la app con la cuenta de admin: si hay parches de datos pendientes, se guardan solos en la nube ("Guardado en la nube ☁️").
3. Si la versión trae cambios en `firestore.rules`, pegarlas en Firebase **después** de publicar la app (pasos en [SEGURIDAD.md](SEGURIDAD.md)). La de los partidos a un set 🎾 trae reglas nuevas para `propuestas` (sección "Partidos a un set" de SEGURIDAD.md); mientras no se publiquen, la carga de partidos anda igual.

## 🎾 Partidos a un set

- Después de jugar, cada pareja carga sus partidos en **"🎾 Cargá tus partidos"** (link directo: `#partidos=AAAA-MM-DD`): rival y resultado con botones (6-0 … 6-5🎯 / 0-6 … 5-6🎯, o "⏱️ No se terminó" con cómo iba).
- El admin guarda directo (si corrige o borra algo, lo de antes queda en el historial 🕓 de la fecha); un jugador manda una propuesta que el admin confirma con un toque desde el Inicio o Admin ("✅ Confirmar todas" si hay varias, de la más vieja a la más nueva). Si las dos parejas cargan el mismo partido no se duplica; si no coinciden, se muestran lado a lado (con el Nº y la hora de cada uno) y elige el admin. Dos partidos iguales de la misma pareja con distinto Nº no se juntan solos: se pregunta "¿Es el mismo partido?".
- El jugador corrige lo que mandó con ✏️ (se reenvía con el mismo Nº) y, si el rival cargó otro resultado, elige "⚔️ Fue como lo cargué yo" o "➕ Fueron 2 partidos". Lo cargado sin mandar queda guardado en el celu (sobrevive a una recarga). Una pareja "cargó" cuando cargó lo suyo: figurar de rival en lo que cargó otro no alcanza, así que se le siguen pidiendo los suyos.
- Se ven en "🎾 Partidos del domingo" (debajo del resultado), en el perfil, en la pestaña "🎾 Partidos" del Ranking y en "⚔️ Comparar con…". **No cambian el ranking oficial** (Kias y fechas). El fixture que sortea la app es tentativo: lo que vale es lo que se carga.

**Volver atrás** si algo sale mal:

- Revertir el merge en `main` (`git revert -m 1 <commit del merge>` y push) o volver `main` al último commit bueno. La versión anterior a las 30 mejoras es el commit `99e73d5`.
- Si ya se publicaron las reglas nuevas y se vuelve a una app anterior a octubre 2026, volver a pegar en Firebase las reglas de esa versión (`git show 99e73d5:firestore.rules`): la app vieja no manda el campo `prev` y las reglas nuevas no la dejarían guardar.
- Los datos no se tocan al revertir: viven en Firestore y cada lunes queda un backup en `backups/`.

# Padel-Copones-2026

## 📸 Fotos del repo

- Van en `fotos/<tipo>/<fecha>.jpg` (tipo: `kia`, `pala`, `mvp`, `cafe`; más fotos del mismo día: `<fecha>-2.jpg`, `-3`, `-4`) y las de perfil en `fotos/perfil/<apodo>.jpg`.
- Después de subir fotos, corré `bash miniaturas.sh` (necesita ImageMagick): crea `fotos/<tipo>/min/<mismo nombre>.jpg` de 360 px, que es lo que muestran las grillas, el Inicio y los avatares (el visor abre la grande). Si te olvidás no se rompe nada: la app muestra la grande, solo pesa más.

## 🚀 Publicar una versión nueva (y cómo volver atrás)

La app se publica sola con GitHub Pages desde la rama `main` (tarda 1-2 minutos).

**Publicar** las mejoras de una rama (ej. `claude/mejoras-30`):

1. Unir la rama a `main` (en GitHub: *Pull request → Merge*, o `git checkout main && git merge --ff-only claude/mejoras-30 && git push`).
2. Abrir la app con la cuenta de admin: si hay parches de datos pendientes, se guardan solos en la nube ("Guardado en la nube ☁️").
3. Si la versión trae cambios en `firestore.rules`, pegarlas en Firebase **después** de publicar la app (pasos en [SEGURIDAD.md](SEGURIDAD.md)).

**Volver atrás** si algo sale mal:

- Revertir el merge en `main` (`git revert -m 1 <commit del merge>` y push) o volver `main` al último commit bueno. La versión anterior a las 30 mejoras es el commit `99e73d5`.
- Si ya se publicaron las reglas nuevas y se vuelve a una app anterior a octubre 2026, volver a pegar en Firebase las reglas de esa versión (`git show 99e73d5:firestore.rules`): la app vieja no manda el campo `prev` y las reglas nuevas no la dejarían guardar.
- Los datos no se tocan al revertir: viven en Firestore y cada lunes queda un backup en `backups/`.

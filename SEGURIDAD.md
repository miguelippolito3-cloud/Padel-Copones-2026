# 🔒 Seguridad de la base de datos

La app guarda todo en Firestore (Firebase). Lo que protege esos datos de un
"gracioso del grupo" son las **reglas de seguridad** — el archivo
[`firestore.rules`](firestore.rules) de este repo tiene la versión recomendada.

## Qué garantizan estas reglas

| Qué | Quién puede |
|---|---|
| Ver ranking, fechas y jugadores | Todos (la app funciona sin login) |
| Guardar/editar los datos de la app | Solo admins (vos + co-admins 👑) |
| Proponer un resultado | Cualquiera logueado con Google |
| Editar la propuesta de otro | **Nadie** (no se pisan entre sí) |
| Confirmar/borrar propuestas | Solo admins |
| Agregar o quitar co-admins | Solo vos (los dueños) |
| Ver la lista de usuarios logueados | Solo admins |

## Cómo aplicarlas (2 minutos, una sola vez)

1. Entrá a [console.firebase.google.com](https://console.firebase.google.com) con tu cuenta de Google.
2. Elegí el proyecto **padel-copones**.
3. Menú de la izquierda → **Firestore Database** → pestaña **Reglas** (Rules).
4. Borrá lo que haya y pegá el contenido completo de [`firestore.rules`](firestore.rules).
5. Tocá **Publicar** (Publish).

Listo. Si después de publicar algo de la app deja de andar (guardar, proponer,
co-admins), avisale a Claude qué acción falló y se ajusta la regla.

## Backup automático ☁️

Además, todos los **lunes a las 9:00 (Argentina)** un robot de GitHub descarga
la base completa y la guarda en la carpeta [`backups/`](backups/) de este repo
(solo si hubo cambios). Si un día se borra algo por error:

1. Abrí la carpeta `backups/` y bajá el archivo más reciente.
2. En la app: **Admin → Importar** → elegí ese archivo.
3. **Admin → ☁️ Subir los datos de este dispositivo a la nube.**

También podés forzar un backup ya mismo desde GitHub: pestaña **Actions** →
**Backup semanal de la nube** → **Run workflow**.

# 🔒 Seguridad de la base de datos

La app guarda todo en Firestore (Firebase). Lo que protege esos datos de un
"gracioso del grupo" son las **reglas de seguridad** — el archivo
[`firestore.rules`](firestore.rules) de este repo tiene la versión recomendada.

## Qué garantizan estas reglas

| Qué | Quién puede |
|---|---|
| Ver ranking, fechas y jugadores | Todos (la app funciona sin login) |
| Guardar/editar los datos de la app | Solo admins (vos + co-admins 👑), y **solo sobre la última versión de la nube** |
| Borrar el documento entero de datos | **Nadie** |
| Proponer un resultado | Cualquiera logueado con Google, **firmado con su propio mail** y con el formato de la app |
| Editar la propuesta de otro | **Nadie** (no se pisan entre sí) |
| Confirmar/borrar propuestas | Solo admins |
| Agregar o quitar co-admins | Solo vos (los dueños) |
| Ver la lista de usuarios logueados | Solo admins |
| Escribir su ficha de usuario | Cada uno la suya, solo con los campos de la app |
| Jugar o cambiar el prode 🎲 | Cada uno el suyo, **hasta las 8:30 (hora Argentina) del domingo** de esa fecha |
| Anotarse / bajarse del domingo 🙋 | Cada uno a sí mismo (no se puede anotar a otro) |
| Ver las fotos publicadas desde la app | Cualquiera logueado |
| Publicar o borrar fotos (Kia, cuchara, MVP, café, perfiles) | Solo admins |

## Qué cambió en octubre 2026

- **Datos de la app (`app/data`)**: la app nueva guarda con una *transacción* y manda
  `prev` = el `updated` de la versión sobre la que trabajó. La regla exige que `prev`
  coincida con lo que hay en la nube: un celular con datos viejos (o sin señal y con
  cambios encolados) **no puede pisar** lo que cargó otro admin. Además se valida que el
  documento tenga solo `json`, `updated`, `by` y `prev`, que `by` sea el mail de quien guarda,
  y nadie puede borrarlo.
- **Propuestas**: solo los campos que manda la app (`f`, `por`, `ts`, `campeon`, `pala`,
  `mvp`, `sinCafe`), `f` con formato `AAAA-MM-DD`, `por` igual al mail de la cuenta,
  campeón y cuchara como pareja (lista de 2 o 3), MVP texto y café lista. Así nadie puede
  meter HTML/código en el panel del organizador ni firmar como otro.
- **Usuarios**: cada uno escribe solo su doc, con los campos `email` (el de su cuenta),
  `nombre`, `ultimoIngreso` (número), `jugador` y `vinculadoEl`.
- **Prode**: se cierra a las **8:30 hora Argentina del domingo de esa fecha**. Argentina es
  UTC-3 todo el año (sin horario de verano), así que la regla compara `request.time` (que
  viene en UTC) con ese día a las **11:30 UTC**. Pasada esa hora no se puede crear, cambiar ni
  borrar el pronóstico de esa fecha. La app también esconde el botón a esa hora.
- **Prode y asistencia, sin suplantar**: además de que el documento lleva el `uid` de quien
  escribe, el `nombre` tiene que ser la primera palabra del nombre de su cuenta de Google
  (o su mail si no tiene nombre) y el `jugador`, si viene, tiene que ser el que esa misma
  cuenta tiene vinculado con "⭐ Este soy yo". Ojo: el vínculo "⭐ Este soy yo" lo elige cada
  uno (vale honor); lo que garantizan las reglas es que no se puede anotar ni pronosticar a
  nombre de otra cuenta, y que quien se vincula como otro jugador queda a la vista con su mail
  en **Admin → Usuarios logueados**.

Las reglas se probaron en el emulador oficial de Firestore con los writes exactos que hace la
app (y con los ataques: HTML en la fecha, propuestas firmadas como otro, prode fuera de hora,
anotar a otro, guardar con datos viejos).

## Cómo aplicarlas (2 minutos)

⚠️ **Orden importante:** primero tiene que estar publicada la **versión nueva de la app**
(la que guarda con `prev`). Si publicás las reglas antes, la app vieja no va a poder guardar.

1. Publicá la app nueva (merge a `main` → GitHub Pages) y esperá a que se vea.
2. Abrí la app en el celu como admin, recargala y fijate que en **Admin** diga
   "☁️ Nube conectada · ✓ con datos".
3. Entrá a [console.firebase.google.com](https://console.firebase.google.com) con tu cuenta de Google.
4. Elegí el proyecto **padel-copones**.
5. Menú de la izquierda → **Firestore Database** → pestaña **Reglas** (Rules).
6. Borrá lo que haya y pegá el contenido completo de [`firestore.rules`](firestore.rules).
7. Tocá **Publicar** (Publish).
8. La próxima vez que guardes algo desde Admin tiene que decir "Guardado en la nube ☁️".

Si algún co-admin tenía la app abierta desde antes, al guardar le va a salir un error:
alcanza con que la recargue (así baja la versión nueva). Si después de publicar algo de la
app deja de andar (guardar, proponer, prode, anotarse, co-admins), avisale a Claude qué
acción falló y se ajusta la regla.

## Backup automático ☁️

Además, todos los **lunes a las 9:00 (Argentina)** un robot de GitHub descarga
la base completa y la guarda en la carpeta [`backups/`](backups/) de este repo
(solo si hubo cambios). Si un día se borra algo por error:

1. Abrí la carpeta `backups/` y bajá el archivo más reciente.
2. En la app: **Admin → Importar** → elegí ese archivo.
3. La app te muestra qué cambia (cuántas fechas y jugadores tiene el archivo, la última
   fecha, qué fechas se pierden o entran) y te pide confirmar. Antes de reemplazar, baja
   sola una copia de lo que había en la nube (`copones-respaldo-antes-de-importar-AAAA-MM-DD.json`),
   así nada se pierde del todo. Al confirmar, se guarda en la nube directamente.

También podés forzar un backup ya mismo desde GitHub: pestaña **Actions** →
**Backup semanal de la nube** → **Run workflow**.

El botón **☁️ Subir los datos de este dispositivo a la nube** solo sirve si la nube quedó
vacía (o este celu tiene algo que la nube no): pide confirmación con la misma vista previa,
baja una copia de la nube antes y no hace nada si la app todavía no se conectó a la nube.

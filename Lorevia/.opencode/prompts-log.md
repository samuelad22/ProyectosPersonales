# Prompts Log - Lorevia

---

## Entrada 1

- **Fecha y hora:** Mon Sep 14 2026
- **Prompt:**

> @backend-logic Genera los controladores y servicios restantes con los métodos correspondientes, tomando como ejemplo LibroController y LibroService. Si tienes dudas sobre cómo implementar algo pregúntame antes de escribir código. @auditor genera una auditoría de la estructura y lógica del proyecto. @prompt-logger guarda este prompt.

- **Resumen de lo que se hizo:**
  Se registró la instrucción en el archivo de log de prompts. Se desplegaron tres subagentes en paralelo: `backend-logic`, `auditor` y `prompt-logger`.
  Durante la ejecución se aclararon con el usuario las siguientes decisiones de implementación:
  1. **LibroController**: Se decidió generar primero un EJEMPLO de POST, PUT y DELETE para que el usuario lo revise y apruebe antes de continuar con los demás controladores.
  2. **Corrección de consulta derivada**: Se cambió `findByCategoria(int)` por `findByCategoriaId(Long)` porque la consulta derivada de Spring Data JPA no funciona con una asociación ManyToOne directamente — se necesita usar el ID de la entidad relacionada.
  3. **Reescritura de UsuarioService**: Se reescribió `UsuarioService` y `UsuarioServiceImpl` siguiendo el patrón de interfaz + `@Service` impl, consistente con la estructura ya usada en `LibroService`/`LibroServiceImpl`.
  4. **Respetar nombres de paquetes**: Se mantuvieron los nombres capitalizados `Repositories` y `Enums` tal como existen en el proyecto, sin renombrarlos.

---

## Entrada 2

- **Fecha y hora:** Fri Sep 18 2026
- **Prompt:**

> @backend-logic Implementa JWT en el backend siguiendo la arquitectura del proyecto @frontend genera el frontend basico en react login, registro, listado de libros y gestion de personajes integrando la autenticaicon JWT @estilo-visual aplica las interfaces generadas la paleta de colroes 7371FC, A594F9, CDC1FF, F5EFFF, E5D9F2 @prompt-logger registra este prompt antes de que se ejecuten los cambios @naming-checked tras los cambios revisa la coherencia de nombres en español @auditor tras los cambios deja constancia en el log de esta auditoria @control-versiones actualiza el archivo de control de versiones con los cambios de los ultimos 5 prompts

- **Resumen de lo que se hizo:**
  Se registró la instrucción en el archivo de log de prompts (`.opencode/prompts-log.md`) **antes** de ejecutar los cambios, tal como solicita el agente `prompt-logger`. El prompt coordina siete subagentes: `backend-logic` (implementación JWT), `frontend` (login/registro/listado de libros/gestión de personajes con integración JWT), `estilo-visual` (paleta 7371FC, A594F9, CDC1FF, F5EFFF, E5D9F2), `prompt-logger` (este registro previo), `naming-checked` (revisión de coherencia de nombres en español), `auditor` (constancia de auditoría en el log) y `control-versiones` (actualización del archivo de control de versiones con los últimos 5 prompts).

---

## Entrada 3

- **Fecha y hora:** Fri Sep 18 2026
- **Prompt:**

> @backend-logic Cambia la relación personaje-libro a muchos-a-muchos (un personaje puede pertenecer a varios libros). Crea la entidad Categoria (nombre y los campos que consideres) con relación muchos-a-muchos con Libro (un libro puede tener varias categorías), y expón endpoints para asignar/crear/actualizar/borrar categorías. Añade a Usuario los campos nombre real, apellidos y nombre de usuario (obligatorios en el registro, además de email y contraseña ya existentes) y expón el nombre de usuario en el endpoint de sesión/perfil para que el frontend lo muestre. Revisa que los formularios de creación y actualización de libro y personaje en el backend acepten y persistan en BD todos los campos que exponga el frontend.
>
> @frontend En los formularios de creación/actualización de libro y personaje, añade los campos que falten para poder introducir todos los datos, incluyendo la asignación de un personaje a uno o más libros y de una o varias categorías a un libro (ambas como selección múltiple), asegurando que al guardar se actualicen correctamente en BD. Crea una vista de detalle de libro que liste todos sus personajes asociados. Añade la gestión de categorías (crear, actualizar, borrar, asignar a libros). Amplía el formulario de registro para pedir también nombre real, apellidos y nombre de usuario como obligatorios (además de email y contraseña). Cambia el navbar para mostrar el nombre de usuario en lugar del email.
>
> @estilo-visual Aplica la paleta de colores del proyecto (7371FC, A594F9, CDC1FF, F5EFFF, E5D9F2) a toda la interfaz, incluidas las pantallas y componentes nuevos (detalle de libro, gestión de categorías, formularios ampliados). Añade animaciones sutiles que aporten dinamismo (transiciones, hover, apertura de modales, etc.) sin introducir retrasos perceptibles en el uso de la app.
>
> @i18n Extrae a es.json/en.json todos los textos nuevos: campos de nombre real/apellidos/nombre de usuario en registro, vista de detalle de libro, gestión de categorías y sus formularios, y cualquier texto nuevo del navbar. Mantén ambos idiomas sincronizados.
>
> @prompt-logger Registra este prompt antes de que se ejecuten los cambios.
> @naming-checked Tras los cambios, revisa la coherencia de nombres en español en las nuevas entidades, campos y componentes.
> @auditor Tras los cambios, deja constancia en el log de auditoría de todo lo modificado.
> @control-versiones Actualiza el archivo de control de versiones con los cambios de los últimos 5 prompts.
>
> Nota de contexto para el log: la relación personaje-libro y la entidad Categoria YA existen en el modelo actual del backend (se implementaron antes); el agente backend-logic deberá verificar/completar en vez de partir de cero.

- **Resumen de lo que se hizo:**
  Se registró la instrucción en el archivo de log de prompts (`.opencode/prompts-log.md`) **antes** de ejecutar los cambios, tal como solicita el agente `prompt-logger`. El prompt coordina ocho subagentes: `backend-logic` (relación personaje-libro muchos-a-muchos, entidad Categoria con relación muchos-a-muchos con Libro y endpoints para asignar/crear/actualizar/borrar categorías, campos nombre real/apellidos/nombre de usuario en Usuario con exposición del nombre de usuario en sesión/perfil, y revisión de que los formularios backend de libro y personaje acepten y persistan todos los campos del frontend), `frontend` (formularios de libro y personaje ampliados con selección múltiple, vista de detalle de libro con personajes asociados, gestión de categorías, registro ampliado y navbar con nombre de usuario), `estilo-visual` (paleta 7371FC, A594F9, CDC1FF, F5EFFF, E5D9F2 en toda la interfaz y animaciones sutiles), `i18n` (extracción de textos nuevos a es.json/en.json), `prompt-logger` (este registro previo), `naming-checked` (revisión de coherencia de nombres en español), `auditor` (constancia de auditoría en el log) y `control-versiones` (actualización del archivo de control de versiones con los cambios de los últimos 5 prompts). Nota de contexto: la relación personaje-libro y la entidad Categoria ya existen en el modelo actual del backend, por lo que `backend-logic` deberá verificar/completar en lugar de partir de cero.

- **Nota breve:** El subagente backend-logic se canceló en la primera ejecución de este prompt (2026-09-18) y se re-lanzó posteriormente sin cambios en el enunciado. El subagente frontend completó sus 10 tareas en la primera ejecución. El prompt queda registrado una sola vez en esta entrada.

---

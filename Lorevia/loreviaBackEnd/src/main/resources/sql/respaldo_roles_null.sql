-- Respaldo/limpieza: usuarios preexistentes creados antes de añadir la columna `rol`
-- quedaron con rol NULL (ddl-auto=update no aplica valores por defecto a filas existentes).
-- Ejecutar manualmente una sola vez contra la base de datos `gestorLibros`:
--   mysql -u root -p gestorLibros < respaldo_roles_null.sql
USE gestorLibros;

UPDATE usuarios SET rol = 'USER' WHERE rol IS NULL;

-- Verificación
SELECT id, email, rol FROM usuarios ORDER BY id;
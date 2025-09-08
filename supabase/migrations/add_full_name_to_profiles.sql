-- Migración para agregar el campo full_name a la tabla profiles

-- Agregar la columna full_name a la tabla profiles
ALTER TABLE profiles ADD COLUMN full_name TEXT;

-- Actualizar los registros existentes concatenando first_name y last_name
UPDATE profiles 
SET full_name = TRIM(CONCAT(first_name, ' ', last_name))
WHERE first_name IS NOT NULL OR last_name IS NOT NULL;

-- Verificar que se actualizaron los perfiles
SELECT 
    id,
    first_name,
    last_name,
    full_name
FROM profiles
LIMIT 10;
-- Migración para crear perfiles faltantes eliminando triggers problemáticos

-- Eliminar trigger y función problemática con CASCADE
DROP FUNCTION IF EXISTS notify_new_user() CASCADE;

-- Crear perfiles para usuarios que no los tengan
INSERT INTO profiles (id, first_name, last_name, full_name, cedula_ruc, phone, gender, birth_date, role, created_at, updated_at)
SELECT 
    u.id,
    '' as first_name,
    '' as last_name,
    '' as full_name,
    '' as cedula_ruc,
    '' as phone,
    '' as gender,
    NULL as birth_date,
    'customer' as role,
    NOW() as created_at,
    NOW() as updated_at
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL
  AND u.deleted_at IS NULL;

-- Verificar el resultado
SELECT 
    'Total usuarios en auth.users' as descripcion,
    COUNT(*) as cantidad
FROM auth.users 
WHERE deleted_at IS NULL

UNION ALL

SELECT 
    'Total perfiles en profiles' as descripcion,
    COUNT(*) as cantidad
FROM profiles

UNION ALL

SELECT 
    'Usuarios sin perfil' as descripcion,
    COUNT(*) as cantidad
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL AND u.deleted_at IS NULL;

-- Mostrar usuarios recientes y su estado de perfil
SELECT 
    u.id,
    u.email,
    u.email_confirmed_at,
    u.created_at as fecha_registro,
    CASE WHEN p.id IS NOT NULL THEN 'Tiene perfil' ELSE 'SIN PERFIL' END as estado_perfil,
    p.role
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.deleted_at IS NULL
ORDER BY u.created_at DESC
LIMIT 10;
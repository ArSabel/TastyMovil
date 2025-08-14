-- Migración completa para asegurar que todos los usuarios tengan perfiles
-- Incluye usuarios confirmados y no confirmados para evitar problemas futuros

-- Crear perfiles para usuarios que no los tengan (incluyendo no confirmados)
INSERT INTO profiles (id, first_name, last_name, cedula_ruc, phone, gender, birth_date, role, created_at, updated_at)
SELECT 
    u.id,
    '' as first_name,
    '' as last_name,
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

-- Mostrar usuarios específicos que podrían estar causando problemas
SELECT 
    u.id,
    u.email,
    u.email_confirmed_at,
    CASE WHEN p.id IS NOT NULL THEN 'Tiene perfil' ELSE 'SIN PERFIL' END as estado_perfil
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.deleted_at IS NULL
ORDER BY u.created_at DESC
LIMIT 10;
-- Verificación final: usuarios registrados y sus perfiles

-- 1. Mostrar todos los usuarios con sus perfiles
SELECT 
    u.id,
    u.email,
    u.email_confirmed_at,
    u.created_at as fecha_registro,
    p.first_name,
    p.last_name,
    p.full_name,
    p.role,
    p.created_at as fecha_perfil,
    CASE 
        WHEN p.id IS NOT NULL THEN 'PERFIL CREADO'
        ELSE 'SIN PERFIL'
    END as estado
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.deleted_at IS NULL
ORDER BY u.created_at DESC;

-- 2. Resumen de usuarios por estado
SELECT 
    'Usuarios totales' as categoria,
    COUNT(*) as cantidad
FROM auth.users 
WHERE deleted_at IS NULL

UNION ALL

SELECT 
    'Usuarios confirmados' as categoria,
    COUNT(*) as cantidad
FROM auth.users 
WHERE deleted_at IS NULL AND email_confirmed_at IS NOT NULL

UNION ALL

SELECT 
    'Usuarios con perfil' as categoria,
    COUNT(*) as cantidad
FROM auth.users u
INNER JOIN profiles p ON u.id = p.id
WHERE u.deleted_at IS NULL

UNION ALL

SELECT 
    'Usuarios sin perfil' as categoria,
    COUNT(*) as cantidad
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.deleted_at IS NULL AND p.id IS NULL;

-- 3. Usuarios por rol
SELECT 
    COALESCE(p.role, 'sin_rol') as rol,
    COUNT(*) as cantidad
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.deleted_at IS NULL
GROUP BY p.role
ORDER BY cantidad DESC;
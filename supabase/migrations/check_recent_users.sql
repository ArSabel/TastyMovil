-- Consulta para verificar usuarios registrados recientemente y sus perfiles
-- Esta consulta ayuda a identificar si hay usuarios sin perfiles o problemas en el registro

-- 1. Verificar usuarios en auth.users (últimos 7 días)
SELECT 
    'auth_users' as tabla,
    id,
    email,
    email_confirmed_at,
    created_at,
    updated_at
FROM auth.users 
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;

-- 2. Verificar perfiles correspondientes
SELECT 
    'profiles' as tabla,
    p.id,
    p.first_name,
    p.last_name,
    p.cedula_ruc,
    p.phone,
    p.role,
    p.created_at,
    u.email
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.created_at >= NOW() - INTERVAL '7 days'
ORDER BY p.created_at DESC;

-- 3. Identificar usuarios sin perfil (problema principal)
SELECT 
    'usuarios_sin_perfil' as problema,
    u.id,
    u.email,
    u.email_confirmed_at,
    u.created_at as usuario_creado,
    CASE 
        WHEN p.id IS NULL THEN 'SIN PERFIL'
        ELSE 'CON PERFIL'
    END as estado_perfil
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.created_at >= NOW() - INTERVAL '7 days'
ORDER BY u.created_at DESC;

-- 4. Contar usuarios por estado
SELECT 
    'resumen_usuarios' as tipo,
    COUNT(*) as total_usuarios,
    COUNT(p.id) as con_perfil,
    COUNT(*) - COUNT(p.id) as sin_perfil
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.created_at >= NOW() - INTERVAL '7 days';

-- 5. Verificar usuarios por rol (solo los que tienen perfil)
SELECT 
    'usuarios_por_rol' as tipo,
    p.role,
    COUNT(*) as cantidad
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.created_at >= NOW() - INTERVAL '7 days'
GROUP BY p.role
ORDER BY cantidad DESC;
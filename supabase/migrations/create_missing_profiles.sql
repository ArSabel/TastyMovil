-- Migración para crear perfiles para usuarios existentes que no los tengan
-- Esto soluciona el problema de clave foránea para usuarios registrados antes de la corrección

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
  AND u.deleted_at IS NULL
  AND u.email_confirmed_at IS NOT NULL;

-- Verificar que se crearon los perfiles
SELECT 
    COUNT(*) as total_users_auth,
    (SELECT COUNT(*) FROM profiles) as total_profiles,
    COUNT(*) - (SELECT COUNT(*) FROM profiles) as missing_profiles
FROM auth.users 
WHERE deleted_at IS NULL AND email_confirmed_at IS NOT NULL;
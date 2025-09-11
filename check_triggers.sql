-- Script para verificar triggers y funciones relacionadas con facturas

-- 1. Buscar todos los triggers en la tabla facturas
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'facturas'
AND event_object_schema = 'public';

-- 2. Buscar funciones que contengan 'nombre_cliente'
SELECT 
    routine_name,
    routine_type,
    routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'public'
AND routine_definition ILIKE '%nombre_cliente%';

-- 3. Buscar todas las funciones relacionadas con facturas
SELECT 
    routine_name,
    routine_type,
    routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'public'
AND (routine_definition ILIKE '%facturas%' OR routine_name ILIKE '%factura%');

-- 4. Verificar si hay políticas RLS que puedan estar causando el problema
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'facturas';
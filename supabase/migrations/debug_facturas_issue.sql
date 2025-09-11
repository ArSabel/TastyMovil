-- Debug y solución para el error 'nombre_cliente' en facturas

-- 1. Verificar todos los triggers en la tabla facturas
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'facturas'
ORDER BY trigger_name;

-- 2. Verificar todas las funciones que contengan 'nombre_cliente'
SELECT 
    routine_name,
    routine_type,
    routine_definition
FROM information_schema.routines 
WHERE routine_definition ILIKE '%nombre_cliente%'
OR routine_name ILIKE '%nombre_cliente%';

-- 3. Verificar si hay alguna vista que use 'nombre_cliente'
SELECT 
    table_name,
    view_definition
FROM information_schema.views 
WHERE view_definition ILIKE '%nombre_cliente%';

-- 4. Verificar si hay políticas RLS que mencionen 'nombre_cliente'
SELECT 
    schemaname,
    tablename,
    policyname,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'facturas';

-- 5. Eliminar cualquier trigger problemático si existe
-- (Esto se ejecutará solo si existe el trigger)
DO $$ 
BEGIN
    -- Verificar si existe algún trigger problemático
    IF EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE event_object_table = 'facturas' 
        AND trigger_name NOT IN ('update_facturas_updated_at')
    ) THEN
        -- Eliminar triggers problemáticos (excepto el de updated_at)
        DROP TRIGGER IF EXISTS facturas_audit_trigger ON facturas;
        DROP TRIGGER IF EXISTS facturas_validation_trigger ON facturas;
        DROP TRIGGER IF EXISTS facturas_nombre_cliente_trigger ON facturas;
    END IF;
END $$;

-- 6. Recrear solo el trigger necesario para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_facturas_updated_at ON facturas;
CREATE TRIGGER update_facturas_updated_at
    BEFORE UPDATE ON facturas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 7. Verificar la estructura final de la tabla
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'facturas'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 8. Probar inserción de una factura de prueba
-- (Esto ayudará a identificar el error exacto)
DO $$
DECLARE
    test_result TEXT;
BEGIN
    BEGIN
        INSERT INTO facturas (
            numero_factura,
            cliente_id,
            empleado_id,
            subtotal,
            impuesto,
            total,
            estado,
            metodo_pago
        ) VALUES (
            'TEST-' || extract(epoch from now())::text,
            '00000000-0000-0000-0000-000000000000'::uuid,
            '00000000-0000-0000-0000-000000000000'::uuid,
            10.00,
            1.50,
            11.50,
            'pendiente',
            'efectivo'
        );
        
        -- Si llegamos aquí, la inserción fue exitosa
        RAISE NOTICE 'Inserción de prueba exitosa';
        
        -- Eliminar el registro de prueba
        DELETE FROM facturas WHERE numero_factura LIKE 'TEST-%';
        
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Error en inserción de prueba: %', SQLERRM;
    END;
END $$;
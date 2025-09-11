-- Buscar y eliminar triggers/funciones que contengan 'nombre_cliente'

-- 1. Buscar triggers en la tabla facturas
DO $$
DECLARE
    trigger_record RECORD;
BEGIN
    RAISE NOTICE '=== TRIGGERS EN TABLA FACTURAS ===';
    
    FOR trigger_record IN 
        SELECT trigger_name, event_manipulation, action_timing, action_statement
        FROM information_schema.triggers 
        WHERE event_object_table = 'facturas'
        AND event_object_schema = 'public'
    LOOP
        RAISE NOTICE 'Trigger: % - Evento: % - Timing: %', 
            trigger_record.trigger_name, 
            trigger_record.event_manipulation, 
            trigger_record.action_timing;
        RAISE NOTICE 'Acción: %', trigger_record.action_statement;
        RAISE NOTICE '---';
    END LOOP;
END $$;

-- 2. Buscar funciones que contengan 'nombre_cliente'
DO $$
DECLARE
    func_record RECORD;
BEGIN
    RAISE NOTICE '=== FUNCIONES CON "nombre_cliente" ===';
    
    FOR func_record IN 
        SELECT routine_name, routine_type
        FROM information_schema.routines 
        WHERE routine_schema = 'public'
        AND routine_definition ILIKE '%nombre_cliente%'
    LOOP
        RAISE NOTICE 'Función problemática encontrada: % (tipo: %)', 
            func_record.routine_name, 
            func_record.routine_type;
    END LOOP;
END $$;

-- 3. Eliminar trigger específico si existe (común en aplicaciones que generan triggers automáticamente)
DROP TRIGGER IF EXISTS generar_numero_factura_trigger ON facturas;
DROP TRIGGER IF EXISTS actualizar_numero_factura_trigger ON facturas;
DROP TRIGGER IF EXISTS factura_trigger ON facturas;
DROP TRIGGER IF EXISTS facturas_trigger ON facturas;

-- 4. Eliminar función problemática si existe
DROP FUNCTION IF EXISTS generar_numero_factura() CASCADE;
DROP FUNCTION IF EXISTS actualizar_factura() CASCADE;
DROP FUNCTION IF EXISTS trigger_factura() CASCADE;

-- 5. Crear un trigger correcto para generar número de factura
CREATE OR REPLACE FUNCTION generar_numero_factura_correcto()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo generar número si no se proporciona
    IF NEW.numero_factura IS NULL THEN
        NEW.numero_factura := 'FAC-' || LPAD(NEW.id::text, 6, '0');
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Crear el trigger correcto
CREATE TRIGGER generar_numero_factura_trigger
    BEFORE INSERT ON facturas
    FOR EACH ROW
    EXECUTE FUNCTION generar_numero_factura_correcto();

-- 7. Verificar que no hay más triggers problemáticos
DO $$
DECLARE
    trigger_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO trigger_count
    FROM information_schema.triggers 
    WHERE event_object_table = 'facturas'
    AND event_object_schema = 'public';
    
    RAISE NOTICE '=== RESULTADO FINAL ===';
    RAISE NOTICE 'Triggers restantes en tabla facturas: %', trigger_count;
END $$;
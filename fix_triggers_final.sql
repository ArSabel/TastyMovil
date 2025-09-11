-- Eliminación completa de todos los triggers problemáticos en facturas

-- 1. Obtener y eliminar TODOS los triggers existentes en la tabla facturas
DO $$
DECLARE
    trigger_record RECORD;
BEGIN
    RAISE NOTICE '=== ELIMINANDO TODOS LOS TRIGGERS DE FACTURAS ===';
    
    -- Buscar y eliminar cada trigger individualmente
    FOR trigger_record IN 
        SELECT trigger_name
        FROM information_schema.triggers 
        WHERE event_object_table = 'facturas'
        AND event_object_schema = 'public'
    LOOP
        RAISE NOTICE 'Eliminando trigger: %', trigger_record.trigger_name;
        EXECUTE 'DROP TRIGGER IF EXISTS ' || trigger_record.trigger_name || ' ON facturas CASCADE';
    END LOOP;
END $$;

-- 2. Eliminar todas las funciones relacionadas con facturas que puedan tener el error
DROP FUNCTION IF EXISTS generar_numero_factura() CASCADE;
DROP FUNCTION IF EXISTS actualizar_factura() CASCADE;
DROP FUNCTION IF EXISTS trigger_factura() CASCADE;
DROP FUNCTION IF EXISTS factura_numero() CASCADE;
DROP FUNCTION IF EXISTS set_numero_factura() CASCADE;
DROP FUNCTION IF EXISTS handle_factura() CASCADE;
DROP FUNCTION IF EXISTS process_factura() CASCADE;
DROP FUNCTION IF EXISTS generar_numero_factura_correcto() CASCADE;

-- 3. Crear una función simple y correcta para generar número de factura
CREATE OR REPLACE FUNCTION generate_factura_number()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo usar campos que existen en la tabla
    IF NEW.numero_factura IS NULL THEN
        NEW.numero_factura := 'FAC-' || LPAD(NEW.id::text, 6, '0');
    END IF;
    
    -- Actualizar timestamp
    NEW.updated_at := NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Crear el trigger limpio
CREATE TRIGGER facturas_auto_number
    BEFORE INSERT ON facturas
    FOR EACH ROW
    EXECUTE FUNCTION generate_factura_number();

-- 5. Crear trigger para actualizar updated_at en UPDATE
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER facturas_updated_at
    BEFORE UPDATE ON facturas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Verificación final
DO $$
DECLARE
    trigger_count INTEGER;
    trigger_record RECORD;
BEGIN
    SELECT COUNT(*) INTO trigger_count
    FROM information_schema.triggers 
    WHERE event_object_table = 'facturas'
    AND event_object_schema = 'public';
    
    RAISE NOTICE '=== VERIFICACIÓN FINAL ===';
    RAISE NOTICE 'Total de triggers en facturas: %', trigger_count;
    
    FOR trigger_record IN 
        SELECT trigger_name, event_manipulation, action_timing
        FROM information_schema.triggers 
        WHERE event_object_table = 'facturas'
        AND event_object_schema = 'public'
    LOOP
        RAISE NOTICE 'Trigger activo: % - % %', 
            trigger_record.trigger_name, 
            trigger_record.action_timing,
            trigger_record.event_manipulation;
    END LOOP;
    
    RAISE NOTICE 'Limpieza de triggers completada exitosamente.';
END $$;
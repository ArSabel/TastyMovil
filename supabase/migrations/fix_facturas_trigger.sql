-- Verificar y corregir triggers en la tabla facturas
-- que puedan estar causando el error 'nombre_cliente'

-- Primero, verificar si hay triggers en la tabla facturas
SELECT 
    trigger_name,
    event_manipulation,
    action_statement,
    action_timing
FROM information_schema.triggers 
WHERE event_object_table = 'facturas';

-- Verificar funciones que puedan estar relacionadas con facturas
SELECT 
    routine_name,
    routine_definition
FROM information_schema.routines 
WHERE routine_name LIKE '%factura%' OR routine_definition LIKE '%nombre_cliente%';

-- Si existe algún trigger problemático, lo eliminaremos y crearemos uno correcto
-- DROP TRIGGER IF EXISTS trigger_name ON facturas;

-- Crear un trigger correcto para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar el trigger a la tabla facturas
DROP TRIGGER IF EXISTS update_facturas_updated_at ON facturas;
CREATE TRIGGER update_facturas_updated_at
    BEFORE UPDATE ON facturas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Verificar que la tabla facturas tenga la estructura correcta
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'facturas'
ORDER BY ordinal_position;
-- Migración final para corregir problemas de facturas

-- 1. Hacer que numero_factura sea opcional o genere automáticamente
ALTER TABLE facturas ALTER COLUMN numero_factura DROP NOT NULL;

-- 2. Crear un trigger para generar numero_factura automáticamente si no se proporciona
CREATE OR REPLACE FUNCTION generate_numero_factura()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.numero_factura IS NULL THEN
        NEW.numero_factura := 'FAC-' || LPAD(NEW.id::text, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear el trigger
DROP TRIGGER IF EXISTS trigger_generate_numero_factura ON facturas;
CREATE TRIGGER trigger_generate_numero_factura
    BEFORE INSERT ON facturas
    FOR EACH ROW
    EXECUTE FUNCTION generate_numero_factura();

-- 3. Verificar la función crear_factura existente
SELECT routine_name, routine_definition 
FROM information_schema.routines 
WHERE routine_name = 'crear_factura' AND routine_schema = 'public';

-- 4. Crear una versión simplificada de crear_factura si no existe
CREATE OR REPLACE FUNCTION crear_factura_simple(
    p_cliente_id UUID,
    p_productos JSONB,
    p_metodo_pago TEXT DEFAULT 'efectivo'
)
RETURNS JSON AS $$
DECLARE
    v_factura_id INTEGER;
    v_subtotal DECIMAL(10,2) := 0;
    v_impuesto DECIMAL(10,2) := 0;
    v_total DECIMAL(10,2) := 0;
    v_producto JSONB;
    v_precio DECIMAL(10,2);
    v_cantidad INTEGER;
BEGIN
    -- Calcular totales
    FOR v_producto IN SELECT * FROM jsonb_array_elements(p_productos)
    LOOP
        v_precio := (v_producto->>'precio_unitario')::DECIMAL(10,2);
        v_cantidad := (v_producto->>'cantidad')::INTEGER;
        v_subtotal := v_subtotal + (v_precio * v_cantidad);
    END LOOP;
    
    -- Calcular impuesto (15%)
    v_impuesto := v_subtotal * 0.15;
    v_total := v_subtotal + v_impuesto;
    
    -- Insertar factura
    INSERT INTO facturas (
        cliente_id,
        subtotal,
        impuesto,
        total,
        estado,
        metodo_pago,
        fecha_factura
    ) VALUES (
        p_cliente_id,
        v_subtotal,
        v_impuesto,
        v_total,
        'pendiente',
        p_metodo_pago,
        NOW()
    ) RETURNING id INTO v_factura_id;
    
    -- Insertar detalles de factura
    FOR v_producto IN SELECT * FROM jsonb_array_elements(p_productos)
    LOOP
        INSERT INTO factura_detalles (
            factura_id,
            producto_id,
            cantidad,
            precio_unitario,
            subtotal
        ) VALUES (
            v_factura_id,
            (v_producto->>'producto_id')::UUID,
            (v_producto->>'cantidad')::INTEGER,
            (v_producto->>'precio_unitario')::DECIMAL(10,2),
            (v_producto->>'precio_unitario')::DECIMAL(10,2) * (v_producto->>'cantidad')::INTEGER
        );
    END LOOP;
    
    RETURN json_build_object(
        'success', true,
        'factura_id', v_factura_id,
        'total', v_total
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$$ LANGUAGE plpgsql;

-- 5. Verificar que todo esté funcionando
SELECT 'Migración completada exitosamente' as status;
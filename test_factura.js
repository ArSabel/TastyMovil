// Script de prueba para verificar la creación de facturas
const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = 'https://mrzditusihzyomgxfzdh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yemRpdHVzaWh6eW9tZ3hmemRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMTYwMDIsImV4cCI6MjA2NzY5MjAwMn0.j9WLQw810MzaX5ojZvHvMFbvaq6KGxFr3pGukWixLCw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function obtenerClienteExistente() {
  console.log('👤 Buscando cliente existente...');
  
  try {
    // Buscar cualquier cliente existente
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, role')
      .eq('role', 'customer')
      .limit(1);
    
    if (error) {
      console.error('❌ Error al buscar cliente:', error.message);
      return null;
    }
    
    if (data && data.length > 0) {
      console.log('✅ Cliente encontrado:', data[0]);
      return data[0].id;
    }
    
    // Si no hay clientes customer, buscar cualquier perfil
    const { data: anyProfile, error: anyError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, role')
      .limit(1);
    
    if (anyError) {
      console.error('❌ Error al buscar perfil:', anyError.message);
      return null;
    }
    
    if (anyProfile && anyProfile.length > 0) {
      console.log('✅ Perfil encontrado:', anyProfile[0]);
      return anyProfile[0].id;
    }
    
    console.log('⚠️  No se encontraron perfiles en la base de datos');
    return null;
    
  } catch (err) {
    console.error('💥 Error inesperado:', err.message);
    return null;
  }
}

async function testCrearFactura(clienteId) {
  console.log('\n🧪 Iniciando prueba de creación de factura...');
  
  try {
    // Datos de prueba para la factura
    const facturaData = {
      cliente_id: clienteId,
      subtotal: 10.00,
      impuesto: 1.50,
      total: 11.50,
      estado: 'pendiente',
      metodo_pago: 'efectivo'
    };
    
    console.log('📝 Datos de la factura:', facturaData);
    
    // Intentar crear la factura directamente
    const { data, error } = await supabase
      .from('facturas')
      .insert([facturaData])
      .select();
    
    if (error) {
      console.error('❌ Error al crear factura:', error.message);
      console.error('Detalles del error:', error);
      return false;
    }
    
    console.log('✅ Factura creada exitosamente:', data);
    console.log('📄 Número de factura generado:', data[0].numero_factura);
    return true;
    
  } catch (err) {
    console.error('💥 Error inesperado:', err.message);
    return false;
  }
}

async function testCrearFacturaConFuncion(clienteId) {
  console.log('\n🔧 Probando función crear_factura_simple...');
  
  try {
    // Probar la función crear_factura_simple
    const { data, error } = await supabase.rpc('crear_factura_simple', {
      p_cliente_id: clienteId,
      p_productos: [
        {
          producto_id: '550e8400-e29b-41d4-a716-446655440000',
          cantidad: 2,
          precio_unitario: 5.00
        }
      ],
      p_metodo_pago: 'efectivo'
    });
    
    if (error) {
      console.error('❌ Error en función crear_factura_simple:', error.message);
      console.error('Detalles del error:', error);
      return false;
    }
    
    console.log('✅ Función crear_factura_simple ejecutada exitosamente:', data);
    
    if (data && data.success) {
      console.log('🎯 Factura ID:', data.factura_id);
      console.log('💰 Total:', data.total);
      return true;
    } else {
      console.error('❌ La función retornó error:', data.error);
      return false;
    }
    
  } catch (err) {
    console.error('💥 Error inesperado en función:', err.message);
    return false;
  }
}

async function testSinCliente() {
  console.log('\n🧪 Probando creación de factura sin cliente válido...');
  
  try {
    // Usar un UUID ficticio para probar el comportamiento
    const facturaData = {
      cliente_id: '123e4567-e89b-12d3-a456-426614174000',
      subtotal: 10.00,
      impuesto: 1.50,
      total: 11.50,
      estado: 'pendiente',
      metodo_pago: 'efectivo'
    };
    
    const { data, error } = await supabase
      .from('facturas')
      .insert([facturaData])
      .select();
    
    if (error) {
      if (error.code === '23503') {
        console.log('✅ Error de foreign key detectado correctamente:', error.message);
        console.log('✅ Esto confirma que el error "nombre_cliente" ya no existe');
        return true;
      } else {
        console.error('❌ Error inesperado:', error.message);
        return false;
      }
    }
    
    console.log('⚠️  La factura se creó sin validar el cliente (esto no debería pasar)');
    return false;
    
  } catch (err) {
    console.error('💥 Error inesperado:', err.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Ejecutando pruebas de facturación...');
  console.log('=' .repeat(50));
  
  // Buscar cliente existente
  const clienteId = await obtenerClienteExistente();
  
  let test1 = false;
  let test2 = false;
  
  if (clienteId) {
    test1 = await testCrearFactura(clienteId);
    test2 = await testCrearFacturaConFuncion(clienteId);
  } else {
    console.log('⚠️  No hay clientes en la base de datos. Probando comportamiento de error...');
  }
  
  // Probar sin cliente válido para confirmar que el error "nombre_cliente" ya no existe
  const test3 = await testSinCliente();
  
  console.log('\n📊 Resultados:');
  console.log('=' .repeat(50));
  
  if (clienteId) {
    console.log(`Inserción directa: ${test1 ? '✅ PASÓ' : '❌ FALLÓ'}`);
    console.log(`Función crear_factura_simple: ${test2 ? '✅ PASÓ' : '❌ FALLÓ'}`);
  }
  
  console.log(`Verificación error "nombre_cliente": ${test3 ? '✅ RESUELTO' : '❌ PERSISTE'}`);
  
  if (test3) {
    console.log('\n🎉 ¡ÉXITO! El error "nombre_cliente" ha sido eliminado exitosamente.');
    console.log('✨ Ahora el sistema muestra errores de foreign key normales, no el error "nombre_cliente".');
    console.log('🔧 La aplicación móvil debería funcionar correctamente para crear facturas.');
  } else {
    console.log('\n⚠️  El error "nombre_cliente" podría persistir. Revisar configuración.');
  }
}

// Ejecutar las pruebas
runTests().catch(console.error);
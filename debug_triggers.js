// Script para debuggear triggers y funciones que causan el error 'nombre_cliente'
const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabaseUrl = 'https://mrzditusihzyomgxfzdh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yemRpdHVzaWh6eW9tZ3hmemRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMTYwMDIsImV4cCI6MjA2NzY5MjAwMn0.j9WLQw810MzaX5ojZvHvMFbvaq6KGxFr3pGukWixLCw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTriggers() {
  console.log('🔍 Buscando triggers en la tabla facturas...');
  
  try {
    const { data, error } = await supabase.rpc('sql', {
      query: `
        SELECT 
          trigger_name,
          event_manipulation,
          action_timing,
          action_statement
        FROM information_schema.triggers 
        WHERE event_object_table = 'facturas'
        AND event_object_schema = 'public';
      `
    });
    
    if (error) {
      console.error('❌ Error al buscar triggers:', error.message);
      return;
    }
    
    if (data && data.length > 0) {
      console.log('📋 Triggers encontrados:');
      data.forEach((trigger, index) => {
        console.log(`\n${index + 1}. ${trigger.trigger_name}`);
        console.log(`   Evento: ${trigger.event_manipulation}`);
        console.log(`   Timing: ${trigger.action_timing}`);
        console.log(`   Acción: ${trigger.action_statement}`);
      });
    } else {
      console.log('✅ No se encontraron triggers en la tabla facturas');
    }
    
  } catch (err) {
    console.error('💥 Error inesperado:', err.message);
  }
}

async function checkFunctionsWithNombreCliente() {
  console.log('\n🔍 Buscando funciones que contengan "nombre_cliente"...');
  
  try {
    const { data, error } = await supabase.rpc('sql', {
      query: `
        SELECT 
          routine_name,
          routine_type,
          LEFT(routine_definition, 500) as routine_definition_preview
        FROM information_schema.routines 
        WHERE routine_schema = 'public'
        AND routine_definition ILIKE '%nombre_cliente%';
      `
    });
    
    if (error) {
      console.error('❌ Error al buscar funciones:', error.message);
      return;
    }
    
    if (data && data.length > 0) {
      console.log('🚨 Funciones que contienen "nombre_cliente":');
      data.forEach((func, index) => {
        console.log(`\n${index + 1}. ${func.routine_name} (${func.routine_type})`);
        console.log(`   Definición (preview): ${func.routine_definition_preview}...`);
      });
    } else {
      console.log('✅ No se encontraron funciones que contengan "nombre_cliente"');
    }
    
  } catch (err) {
    console.error('💥 Error inesperado:', err.message);
  }
}

async function checkFacturaFunctions() {
  console.log('\n🔍 Buscando todas las funciones relacionadas con facturas...');
  
  try {
    const { data, error } = await supabase.rpc('sql', {
      query: `
        SELECT 
          routine_name,
          routine_type
        FROM information_schema.routines 
        WHERE routine_schema = 'public'
        AND (routine_definition ILIKE '%facturas%' OR routine_name ILIKE '%factura%');
      `
    });
    
    if (error) {
      console.error('❌ Error al buscar funciones de facturas:', error.message);
      return;
    }
    
    if (data && data.length > 0) {
      console.log('📋 Funciones relacionadas con facturas:');
      data.forEach((func, index) => {
        console.log(`${index + 1}. ${func.routine_name} (${func.routine_type})`);
      });
    } else {
      console.log('✅ No se encontraron funciones relacionadas con facturas');
    }
    
  } catch (err) {
    console.error('💥 Error inesperado:', err.message);
  }
}

async function checkRLSPolicies() {
  console.log('\n🔍 Verificando políticas RLS en la tabla facturas...');
  
  try {
    const { data, error } = await supabase.rpc('sql', {
      query: `
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
      `
    });
    
    if (error) {
      console.error('❌ Error al buscar políticas RLS:', error.message);
      return;
    }
    
    if (data && data.length > 0) {
      console.log('📋 Políticas RLS encontradas:');
      data.forEach((policy, index) => {
        console.log(`\n${index + 1}. ${policy.policyname}`);
        console.log(`   Comando: ${policy.cmd}`);
        console.log(`   Roles: ${policy.roles}`);
        console.log(`   Condición: ${policy.qual}`);
        console.log(`   With Check: ${policy.with_check}`);
      });
    } else {
      console.log('✅ No se encontraron políticas RLS en la tabla facturas');
    }
    
  } catch (err) {
    console.error('💥 Error inesperado:', err.message);
  }
}

async function runDebug() {
  console.log('🚀 Iniciando debug del error "nombre_cliente"...');
  console.log('=' .repeat(60));
  
  await checkTriggers();
  await checkFunctionsWithNombreCliente();
  await checkFacturaFunctions();
  await checkRLSPolicies();
  
  console.log('\n🏁 Debug completado.');
}

// Ejecutar el debug
runDebug().catch(console.error);
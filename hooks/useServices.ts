import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Interfaces para el nuevo esquema de facturación
export interface Seccion {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
  orden: number;
  created_at: string;
  updated_at: string;
}

export interface Producto {
  id: number;
  seccion_id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
  activo: boolean;
  orden: number;
  created_at: string;
  updated_at: string;
  seccion?: Seccion;
  stock_actual?: number;
}

export interface StockDiario {
  id: number;
  producto_id: number;
  fecha: string;
  cantidad_inicial: number;
  cantidad_actual: number;
  cantidad_vendida: number;
  created_at: string;
  updated_at: string;
  producto?: Producto;
}

export interface Factura {
  id: number;
  numero_factura: string;
  cliente_id: string;
  empleado_id: string;
  subtotal: number;
  impuesto: number;
  descuento: number;
  total: number;
  estado: 'pendiente' | 'pagado' | 'cancelado';
  metodo_pago: 'efectivo' | 'tarjeta' | 'transferencia';
  notas: string;
  fecha_factura: string;
  created_at: string;
  updated_at: string;
  detalles?: FacturaDetalle[];
}

export interface FacturaDetalle {
  id: number;
  factura_id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  precio_total: number;
  created_at: string;
  producto?: Producto;
}

export interface CartItem {
  producto: Producto;
  cantidad: number;
}

// Hook para obtener secciones
export const useSecciones = () => {
  const [secciones, setSecciones] = useState<Seccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSecciones = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('secciones')
        .select('*')
        .eq('activo', true)
        .order('orden', { ascending: true });

      if (error) throw error;
      setSecciones(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching secciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecciones();
  }, []);

  return {
    secciones,
    loading,
    error,
    refetch: fetchSecciones,
  };
};

// Hook para obtener productos por sección
export const useProductos = (seccionId?: number) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('productos')
        .select(`
          *,
          seccion:secciones(*)
        `)
        .eq('activo', true)
        .order('orden', { ascending: true });

      if (seccionId) {
        query = query.eq('seccion_id', seccionId);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Obtener stock actual para cada producto
      const productosConStock = await Promise.all(
        (data || []).map(async (producto) => {
          const { data: stockData } = await supabase
            .from('stock_diario')
            .select('cantidad_actual')
            .eq('producto_id', producto.id)
            .eq('fecha', new Date().toISOString().split('T')[0])
            .single();
          
          return {
            ...producto,
            stock_actual: stockData?.cantidad_actual || 0
          };
        })
      );
      
      setProductos(productosConStock);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, [seccionId]);

  return {
    productos,
    loading,
    error,
    refetch: fetchProductos,
  };
};

// Hook para obtener stock diario
export const useStockDiario = (fecha?: string) => {
  const [stock, setStock] = useState<StockDiario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStock = async () => {
    try {
      setLoading(true);
      const fechaConsulta = fecha || new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('stock_diario')
        .select(`
          *,
          producto:productos(
            *,
            seccion:secciones(*)
          )
        `)
        .eq('fecha', fechaConsulta)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStock(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching stock');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, [fecha]);

  return {
    stock,
    loading,
    error,
    refetch: fetchStock,
  };
};

// Hook para obtener facturas
export const useFacturas = (clienteId?: string) => {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFacturas = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('facturas')
        .select(`
          *,
          detalles:factura_detalles(
            *,
            producto:productos(*)
          )
        `)
        .order('fecha_factura', { ascending: false });

      if (clienteId) {
        query = query.eq('cliente_id', clienteId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setFacturas(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching facturas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacturas();
  }, [clienteId]);

  return {
    facturas,
    loading,
    error,
    refetch: fetchFacturas,
  };
};

// Hook para crear una nueva factura
export const useCreateFactura = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createFactura = async (facturaData: {
    cliente_id: string;
    empleado_id: string;
    productos: {
      producto_id: number;
      cantidad: number;
      precio_unitario: number;
    }[];
    metodo_pago: 'efectivo' | 'tarjeta' | 'transferencia';
    notas?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      // Generar número de factura único
      const generateFacturaNumber = async (): Promise<string> => {
        const today = new Date();
        const datePrefix = today.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
        
        // Buscar el último número de factura del día
        const { data: lastFactura, error: searchError } = await supabase
          .from('facturas')
          .select('numero_factura')
          .like('numero_factura', `${datePrefix}-%`)
          .order('numero_factura', { ascending: false })
          .limit(1);

        if (searchError) {
          console.warn('Error searching for last factura number:', searchError);
        }

        let nextNumber = 1;
        if (lastFactura && lastFactura.length > 0) {
          const lastNumber = lastFactura[0].numero_factura.split('-')[1];
          nextNumber = parseInt(lastNumber) + 1;
        }

        return `${datePrefix}-${nextNumber.toString().padStart(4, '0')}`;
      };

      const numeroFactura = await generateFacturaNumber();

      // Calcular totales
      const subtotal = facturaData.productos.reduce(
        (sum, item) => sum + (item.precio_unitario * item.cantidad), 0
      );
      const impuesto = subtotal * 0.12; // 12% IVA
      const total = subtotal + impuesto;

      // Crear factura
      const { data: factura, error: facturaError } = await supabase
        .from('facturas')
        .insert({
          numero_factura: numeroFactura,
          cliente_id: facturaData.cliente_id,
          empleado_id: facturaData.empleado_id,
          subtotal,
          impuesto,
          descuento: 0,
          total,
          estado: 'pendiente',
          metodo_pago: facturaData.metodo_pago,
          notas: facturaData.notas || ''
        })
        .select()
        .single();

      if (facturaError) {
        console.error('Error creating factura:', facturaError);
        throw new Error(`Error al crear la factura: ${facturaError.message}`);
      }

      // Crear detalles de factura
      const detalles = facturaData.productos.map(item => ({
        factura_id: factura.id,
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        precio_total: item.precio_unitario * item.cantidad
      }));

      const { error: detallesError } = await supabase
        .from('factura_detalles')
        .insert(detalles);

      if (detallesError) {
        console.error('Error creating factura details:', detallesError);
        throw new Error(`Error al crear los detalles de la factura: ${detallesError.message}`);
      }

      // Crear registros de ventas
      const ventas = facturaData.productos.map(item => ({
        factura_id: factura.id,
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        precio_total: item.precio_unitario * item.cantidad
      }));

      const { error: ventasError } = await supabase
        .from('ventas')
        .insert(ventas);

      if (ventasError) {
        console.error('Error creating sales records:', ventasError);
        throw new Error(`Error al crear los registros de ventas: ${ventasError.message}`);
      }

      return factura;
    } catch (err) {
      let errorMessage = 'Error desconocido al crear la factura';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      console.error('CreateFactura error:', err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    createFactura,
    loading,
    error,
  };
};

// Hook para obtener productos destacados (más vendidos) con stock disponible
export const useProductosDestacados = (limit: number = 5) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductosDestacados = async () => {
    try {
      setLoading(true);
      const fechaActual = new Date().toISOString().split('T')[0];
      
      // Primero obtenemos los productos más vendidos
      // Obtenemos las ventas sin usar group by
      const { data: ventasData, error: ventasError } = await supabase
        .from('ventas')
        .select('producto_id, cantidad')
        .gt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Últimos 30 días
        .order('cantidad', { ascending: false })
        .limit(limit * 10) // Obtenemos más productos para agrupar manualmente

      if (ventasError) throw ventasError;
      
      // Agrupamos manualmente por producto_id y sumamos las cantidades
      const ventasAgrupadas = ventasData ? ventasData.reduce((acc: {producto_id: string, sum: number}[], venta: {producto_id: string, cantidad: number}) => {
        const existingIndex = acc.findIndex(item => item.producto_id === venta.producto_id);
        if (existingIndex >= 0) {
          acc[existingIndex].sum += venta.cantidad;
        } else {
          acc.push({ producto_id: venta.producto_id, sum: venta.cantidad });
        }
        return acc;
      }, []).sort((a, b) => b.sum - a.sum).slice(0, limit * 3) : [];
      
      if (!ventasAgrupadas || ventasAgrupadas.length === 0) {
        // Si no hay ventas, obtenemos algunos productos activos
        const { data: productosData, error: productosError } = await supabase
          .from('productos')
          .select('*')
          .eq('activo', true)
          .order('orden', { ascending: true })
          .limit(limit * 3);

        if (productosError) throw productosError;
        
        // Para cada producto, obtenemos su stock actual
        const productosConStock = await Promise.all(
          (productosData || []).map(async (producto) => {
            const { data: stockData } = await supabase
              .from('stock_diario')
              .select('cantidad_actual')
              .eq('producto_id', producto.id)
              .eq('fecha', fechaActual)
              .single();
            
            return {
              ...producto,
              stock_actual: stockData?.cantidad_actual || 0
            };
          })
        );
        
        // Filtramos solo productos con stock disponible
        const productosDisponibles = productosConStock.filter(p => p.stock_actual > 0);
        setProductos(productosDisponibles.slice(0, limit));
      } else {
        // Si hay ventas, obtenemos los detalles de los productos más vendidos
        const productosIds = ventasAgrupadas.map((v: { producto_id: string }) => v.producto_id);
        
        const { data: productosData, error: productosError } = await supabase
          .from('productos')
          .select('*')
          .in('id', productosIds)
          .eq('activo', true);

        if (productosError) throw productosError;
        
        // Para cada producto, obtenemos su stock actual
        const productosConStock = await Promise.all(
          (productosData || []).map(async (producto) => {
            const { data: stockData } = await supabase
              .from('stock_diario')
              .select('cantidad_actual')
              .eq('producto_id', producto.id)
              .eq('fecha', fechaActual)
              .single();
            
            return {
              ...producto,
              stock_actual: stockData?.cantidad_actual || 0
            };
          })
        );
        
        // Filtramos solo productos con stock disponible
        const productosDisponibles = productosConStock.filter(p => p.stock_actual > 0);
        
        // Ordenamos según el orden original de ventas agrupadas
        const productosOrdenados = productosDisponibles.sort((a, b) => {
          const indexA = ventasAgrupadas.findIndex((v: { producto_id: string }) => v.producto_id === a.id);
          const indexB = ventasAgrupadas.findIndex((v: { producto_id: string }) => v.producto_id === b.id);
          return indexA - indexB;
        });
        
        setProductos(productosOrdenados.slice(0, limit));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching productos destacados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductosDestacados();
  }, [limit]);

  return {
    productos,
    loading,
    error,
    refetch: fetchProductosDestacados,
  };
};

// Hook para actualizar stock
export const useUpdateStock = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStock = async (productoId: number, cantidadInicial: number) => {
    try {
      setLoading(true);
      setError(null);

      const fecha = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('stock_diario')
        .upsert({
          producto_id: productoId,
          fecha,
          cantidad_inicial: cantidadInicial,
          cantidad_actual: cantidadInicial,
          cantidad_vendida: 0
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating stock';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    updateStock,
    loading,
    error,
  };
};
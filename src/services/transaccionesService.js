import { supabase } from './supabaseClient'

export async function crearTransaccion({ categoria_id, subcategoria_id, monto, fecha, descripcion, tipo }) {
  const { data: usuario } = await supabase.auth.getUser()
  if (!usuario?.user) throw new Error('No hay sesión activa')

  if (!(monto > 0)) throw new Error('El monto debe ser mayor a cero')

  const { data, error } = await supabase
    .from('transacciones')
    .insert([{
      usuario_id: usuario.user.id,
      categoria_id,
      subcategoria_id: subcategoria_id || null,
      monto,
      fecha,
      descripcion: descripcion || null,
      tipo
    }])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function editarTransaccion(id, cambios) {
  const { data, error } = await supabase
    .from('transacciones')
    .update(cambios)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function eliminarTransaccion(id) {
  const { error } = await supabase.from('transacciones').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function obtenerTransaccionesPorFecha(fecha) {
  const { data, error } = await supabase
    .from('transacciones')
    .select('*, categorias(nombre), subcategorias(nombre)')
    .eq('fecha', fecha)
    .order('creado_en', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function obtenerTransaccionesPorRango(fechaInicio, fechaFin) {
  const { data, error } = await supabase
    .from('transacciones')
    .select('*, categorias(nombre), subcategorias(nombre)')
    .gte('fecha', fechaInicio)
    .lte('fecha', fechaFin)
    .order('fecha', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function obtenerResumenMensual(anio, mes) {
  const inicio = `${anio}-${String(mes).padStart(2, '0')}-01`
  const ultimoDia = new Date(anio, mes, 0).getDate()
  const fin = `${anio}-${String(mes).padStart(2, '0')}-${ultimoDia}`

  const data = await obtenerTransaccionesPorRango(inicio, fin)

  const totalIngresos = data.filter(t => t.tipo === 'ingreso').reduce((s, t) => s + Number(t.monto), 0)
  const totalGastos = data.filter(t => t.tipo === 'gasto').reduce((s, t) => s + Number(t.monto), 0)

  const porCategoria = {}
  for (const t of data) {
    const nombre = t.categorias?.nombre || 'Sin categoría'
    porCategoria[nombre] = (porCategoria[nombre] || 0) + Number(t.monto)
  }

  return {
    totalIngresos,
    totalGastos,
    balance: totalIngresos - totalGastos,
    porCategoria,
    transacciones: data
  }
}
export async function eliminarTodasTransacciones() {
  const { data: usuario } = await supabase.auth.getUser()
  if (!usuario?.user) throw new Error('No hay sesión activa')

  const { error } = await supabase
    .from('transacciones')
    .delete()
    .eq('usuario_id', usuario.user.id)

  if (error) throw new Error(error.message)
}

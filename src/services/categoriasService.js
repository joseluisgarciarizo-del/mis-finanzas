import { supabase } from './supabaseClient'

export async function obtenerCategorias() {
  const { data, error } = await supabase
    .from('categorias')
    .select('*, subcategorias(*)')
    .order('nombre', { ascending: true })

  if (error) throw new Error(error.message)
  return data
}

export async function crearCategoria({ nombre, tipo }) {
  const { data: usuario } = await supabase.auth.getUser()
  if (!usuario?.user) throw new Error('No hay sesión activa')

  const { data, error } = await supabase
    .from('categorias')
    .insert([{ nombre, tipo, usuario_id: usuario.user.id }])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function editarCategoria(id, cambios) {
  const { data, error } = await supabase
    .from('categorias')
    .update(cambios)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function eliminarCategoria(id) {
  const { error } = await supabase.from('categorias').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function crearSubcategoria({ categoria_id, nombre }) {
  const { data, error } = await supabase
    .from('subcategorias')
    .insert([{ categoria_id, nombre }])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function eliminarSubcategoria(id) {
  const { error } = await supabase.from('subcategorias').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

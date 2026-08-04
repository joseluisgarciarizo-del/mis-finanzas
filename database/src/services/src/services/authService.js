import { supabase } from './supabaseClient'

export async function registrarse(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw new Error(error.message)
  return data
}

export async function iniciarSesion(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)
  return data
}

export async function cerrarSesion() {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(error.message)
}

export async function obtenerUsuarioActual() {
  const { data, error } = await supabase.auth.getUser()
  if (error) throw new Error(error.message)
  return data.user
}

export function suscribirseACambiosDeSesion(callback) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session)
  })
  return data.subscription
}

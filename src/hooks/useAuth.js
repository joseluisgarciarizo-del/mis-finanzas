import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import { suscribirseACambiosDeSesion } from '../services/authService'

export function useAuth() {
  const [sesion, setSesion] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSesion(data.session)
      setCargando(false)
    })

    const subscription = suscribirseACambiosDeSesion((nuevaSesion) => {
      setSesion(nuevaSesion)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { sesion, cargando, usuario: sesion?.user ?? null }
}

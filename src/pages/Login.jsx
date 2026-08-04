import { useState } from 'react'
import { iniciarSesion, registrarse } from '../services/authService'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [modoRegistro, setModoRegistro] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function manejarEnvio(e) {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      if (modoRegistro) {
        await registrarse(email, password)
        setError('Cuenta creada. Revisa tu correo para confirmar (si aplica) e inicia sesión.')
      } else {
        await iniciarSesion(email, password)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="pantalla-centrada">
      <form onSubmit={manejarEnvio} className="tarjeta">
        <h1>{modoRegistro ? 'Crear cuenta' : 'Iniciar sesión'}</h1>

        <label>
          Correo
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </label>

        {error && <p className="mensaje-error">{error}</p>}

        <button type="submit" disabled={cargando}>
          {cargando ? 'Un momento...' : modoRegistro ? 'Registrarme' : 'Entrar'}
        </button>

        <button
          type="button"
          className="enlace"
          onClick={() => setModoRegistro(!modoRegistro)}
        >
          {modoRegistro ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
        </button>
      </form>
    </div>
  )
}

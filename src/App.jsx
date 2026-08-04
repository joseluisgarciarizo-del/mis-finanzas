import { useAuth } from './hooks/useAuth'
import Login from './pages/Login'
import Panel from './pages/Panel'

export default function App() {
  const { sesion, cargando } = useAuth()

  if (cargando) {
    return <div className="pantalla-centrada"><p>Cargando...</p></div>
  }

  return sesion ? <Panel /> : <Login />
}

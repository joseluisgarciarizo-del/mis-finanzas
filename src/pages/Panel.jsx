import { useEffect, useState, useCallback } from 'react'
import { cerrarSesion } from '../services/authService'
import { eliminarTodasTransacciones } from '../services/transaccionesService'
import { eliminarTodasCategorias } from '../services/categoriasService'
import { obtenerCategorias } from '../services/categoriasService'
import { obtenerTransaccionesPorFecha, obtenerResumenMensual } from '../services/transaccionesService'
import FormularioTransaccion from '../components/FormularioTransaccion'
import ListaTransacciones from '../components/ListaTransacciones'
import GestorCategorias from '../components/GestorCategorias'
import ResumenMensual from '../components/ResumenMensual'
import ListaTransaccionesMes from '../components/ListaTransaccionesMes'

const hoy = new Date()

export default function Panel() {
  const [pestana, setPestana] = useState('dia') // 'dia' | 'mes' | 'categorias'
  const [categorias, setCategorias] = useState([])
  const [fechaSeleccionada, setFechaSeleccionada] = useState(hoy.toISOString().slice(0, 10))
  const [transaccionesDia, setTransaccionesDia] = useState([])
  const [resumenMes, setResumenMes] = useState(null)
  const [mesSeleccionado, setMesSeleccionado] = useState(hoy.getMonth() + 1)
  const [anioSeleccionado, setAnioSeleccionado] = useState(hoy.getFullYear())
  const [error, setError] = useState('')

  const cargarCategorias = useCallback(async () => {
    try {
      setCategorias(await obtenerCategorias())
    } catch (err) {
      setError(err.message)
    }
  }, [])

  const cargarTransaccionesDia = useCallback(async () => {
    try {
      setTransaccionesDia(await obtenerTransaccionesPorFecha(fechaSeleccionada))
    } catch (err) {
      setError(err.message)
    }
  }, [fechaSeleccionada])

  const cargarResumenMes = useCallback(async () => {
    try {
      setResumenMes(await obtenerResumenMensual(anioSeleccionado, mesSeleccionado))
    } catch (err) {
      setError(err.message)
    }
  }, [anioSeleccionado, mesSeleccionado])

  useEffect(() => { cargarCategorias() }, [cargarCategorias])
  useEffect(() => { if (pestana === 'dia') cargarTransaccionesDia() }, [pestana, cargarTransaccionesDia])
  useEffect(() => { if (pestana === 'mes') cargarResumenMes() }, [pestana, cargarResumenMes])

  return (
    <div className="panel">
      <header className="encabezado-panel">
        <h1>Mis Finanzas</h1>
        <button onClick={cerrarSesion} className="enlace">Cerrar sesión</button>
      </header>

      <nav className="pestanas">
        <button className={pestana === 'dia' ? 'activo' : ''} onClick={() => setPestana('dia')}>Día</button>
        <button className={pestana === 'mes' ? 'activo' : ''} onClick={() => setPestana('mes')}>Mes</button>
        <button className={pestana === 'categorias' ? 'activo' : ''} onClick={() => setPestana('categorias')}>Categorías</button>
      </nav>

      {error && <p className="mensaje-error">{error}</p>}

      {pestana === 'dia' && (
        <>
          <input
            type="date"
            value={fechaSeleccionada}
            onChange={(e) => setFechaSeleccionada(e.target.value)}
            className="selector-fecha"
          />
          <FormularioTransaccion categorias={categorias} onGuardado={cargarTransaccionesDia} />
          <ListaTransacciones transacciones={transaccionesDia} onCambio={cargarTransaccionesDia} />
        </>
      )}

      {pestana === 'mes' && (
        <>
          <div className="fila-formulario">
            <select value={mesSeleccionado} onChange={(e) => setMesSeleccionado(Number(e.target.value))}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <input
              type="number"
              value={anioSeleccionado}
              onChange={(e) => setAnioSeleccionado(Number(e.target.value))}
            />
          </div>
          <ResumenMensual resumen={resumenMes} />
          <ListaTransaccionesMes transacciones={resumenMes?.transacciones} />
        </>
      )}

      {pestana === 'categorias' && (
        <GestorCategorias categorias={categorias} onCambio={cargarCategorias} />
      )}
    </div>
  )
}

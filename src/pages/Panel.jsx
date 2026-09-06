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
const NOMBRES_MES = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

export default function Panel() {
  const [pestana, setPestana] = useState('dia') // 'dia' | 'mes' | 'categorias'
  const [categorias, setCategorias] = useState([])
  const [fechaSeleccionada, setFechaSeleccionada] = useState(hoy.toISOString().slice(0, 10))
  const [transaccionesDia, setTransaccionesDia] = useState([])
  const [resumenMes, setResumenMes] = useState(null)
  const [mesSeleccionado, setMesSeleccionado] = useState(hoy.getMonth() + 1)
  const [anioSeleccionado, setAnioSeleccionado] = useState(hoy.getFullYear())
  const [error, setError] = useState('')
  const [transaccionEditando, setTransaccionEditando] = useState(null)

  async function handleBorrarTodo() {
    const pin = window.prompt('Ingresa el PIN para borrar todos los datos:')
    if (pin === null) return
    if (pin !== '7451') {
      alert('PIN incorrecto')
      return
    }
    const confirmar = window.confirm('¿Seguro que quieres borrar TODOS los datos? Esta acción no se puede deshacer.')
    if (!confirmar) return
    try {
      await eliminarTodasTransacciones()
      await eliminarTodasCategorias()
      alert('Todos los datos fueron borrados.')
      window.location.reload()
    } catch (err) {
      alert('Error al borrar: ' + err.message)
    }
  }

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

  function manejarGuardadoDia() {
    cargarTransaccionesDia()
    cargarResumenMes()
  }

  function exportarReporte() {
    window.print()
  }

  return (
    <div className="panel">
      <header className="encabezado-panel no-imprimir">
        <h1>Mis Finanzas</h1>
        <button onClick={cerrarSesion} className="enlace">Cerrar sesión</button>
        <button onClick={handleBorrarTodo} className="enlace">Borrar todos los datos</button>
      </header>

      <nav className="pestanas no-imprimir">
        <button className={pestana === 'dia' ? 'activo' : ''} onClick={() => setPestana('dia')}>Día</button>
        <button className={pestana === 'mes' ? 'activo' : ''} onClick={() => setPestana('mes')}>Mes</button>
        <button className={pestana === 'categorias' ? 'activo' : ''} onClick={() => setPestana('categorias')}>Categorías</button>
      </nav>

      {error && <p className="mensaje-error no-imprimir">{error}</p>}

      {pestana === 'dia' && (
        <div className="no-imprimir">
          <input
            type="date"
            value={fechaSeleccionada}
            onChange={(e) => setFechaSeleccionada(e.target.value)}
            className="selector-fecha"
          />
          <FormularioTransaccion
            categorias={categorias}
            onGuardado={manejarGuardadoDia}
            transaccionEditando={transaccionEditando}
            onCancelar={() => setTransaccionEditando(null)}
          />
          <ListaTransacciones
            transacciones={transaccionesDia}
            onCambio={manejarGuardadoDia}
            onEditar={(t) => setTransaccionEditando(t)}
          />
        </div>
      )}

      {pestana === 'mes' && (
        <>
          <div className="fila-formulario no-imprimir">
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
            <button type="button" onClick={exportarReporte}>Exportar reporte</button>
          </div>

          <div id="reporte-mes">
            <h2 className="titulo-reporte">Reporte de {NOMBRES_MES[mesSeleccionado]} {anioSeleccionado}</h2>
            <ResumenMensual resumen={resumenMes} />
            <ListaTransaccionesMes transacciones={resumenMes?.transacciones} />
          </div>
        </>
      )}

      {pestana === 'categorias' && (
        <div className="no-imprimir">
          <GestorCategorias categorias={categorias} onCambio={cargarCategorias} />
        </div>
      )}
    </div>
  )
}

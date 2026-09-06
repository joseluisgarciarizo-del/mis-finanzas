import { useState, useEffect } from 'react'
import { crearTransaccion, editarTransaccion } from '../services/transaccionesService'

export default function FormularioTransaccion({ categorias, onGuardado, transaccionEditando, onCancelar }) {
  const [tipo, setTipo] = useState('gasto')
  const [categoriaId, setCategoriaId] = useState('')
  const [subcategoriaId, setSubcategoriaId] = useState('')
  const [monto, setMonto] = useState('')
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10))
  const [descripcion, setDescripcion] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  const editando = Boolean(transaccionEditando)

  useEffect(() => {
    if (transaccionEditando) {
      setTipo(transaccionEditando.tipo)
      setCategoriaId(transaccionEditando.categoria_id || '')
      setSubcategoriaId(transaccionEditando.subcategoria_id || '')
      setMonto(String(transaccionEditando.monto))
      setFecha(transaccionEditando.fecha)
      setDescripcion(transaccionEditando.descripcion || '')
    }
  }, [transaccionEditando])

  const categoriasFiltradas = categorias.filter(c => c.tipo === tipo)
  const categoriaSeleccionada = categorias.find(c => c.id === categoriaId)

  function limpiarFormulario() {
    setMonto('')
    setDescripcion('')
    setCategoriaId('')
    setSubcategoriaId('')
    setTipo('gasto')
    setFecha(new Date().toISOString().slice(0, 10))
  }

  async function manejarEnvio(e) {
    e.preventDefault()
    setError('')
    setGuardando(true)
    try {
      if (editando) {
        await editarTransaccion(transaccionEditando.id, {
          categoria_id: categoriaId,
          subcategoria_id: subcategoriaId || null,
          monto: Number(monto),
          fecha,
          descripcion,
          tipo
        })
        onCancelar?.()
      } else {
        await crearTransaccion({
          categoria_id: categoriaId,
          subcategoria_id: subcategoriaId || null,
          monto: Number(monto),
          fecha,
          descripcion,
          tipo
        })
      }
      limpiarFormulario()
      onGuardado?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <form onSubmit={manejarEnvio} className="tarjeta">
      {editando && <p className="aviso-edicion">Editando registro</p>}

      <div className="selector-tipo">
        <button
          type="button"
          className={tipo === 'gasto' ? 'activo' : ''}
          onClick={() => { setTipo('gasto'); setCategoriaId('') }}
        >
          Gasto
        </button>
        <button
          type="button"
          className={tipo === 'ingreso' ? 'activo' : ''}
          onClick={() => { setTipo('ingreso'); setCategoriaId('') }}
        >
          Ingreso
        </button>
      </div>

      <label>
        Categoría
        <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} required>
          <option value="">Selecciona una categoría</option>
          {categoriasFiltradas.map(c => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
      </label>

      {categoriaSeleccionada?.subcategorias?.length > 0 && (
        <label>
          Subcategoría (opcional)
          <select value={subcategoriaId} onChange={(e) => setSubcategoriaId(e.target.value)}>
            <option value="">Ninguna</option>
            {categoriaSeleccionada.subcategorias.map(s => (
              <option key={s.id} value={s.id}>{s.nombre}</option>
            ))}
          </select>
        </label>
      )}

      <label>
        Monto
        <input
          type="number"
          step="0.01"
          min="0.01"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          required
        />
      </label>

      <label>
        Fecha
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />
      </label>

      <label>
        Descripción (opcional)
        <input
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </label>

      {error && <p className="mensaje-error">{error}</p>}

      <div className="fila-formulario">
        <button type="submit" disabled={guardando}>
          {guardando ? 'Guardando...' : editando ? 'Actualizar' : 'Guardar'}
        </button>
        {editando && (
          <button type="button" onClick={() => { onCancelar?.(); limpiarFormulario() }}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}

import { useState } from 'react'
import { crearTransaccion } from '../services/transaccionesService'

export default function FormularioTransaccion({ categorias, onGuardado }) {
  const [tipo, setTipo] = useState('gasto')
  const [categoriaId, setCategoriaId] = useState('')
  const [subcategoriaId, setSubcategoriaId] = useState('')
  const [monto, setMonto] = useState('')
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10))
  const [descripcion, setDescripcion] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  const categoriasFiltradas = categorias.filter(c => c.tipo === tipo)
  const categoriaSeleccionada = categorias.find(c => c.id === categoriaId)

  async function manejarEnvio(e) {
    e.preventDefault()
    setError('')
    setGuardando(true)
    try {
      await crearTransaccion({
        categoria_id: categoriaId,
        subcategoria_id: subcategoriaId || null,
        monto: Number(monto),
        fecha,
        descripcion,
        tipo
      })
      setMonto('')
      setDescripcion('')
      onGuardado?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <form onSubmit={manejarEnvio} className="tarjeta">
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

      <button type="submit" disabled={guardando}>
        {guardando ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  )
}

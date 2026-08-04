import { useState } from 'react'
import { crearCategoria, crearSubcategoria, eliminarCategoria, eliminarSubcategoria } from '../services/categoriasService'

export default function GestorCategorias({ categorias, onCambio }) {
  const [nombreNueva, setNombreNueva] = useState('')
  const [tipoNueva, setTipoNueva] = useState('gasto')
  const [error, setError] = useState('')
  const [subInputs, setSubInputs] = useState({})

  async function agregarCategoria(e) {
    e.preventDefault()
    setError('')
    if (!nombreNueva.trim()) return
    try {
      await crearCategoria({ nombre: nombreNueva.trim(), tipo: tipoNueva })
      setNombreNueva('')
      onCambio?.()
    } catch (err) {
      setError(err.message)
    }
  }

  async function agregarSubcategoria(categoriaId) {
    const nombre = (subInputs[categoriaId] || '').trim()
    if (!nombre) return
    try {
      await crearSubcategoria({ categoria_id: categoriaId, nombre })
      setSubInputs(prev => ({ ...prev, [categoriaId]: '' }))
      onCambio?.()
    } catch (err) {
      setError(err.message)
    }
  }

  async function manejarEliminarCategoria(id) {
    if (!confirm('¿Eliminar esta categoría? Solo se puede si no tiene transacciones asociadas.')) return
    try {
      await eliminarCategoria(id)
      onCambio?.()
    } catch (err) {
      setError('No se pudo eliminar: ' + err.message)
    }
  }

  return (
    <div className="tarjeta">
      <h2>Categorías</h2>

      <form onSubmit={agregarCategoria} className="fila-formulario">
        <input
          type="text"
          placeholder="Nueva categoría"
          value={nombreNueva}
          onChange={(e) => setNombreNueva(e.target.value)}
        />
        <select value={tipoNueva} onChange={(e) => setTipoNueva(e.target.value)}>
          <option value="gasto">Gasto</option>
          <option value="ingreso">Ingreso</option>
        </select>
        <button type="submit">Agregar</button>
      </form>

      {error && <p className="mensaje-error">{error}</p>}

      <ul className="lista-categorias">
        {categorias.map(c => (
          <li key={c.id} className="item-categoria">
            <div className="encabezado-categoria">
              <strong>{c.nombre}</strong>
              <span className={`etiqueta ${c.tipo}`}>{c.tipo}</span>
              <button onClick={() => manejarEliminarCategoria(c.id)} className="boton-eliminar">✕</button>
            </div>

            <ul className="lista-subcategorias">
              {c.subcategorias?.map(s => (
                <li key={s.id}>
                  {s.nombre}
                  <button
                    onClick={async () => { await eliminarSubcategoria(s.id); onCambio?.() }}
                    className="boton-eliminar-pequeno"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>

            <div className="fila-formulario pequena">
              <input
                type="text"
                placeholder="Nueva subcategoría"
                value={subInputs[c.id] || ''}
                onChange={(e) => setSubInputs(prev => ({ ...prev, [c.id]: e.target.value }))}
              />
              <button type="button" onClick={() => agregarSubcategoria(c.id)}>+</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

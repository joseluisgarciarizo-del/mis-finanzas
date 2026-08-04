import { eliminarTransaccion } from '../services/transaccionesService'

export default function ListaTransacciones({ transacciones, onCambio }) {
  async function manejarEliminar(id) {
    if (!confirm('¿Eliminar este registro?')) return
    try {
      await eliminarTransaccion(id)
      onCambio?.()
    } catch (err) {
      alert('No se pudo eliminar: ' + err.message)
    }
  }

  if (transacciones.length === 0) {
    return <p className="texto-vacio">No hay registros para este día.</p>
  }

  return (
    <ul className="lista-transacciones">
      {transacciones.map(t => (
        <li key={t.id} className={`item-transaccion ${t.tipo}`}>
          <div>
            <strong>{t.categorias?.nombre}</strong>
            {t.subcategorias?.nombre && <span> · {t.subcategorias.nombre}</span>}
            {t.descripcion && <p className="descripcion">{t.descripcion}</p>}
          </div>
          <div className="monto-acciones">
            <span className={t.tipo === 'ingreso' ? 'monto-positivo' : 'monto-negativo'}>
              {t.tipo === 'ingreso' ? '+' : '-'}${Number(t.monto).toLocaleString('es-CO')}
            </span>
            <button onClick={() => manejarEliminar(t.id)} className="boton-eliminar">✕</button>
          </div>
        </li>
      ))}
    </ul>
  )
}

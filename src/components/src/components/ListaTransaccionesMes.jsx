export default function ListaTransaccionesMes({ transacciones }) {
  if (!transacciones || transacciones.length === 0) {
    return <p className="texto-vacio">No hay movimientos registrados este mes.</p>
  }

  // Ya vienen ordenadas por fecha descendente desde el servicio,
  // pero lo confirmamos aquí por seguridad.
  const ordenadas = [...transacciones].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

  function formatearFecha(fechaTexto) {
    const [anio, mes, dia] = fechaTexto.split('-')
    return `${dia}/${mes}/${anio}`
  }

  return (
    <div className="tarjeta">
      <h2>Detalle del mes</h2>
      <ul className="lista-detalle-mes">
        {ordenadas.map(t => (
          <li key={t.id} className={`item-detalle-mes ${t.tipo}`}>
            <div className="fila-superior-detalle">
              <span className="fecha-detalle">{formatearFecha(t.fecha)}</span>
              <span className={t.tipo === 'ingreso' ? 'monto-positivo' : 'monto-negativo'}>
                {t.tipo === 'ingreso' ? '+' : '-'}${Number(t.monto).toLocaleString('es-CO')}
              </span>
            </div>
            <div className="fila-inferior-detalle">
              <strong>{t.categorias?.nombre}</strong>
              {t.subcategorias?.nombre && <span> · {t.subcategorias.nombre}</span>}
              {t.descripcion && <p className="descripcion">{t.descripcion}</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

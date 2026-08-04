export default function ResumenMensual({ resumen }) {
  if (!resumen) return null

  const { totalIngresos, totalGastos, balance, porCategoria } = resumen

  return (
    <div className="tarjeta">
      <h2>Resumen del mes</h2>
      <div className="fila-resumen">
        <div>
          <span className="etiqueta-resumen">Ingresos</span>
          <p className="monto-positivo">${totalIngresos.toLocaleString('es-CO')}</p>
        </div>
        <div>
          <span className="etiqueta-resumen">Gastos</span>
          <p className="monto-negativo">${totalGastos.toLocaleString('es-CO')}</p>
        </div>
        <div>
          <span className="etiqueta-resumen">Balance</span>
          <p className={balance >= 0 ? 'monto-positivo' : 'monto-negativo'}>
            ${balance.toLocaleString('es-CO')}
          </p>
        </div>
      </div>

      <h3>Por categoría</h3>
      <ul className="lista-por-categoria">
        {Object.entries(porCategoria).map(([nombre, monto]) => (
          <li key={nombre}>
            <span>{nombre}</span>
            <span>${monto.toLocaleString('es-CO')}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

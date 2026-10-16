function Casilla({ letra, estado, activa, fila, columna, onCambio, onKeyDown }) {
 
  let etiqueta = `Fila ${fila}, columna ${columna}`
  if (letra) {
    etiqueta += `, letra ${letra}`
  }
  if (estado) {
    etiqueta += `, estado ${estado}`
  }

  return (
    <input
      type="text"
      className={`casilla ${estado}`}
      maxLength={1}
      value={letra}
      disabled={!activa}
      aria-label={etiqueta}
      onChange={onCambio}
      onKeyDown={onKeyDown}
    />
  )
}

export default Casilla
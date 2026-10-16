function Teclado({ onPulsaLetra, estadosTeclas }) {
  const filasTeclado = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O',],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'Ñ', 'N', 'M', 'P']
  ]

  return (
    <div className="teclado">
      {filasTeclado.map((fila, i) => (
        <div className="fila-teclado" key={i}>
          {fila.map((letra) => {
            const estado = estadosTeclas[letra] || ''
            const ariaLabel = estado ? `Letra ${letra}, estado ${estado}` : `Letra ${letra}`

            return (
              <button
                key={letra}
                type="button"
                className={`tecla ${estado}`}
                onClick={() => onPulsaLetra(letra)}
                aria-label={ariaLabel}
              >
                {letra}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default Teclado
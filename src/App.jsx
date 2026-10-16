import { useEffect, useState } from 'react'
import Casilla from './components/Casilla.jsx'
import Teclado from './components/Teclado.jsx'

const FILAS = 6
const COLUMNAS = 5
const PALABRAS = ['SANTO', 'PERRO', 'GATO', 'CASAS', 'LIBRO', 'MUNDO', 'FUEGO', 'AGUAS']

function palabraAlAzar() {
  const indice = Math.floor(Math.random() * PALABRAS.length)
  return PALABRAS[indice]
}

function tableroVacio() {
  const tablero = []
  for (let f = 0; f < FILAS; f++) {
    tablero.push(Array(COLUMNAS).fill(''))
  }
  return tablero
}

function App() {
  const [intentos, setIntentos] = useState(tableroVacio())
  const [filaActual, setFilaActual] = useState(0)
  const [solucion, setSolucion] = useState(palabraAlAzar)
  const [aviso, setAviso] = useState('')

  const ultimo = filaActual > 0 ? intentos[filaActual - 1].join('') : ''
  const ganada = ultimo === solucion
  const terminada = ganada || filaActual === FILAS

  function obtenerColoresFila(intentoFila) {
    const colores = Array(COLUMNAS).fill('ausente')
    const letrasSolucion = solucion.split('')
    const intento = [...intentoFila]

    for (let c = 0; c < COLUMNAS; c++) {
      if (intento[c] === letrasSolucion[c]) {
        colores[c] = 'correcta'
        letrasSolucion[c] = null
        intento[c] = null
      }
    }

    for (let c = 0; c < COLUMNAS; c++) {
      if (intento[c] !== null) {
        const indiceSolucion = letrasSolucion.indexOf(intento[c])
        if (indiceSolucion !== -1) {
          colores[c] = 'presente'
          letrasSolucion[indiceSolucion] = null
        } else {
          colores[c] = 'ausente'
        }
      }
    }

    return colores
  }

 
  function obtenerEstadosTeclas() {
    const estados = {}
    const prioridad = { correcta: 3, presente: 2, ausente: 1 }

    for (let f = 0; f < filaActual; f++) {
      const coloresFila = obtenerColoresFila(intentos[f])
      intentos[f].forEach((letra, c) => {
        const estadoActual = coloresFila[c]
        if (!estados[letra] || prioridad[estadoActual] > prioridad[estados[letra]]) {
          estados[letra] = estadoActual
        }
      })
    }
    return estados
  }

  useEffect(() => {
    document.querySelector('.casilla:enabled')?.focus()
  }, [filaActual])

 
  function insertarLetra(letraMayus) {
   
    const columnaVacia = intentos[filaActual].indexOf('')
    if (columnaVacia === -1) return // Fila llena

    setAviso('')
    const copia = intentos.map((fila) => [...fila])
    copia[filaActual][columnaVacia] = letraMayus
    setIntentos(copia)
  }

  function cambiarLetra(f, c, evento) {
    const letra = evento.target.value.toUpperCase()
    if (!/^[A-ZÑ]?$/.test(letra)) return

    setAviso('')
    const copia = intentos.map((fila) => [...fila])
    copia[f][c] = letra
    setIntentos(copia)

    if (letra !== '') evento.target.nextElementSibling?.focus()
  }

  function manejarTeclaAbajo(f, c, evento) {
    if (evento.key === 'Backspace' && intentos[f][c] === '') {
      evento.target.previousElementSibling?.focus()
    }
  }

  function comprobar(evento) {
    evento.preventDefault()
    if (terminada) return

    if (intentos[filaActual].includes('')) {
      setAviso('Faltan letras')
      return
    }

    setAviso('')
    setFilaActual(filaActual + 1)
  }

  function reiniciar() {
    setIntentos(tableroVacio())
    setFilaActual(0)
    setSolucion(palabraAlAzar())
    setAviso('')
  }

  return (
    <form className="juego" onSubmit={comprobar}>
      <h1>Wordle</h1>
      <div className="tablero">
        {intentos.map((fila, f) => {
          const coloresFila = f < filaActual ? obtenerColoresFila(fila) : []

          return (
            <div className="fila" key={f}>
              {fila.map((letra, c) => (
                <Casilla
                  key={c}
                  letra={letra}
                  estado={f < filaActual ? coloresFila[c] : ''}
                  activa={f === filaActual && !terminada}
                  fila={f + 1}
                  columna={c + 1}
                  onCambio={(evento) => cambiarLetra(f, c, evento)}
                  onKeyDown={(evento) => manejarTeclaAbajo(f, c, evento)}
                />
              ))}
            </div>
          )
        })}
      </div>

      {aviso && <p className="aviso">{aviso}</p>}

      {terminada ? (
        <div className="fin-partida">
          <p className="mensaje" role="status">
            {ganada
              ? '¡Enhorabuena, has acertado!'
              : `La palabra era ${solucion}`}
          </p>
          <button className="boton" type="button" onClick={reiniciar}>
            Nueva partida
          </button>
        </div>
      ) : (
        <>
          <button className="boton" type="submit">
            Comprobar
          </button>
          <Teclado
            onPulsaLetra={insertarLetra}
            estadosTeclas={obtenerEstadosTeclas()}
          />
        </>
      )}
    </form>
  )
}

export default App
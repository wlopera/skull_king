# Plan de Desarrollo Definitivo: Skull King Digital V1 (Sin Cartas Especiales)

> **Documento de Especificación Oficial según Grandpa Beck's Games (Edición en Español)**  
> **Frontend:** ReactJS (Despliegue en Vercel) | **Backend:** NodeJS + Socket.IO (Despliegue en Render)  
> **Capacidad:** 2 a 8 Jugadores con Enlace de Invitación Web  
> **Filosofía de Código:** Prioridad a la máxima legibilidad, arquitectura limpia y componentes modulares.

---

## 1. Revisión y Aprobación de los 5 Puntos Clave

### Punto 1: Creación de Mesa y Enlace de Invitación Web
- **Flujo de Creación:** Un jugador anfitrión entra a la web, ingresa su nombre y hace clic en **"Crear Mesa"**.
- **Generación de Enlace Web:** Se genera una URL única con el código de sala (ejemplo: `https://mi-skullking.vercel.app/?room=SK-9X2A`).
- **Botón de Copiado Rápido:** Con un solo clic, se copia al portapapeles y se muestra feedback visual (*"¡Enlace copiado!"*).
- **Entrada de Invitados:** Cualquier jugador que abra el enlace web es recibido con una pantalla para ingresar su nombre y se sienta automáticamente en uno de los 8 asientos disponibles alrededor de la mesa.
- **Asientos Opcionales con Bots:** Si no se llega a 8 personas humanas, el creador puede pulsar **"+ Bot"** en asientos vacíos o dar **"Iniciar Partida"** con los jugadores presentes (mínimo 2).

---

### Punto 2: Mazo y Reglas V1 (Sin Cartas Especiales)
Para esta primera versión (V1), se excluyen deliberadamente las cartas especiales (Skull King, Piratas, Sirenas, Tigresa, Huidas, Kraken, Ballena Blanca), enfocándonos en la mecánica pura de bazas, apuestas y puntuación oficial.

#### Composición del Mazo V1 (56 Cartas en Total)
- **3 Palos Estándar (1 al 14 en cada color):**
  - 🟡 **Amarillo / Oro:** 14 cartas (1 al 14).
  - 🟢 **Verde / Loro & Cañones:** 14 cartas (1 al 14).
  - 🟣 **Morado / Mapa & Brújula:** 14 cartas (1 al 14).
- **1 Palo de Triunfo (*Trump* / Jolly Roger):**
  - ⚫ **Negro / Calavera Jolly Roger:** 14 cartas (1 al 14). Supera a cualquier carta de los tres palos estándar.

#### Distribución de Cartas para hasta 8 Jugadores (Mazo de 56 Cartas)
- Con 56 cartas disponibles, el reparto para 8 personas se ajusta matemáticamente sin agotar el mazo:
  - De **2 a 5 Jugadores:** 10 rondas completas (Rondas 1 a 10 reparten de 1 a 10 cartas).
  - Para **6 Jugadores:** Rondas 1 a 9 reparten $N$ cartas; Ronda 10 reparte **9 cartas** ($6 \times 9 = 54 \le 56$).
  - Para **7 u 8 Jugadores:** Rondas 1 a 7 reparten $N$ cartas ($8 \times 7 = 56$); Rondas 8, 9 y 10 reparten **7 cartas por jugador** ($8 \times 7 = 56 \le 56$).
- El multiplicador de puntos para apuestas de 0 bazas utiliza siempre el número oficial de la ronda $N$ ($1 \le N \le 10$).

---

### Punto 3: Mecánica de Bazas y Puntuación Oficial Skull King (Español)

#### 3.1 Mecánica de la Baza (*Trick-Taking*)
1. **Palo de Salida (*Lead Suit*):** El jugador que tiene el turno de salida tira una carta sobre la mesa. Su color define el palo que los demás jugadores **están obligados a seguir** (*asistir al palo*).
2. **Obligación de Seguir Palo:**
   - Si un jugador tiene cartas del palo de salida en su mano, **debe jugar obligatoriamente una carta de ese palo**.
   - Si no tiene cartas de ese palo, puede tirar cualquier otro palo estándar o tirar una carta del **palo negro (Jolly Roger / Triunfo)**.
3. **Resolución de la Baza:**
   - Si se jugó alguna carta negra (Jolly Roger): gana la **carta negra con el número más alto**.
   - Si no se jugó ninguna carta negra: gana la **carta del palo de salida con el número más alto**.
   - Cualquier carta de otro color que no sea el palo de salida ni negro tiene valor 0 para ganar la baza.
4. **Líder de la Siguiente Baza:** El ganador de la baza se lleva el montón a su reserva y lidera (juega primero) en la siguiente baza.

#### 3.2 Sistema Oficial de Puntuación (Grandpa Beck's)
Al concluir cada ronda $N$:

- **Caso A: Apuesta Mayor a Cero ($Apuesta > 0$):**
  - **Acierto exacto ($Bazas == Apuesta$):**  
    $$\text{Puntos} = Bazas \times 20 + \text{Bonificaciones}$$
  - **Fallo ($Bazas \neq Apuesta$):**  
    $$\text{Puntos} = -(|Bazas - Apuesta| \times 10)$$
    *(No se cobran bonificaciones si se falla la apuesta).*

- **Caso B: Apuesta de Cero ($Apuesta == 0$):**
  - **Acierto exacto ($Bazas == 0$):**  
    $$\text{Puntos} = N \times 10 \quad (\text{ej: Ronda 1} = +10, \text{Ronda 5} = +50, \text{Ronda 10} = +100)$$
  - **Fallo ($Bazas > 0$):**  
    $$\text{Puntos} = -(N \times 10)$$

- **Bonificaciones por Cartas 14 (Solo si la apuesta fue exitosa):**
  - Capturar un **14 Estándar** (Amarillo, Verde o Morado): **+10 puntos** por cada 14 capturado en tus bazas ganadas.
  - Capturar el **14 Negro** (Jolly Roger): **+20 puntos**.

---

### Punto 4: Diseño y Creación de las Cartas del Juego

Crearemos el componente visual nativo de las cartas en **React con SVG y CSS de alta resolución**:

1. **Reverso Oficial de las Cartas (*Card Back*):**
   - Marco náutico dorado, fondo azul marino abisal (`#0B131F`), rosa de los vientos central y emblema corsario en filigrana dorada.
2. **Anverso de las Cartas (*Card Face*):**
   - **Esquinas superior izquierda e inferior derecha:** Valor numérico grande (1 al 14) con el mini-icono del palo.
   - **Cuerpo Central:** Ilustración temática estilizada del palo:
     - 🟡 **Amarillo:** Cofre del tesoro y doblones de oro.
     - 🟢 **Verde:** Loro corsario y cañones navales.
     - 🟣 **Morado:** Mapa del tesoro antiguo, sextante y brújula.
     - ⚫ **Negro (Jolly Roger):** Bandera pirata con calavera y sables cruzados en relieve dorado brillante.
   - **Indicador de Carta 14:** Estandarte dorado especial que indica el valor de bonificación (+10 o +20 pts).
   - **Interactividad:** Elevación en hover, sombreado dinámico y borde luminoso en las cartas válidas para jugar según la regla de seguir palo.

---

### Punto 5: Fuente y Reglas Oficiales Grandpa Beck's (Español)

Toda la terminología, fases y flujos se ajustan al manual oficial en español:
1. **Reparto de Cartas:** El mazo se baraja al inicio de cada ronda.
2. **Fase "¡Yo-Ho-Ho!":** Apuesta secreta y simultánea. Los jugadores pulsan su apuesta (de $0$ a cartas en mano) y todos revelan al unísono con el grito pirata.
3. **Fase de Bazas:** Sentido horario. La mesa muestra las cartas lanzadas con la indicación del jugador correspondiente.
4. **Resumen de Ronda:** Hoja de puntuación (*Scorepad*) interactiva que muestra el cálculo paso a paso (apuesta, bazas conseguidas, bono de 14s, puntos de ronda y total acumulado).
5. **Fin de Partida:** Tras la Ronda 10, podio final con el Gran Pirata ganador.

---

## 2. Arquitectura de Despliegue (Render + Vercel)

```
┌───────────────────────────────────────────────┐
│              DESPLIEGUE CLOUD                 │
├───────────────────────┬───────────────────────┤
│ FRONTEND (Vercel)     │ BACKEND (Render)      │
├───────────────────────┼───────────────────────┤
│ • ReactJS + Vite      │ • NodeJS + Express    │
│ • SPA con vercel.json │ • Socket.IO WebSockets│
│ • Variables Vercel:   │ • Variable Render:    │
│   VITE_BACKEND_URL    │   PORT, CLIENT_URL    │
│ • Rutas /?room=XYZ    │ • Ping /health check  │
└───────────────────────┴───────────────────────┘
```

---

## 3. Hoja de Ruta de Programación

- **Paso 1:** Generación del componente visual de cartas (diseño SVG/CSS de los 4 palos y reverso náutico).
- **Paso 2:** Backend NodeJS (`server/`): Dominio de mazo (56 cartas), evaluador de palo asistido/triunfo, calculador de puntos y gestor de salas con código de invitación.
- **Paso 3:** Frontend ReactJS (`client/`): Mesa de 8 asientos, recepción de enlace `?room=...`, modales de apuesta y abanico interactivo de cartas.
- **Paso 4:** Verificación y preparación para despliegue en Render y Vercel.

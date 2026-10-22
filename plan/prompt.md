# Prompt de Ingeniería para Desarrollo: Clon de Skull King en Antigravity IDE

## 🛠 Instrucciones de Uso
Copia todo el contenido de este archivo y pégalo en tu LLM (como Claude 3.5 Sonnet, GPT-4o o el generador de código de Antigravity IDE) para inicializar el entorno de desarrollo con todas las reglas, activos y lógicas necesarias.

---

## 🎯 Objetivo del Sistema
Crear un clon digital del juego de cartas **Skull King** (licencia de Grandpa Beck's Games) utilizando **Antigravity IDE**. El sistema debe incluir la lógica del mazo, la máquina de estados por rondas, un evaluador de botes/bazas según jerarquías estrictas, un sistema de puntuación automatizado y una interfaz gráfica interactiva con marcadores de posición para imágenes.

---

## 🏗 1. Arquitectura de Datos y Módulos Core

### 1.1 Estructura del Mazo (66 Cartas en Total)
Implementar una colección con las siguientes entidades y pesos de jerarquía (*Weights*) para resolver las bazas:

| Tipo de Carta | Cantidad | Palo / Atributo | Peso Base (Backend) | Regla Especial |
| :--- | :--- | :--- | :--- | :--- |
| **Huida (Escape)** | 5 | Ninguno | 0 | Siempre pierde (Valor 0). |
| **Palo Estándar** | 42 | Amarillo, Verde, Morado (1-14 c/u) | 1 a 14 | Obligatorio seguir el palo inicial de la baza si se tiene. |
| **Jolly Roger** | 14 | Negro (Trunfo / Trump) (1-14) | 101 a 114 | Supera a cualquier palo estándar. |
| **Piratas** | 5 | Únicos (Harry el Gigante, etc.) | 200 | Superan a los números. Gana el primero jugado en mesa si hay varios. |
| **Tigresa (Scary Mary)**| 1 | Dual | 200 o 0 | Al jugarse, el usuario elige: actúa como Pirata o como Huida. |
| **Sirenas (Mermaids)** | 2 | Único | 300 | Superan a los números y al Skull King. Pierden ante Piratas normales. |
| **Skull King** | 1 | Único (Rey de los Piratas) | 400 | Supera a Piratas y números. Pierde únicamente ante la Sirena. |
| **Kraken** | 1 | Modificador Gris | -1 | Destruye la baza. Nadie la gana. Limpia la mesa. |
| **Ballena Blanca** | 1 | Modificador Blanco | -2 | Desactiva poderes especiales de todas las cartas en mesa. Gana el número más alto. |

---

## 🔄 2. Máquina de Estados del Juego (FSM)

El ciclo de vida del juego consta de **10 rondas consecutivas**. Implementar el siguiente flujo controlado:

```
[Inicio de Partida]
       ⬇
[Ronda N (1 a 10)] ➔ Repartir N cartas a cada jugador desde el mazo barajado.
       ⬇
[Fase de Apuestas] ➔ Simultánea. Cada jugador predice cuántas bazas ganará (0 a N). "¡Yo-Ho-Ho!".
       ⬇
[Bucle de Bazas]   ➔ Se juegan N bazas. En cada baza, cada jugador tira 1 carta siguiendo el palo.
       ⬇
[Evaluador]        ➔ Determinar ganador de la baza usando la Jerarquía estricta. El ganador abre la siguiente.
       ⬇
[Cálculo de Ronda] ➔ Aplicar el sistema de recuento de puntos de Skull King (Sección 3).
       ⬇
¿Ronda == 10? ➔ (NO) Siguiente Ronda / (SÍ) Mostrar Ganador Final y Tabla de Posiciones.
```

---

## 🧮 3. Reglas de Anotación y Recuento de Puntos (Score Ledger)

Implementar estrictamente las fórmulas oficiales de puntuación al finalizar cada ronda $N$:

### 3.1 Apuestas Mayores a Cero (Apuesta > 0)
*   **Éxito absoluto (Bazas Ganadas == Apuesta):**
    $$	ext{Puntos} = (	ext{Bazas Ganadas} 	imes 20) + 	ext{Bonificaciones}$$
*   **Fallo (Bazas Ganadas }
eq 	ext{ Apuesta):**
    $$	ext{Puntos} = -(	ext{Abs}(	ext{Bazas Ganadas} - 	ext{Apuesta}) 	imes 10)$$

### 3.2 Apuestas de Cero Bazas (Apuesta == 0)
*   **Éxito absoluto (Bazas Ganadas == 0):**
    $$	ext{Puntos} = N 	imes 10 \quad 	ext{(Donde } N 	ext{ es el número de la ronda actual)}$$
*   **Fallo (Bazas Ganadas > 0):**
    $$	ext{Puntos} = -(N 	imes 10)$$

### 3.3 Tabla de Bonificaciones (Solo aplicable si la apuesta fue EXITOSA)
Las bonificaciones se acumulan en la baza donde ocurre la captura:

| Captura Realizada | Puntos Extras | Condición de Activación |
| :--- | :--- | :--- |
| **Pirata capturado por Skull King** | **+30 Puntos** por pirata | El Skull King gana una baza donde había uno o más piratas. |
| **Skull King capturado por Sirena** | **+50 Puntos** | La Sirena gana la baza superando directamente al Skull King. |
| **Jolly Roger (Negro) "14" capturado**| **+20 Puntos** | Se gana la baza donde un oponente jugó el 14 negro. |
| **Color Estándar "14" capturado** | **+10 Puntos** por carta | Se gana la baza conteniendo un 14 amarillo, verde o morado. |

---

## 🎨 4. Guía de Interfaz Visual e Imágenes (UI/UX)

Diseñar componentes gráficos modulares interactivos optimizados para Antigravity IDE:

### 4.1 Marcadores de Posición para Activos Visuales (Asset Placeholders)
*   **Cartas Estándar:** Renderizar un contenedor con el color del palo (`#FFCC00` Amarillo, `#33CC33` Verde, `#9933FF` Morado, `#1A1A1A` Negro) y el número centrado en fuente grande.
*   **Cartas Especiales:** Usar bordes dorados e iconos representativos (⚓ para Huida, ☠️ para Piratas, 🧜‍♀️ para Sirenas, 👑 para Skull King, 🦑 para Kraken, 🐋 para Ballena Blanca).
*   **Efectos en Mesa:** Cuando se juegue el Kraken o la Ballena Blanca, disparar una animación en pantalla que cambie el fondo de la mesa (Gris tormenta para Kraken, Blanco neblina para la Ballena).

### 4.2 Paneles de la Interfaz de Usuario
*   **Panel de Control de Apuestas:** Botones numéricos del `0` al `N` visibles únicamente durante la fase "Yo-Ho-Ho!".
*   **Mesa Central (The Pot):** Disposición circular o alineada de las cartas jugadas en la baza actual, mostrando claramente qué jugador tiró cada carta y el orden de juego.
*   **Marcador en Vivo (Scoreboard):** Tabla fija en la esquina superior que desglose: `Jugador` \| `Apuesta` \| `Bazas Ganadas` \| `Puntuación Total Acumulada`.

---

## 💻 5. Instrucciones de Salida de Código Esperado
Cuando se ejecute este prompt, genera la solución estructurada de la siguiente manera:
1.  **Clases de Dominio:** Inicializar los objetos `Card`, `Player`, `Trick` y `GameSession`.
2.  **Lógica del Evaluador:** Escribir la función pura `resolveTrick(cardsOnTable)` que determine de forma infalible el ID del jugador ganador.
3.  **Módulo de Puntuación:** Escribir la función `calculateRoundScore(playerState, roundNumber)` con soporte integrado para bonus de captura.
4.  **Bucle del Estado:** Implementar el esqueleto visual en el framework gráfico nativo que uses dentro de Antigravity IDE.
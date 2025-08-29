export function initTMT() {
    // --- DOM ELEMENTS ---
    const mainTitle = document.getElementById('main-title');
    const testContainer = document.getElementById('test-container');
    const resetButton = document.getElementById('reset-button');
    const endTestButton = document.getElementById('end-test-button');
    const timerDisplay = document.getElementById('timer');
    const errorCounterDisplay = document.getElementById('error-counter');
    const hitCounterDisplay = document.getElementById('hit-counter');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const instructionsPanel = document.getElementById('instructions-panel');
    const instructionsText = document.getElementById('instructions-text');

    // Results divs
    const resultsDiv = document.getElementById('results');

    // --- TEST CONFIGURATION ---
   const partAConfig = {
    title: "Trail Making Test (Parte A)",
    instructions: "Una las burbujas en orden numérico ascendente (1-2-3...). El tiempo comenzará cuando presione la burbuja '1'. Recuerda que debes mantener sostenido desde el primero toque.",
    backgroundImage: "url('images/TrailMaking1-a.jpg')",
    sequence: Array.from({ length: 25 }, (_, i) => String(i + 1)),
    positions: [
        { value: '1', pos: [60, 50] },
        { value: '2', pos: [47, 55] },
        { value: '3', pos: [66, 64] },
        { value: '4', pos: [74, 34] },
        { value: '5', pos: [54, 25] },
        { value: '6', pos: [46, 36] },
        { value: '7', pos: [36, 43] },
        { value: '8', pos: [28, 52] },
        { value: '9', pos: [30, 62] },
        { value: '10', pos: [40, 52] },
        { value: '11', pos: [58, 79] },
        { value: '12', pos: [18, 78] },
        { value: '13', pos: [29, 32] },
        { value: '14', pos: [18, 43] },
        { value: '15', pos: [7, 12] },
        { value: '16', pos: [21, 22] },
        { value: '17', pos: [40, 6] },
        { value: '18', pos: [35, 17] },
        { value: '19', pos: [83, 19] },
        { value: '20', pos: [72, 13] },
        { value: '21', pos: [90, 7] },
        { value: '22', pos: [86, 33] },
        { value: '23', pos: [72, 82] },
        { value: '24', pos: [74, 47] },
        { value: '25', pos: [66, 80] }
    ]
};

const partBConfig = {
    title: "Trail Making Test (Parte B)",
    instructions: "Una las burbujas alternando entre números y letras (1-A-2-B...). El tiempo comenzará cuando presione la burbuja '1'. Recuerda que debes mantener sostenido desde el primero toque.",
    backgroundImage: "url('images/background-part-b.jpg')",
    sequence: ['1', 'A', '2', 'B', '3', 'C', '4', 'D', '5', 'E', '6', 'F', '7', 'G', '8', 'H', '9', 'I', '10', 'J', '11', 'K', '12', 'L', '13'],
    positions: [
        { value: '1', pos: [53, 55] },
        { value: 'A', pos: [62, 68] },
        { value: '2', pos: [39, 77] },
        { value: 'B', pos: [37, 36] },
        { value: '3', pos: [50, 42] },
        { value: 'C', pos: [58, 45] },
        { value: '4', pos: [46, 27] },
        { value: 'D', pos: [72, 22] },
        { value: '5', pos: [66, 53] },
        { value: 'E', pos: [74, 80] },
        { value: '6', pos: [47, 74] },
        { value: 'F', pos: [31, 85] },
        { value: '7', pos: [43, 62] },
        { value: 'G', pos: [34, 68] },
        { value: '8', pos: [19, 25] },
        { value: 'H', pos: [25, 58] },
        { value: '9', pos: [28, 25] },
        { value: 'I', pos: [55, 25] },
        { value: '10', pos: [86, 20] },
        { value: 'J', pos: [70, 64] },
        { value: '11', pos: [85, 85] },
        { value: 'K', pos: [18, 92] },
        { value: '12', pos: [25, 72] },
        { value: 'L', pos: [30, 78] },
        { value: '13', pos: [10, 10] }
    ]
};

    // --- STATE MANAGEMENT ---
    let state = {};
    let currentPart = 'A';
    let partAResult = null;
    let isMouseDown = false; // Para rastrear si el botón del ratón está presionado
    let permanentLines = [];

    // --- Global Mouse Listeners ---
    document.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return; // Solo para el botón izquierdo
        isMouseDown = true;

        const target = e.target;

        // --- Lógica de Inicio del Juego ---
        // El juego comienza con el primer 'mousedown' sobre el círculo correcto,
        // solo si el juego no está ya activo. Esto es más intuitivo que usar 'mouseenter'.
        if (!state.gameActive && target.classList.contains('circle')) {
            const config = (currentPart === 'A') ? partAConfig : partBConfig;
            if (target.dataset.value === config.sequence[0]) {
                state.gameActive = true;
                startTimer();
                instructionsPanel.classList.add('hidden');
                endTestButton.classList.remove('hidden');
                resetButton.disabled = true; // Asegurarse de que el botón esté deshabilitado
                target.classList.add('correct');
                state.lastCorrectPosition = {
                    x: target.offsetLeft + target.offsetWidth / 2,
                    y: target.offsetTop + target.offsetHeight / 2
                };
            }
        }

        // Si el juego ya está activo, activamos la línea guía al presionar.
        if (state.gameActive) {
            document.addEventListener('mousemove', handleMouseMove);
        }
    });

    document.addEventListener('mouseup', (e) => {
        if (e.button === 0) {
            const wasMouseDown = isMouseDown;
            isMouseDown = false;
            document.removeEventListener('mousemove', handleMouseMove);

            if (state.gameActive && wasMouseDown) {
                const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY);
                const clickedCircle = elementUnderCursor ? elementUnderCursor.closest('.circle') : null;

                // Si se suelta sobre un círculo, se evalúa la conexión.
                if (clickedCircle) {
                    const config = (currentPart === 'A') ? partAConfig : partBConfig;
                    const targetSequence = config.sequence;
                    const clickedValue = clickedCircle.dataset.value;

                    const endPosition = {
                        x: clickedCircle.offsetLeft + clickedCircle.offsetWidth / 2,
                        y: clickedCircle.offsetTop + clickedCircle.offsetHeight / 2
                    };

                    // Evitar acción si se suelta sobre el mismo círculo desde el que se partió.
                    if (state.lastCorrectPosition && endPosition.x === state.lastCorrectPosition.x && endPosition.y === state.lastCorrectPosition.y) {
                        redrawCanvas(); // Solo limpiar la línea temporal
                        return;
                    }

                    // Comprueba si se hizo clic en el siguiente círculo correcto
                    if (clickedValue === targetSequence[state.currentIndex + 1]) {
                        // --- ACIERTO ---
                        const permanentLine = { from: state.lastCorrectPosition, to: endPosition, isError: false };
                        permanentLines.push(permanentLine);

                        state.hitCount++;
                        hitCounterDisplay.textContent = state.hitCount;

                        state.currentIndex++; // Avanza al siguiente índice correcto
                        clickedCircle.classList.add('correct');

                        if (state.currentIndex >= targetSequence.length - 1) {
                            endTest(); // El test termina al conectar con el último número
                        }
                    } else {
                        // --- ERROR ---
                        state.errorCount++;
                        errorCounterDisplay.textContent = state.errorCount;
                        const errorLine = { from: state.lastCorrectPosition, to: endPosition, isError: true };
                        permanentLines.push(errorLine);
                        // Anima el círculo incorrecto
                        clickedCircle.classList.add('error');
                        setTimeout(() => clickedCircle.classList.remove('error'), 300);
                    }
                    // Después de un acierto o un error, el punto de partida para la siguiente línea es el círculo que se acaba de pulsar.
                    state.lastCorrectPosition = endPosition;

                } else {
                    // Si se suelta el botón en un espacio vacío, cuenta como error.
                    state.errorCount++;
                    errorCounterDisplay.textContent = state.errorCount;

                    const rect = canvas.getBoundingClientRect();
                    const errorPosition = { x: e.clientX - rect.left, y: e.clientY - rect.top };
                    const errorLine = { from: state.lastCorrectPosition, to: errorPosition, isError: true };
                    permanentLines.push(errorLine);
                }

                redrawCanvas();
            }
        }
    });

    function resetState() {
        state = {
            currentIndex: 0,
            startTime: null,
            timerInterval: null,
            errorCount: 0,
            hitCount: 0,
            lastCorrectPosition: null,
            gameActive: false,
        };
        permanentLines = [];
    }

    function initializeTest(part) {
        currentPart = part;
        const config = (part === 'A') ? partAConfig : partBConfig;

        resetState();

        // Limpiar cualquier listener de movimiento residual
        document.removeEventListener('mousemove', handleMouseMove);

        // Limpiar círculos anteriores, pero mantener el canvas
        testContainer.innerHTML = '';
        testContainer.appendChild(canvas);

        // Ocultar resultados al iniciar un nuevo test
        if (part === 'A') {
            resultsDiv.classList.add('hidden');
            partAResult = null;
        }
        endTestButton.classList.add('hidden');

        timerDisplay.textContent = '0s';
        errorCounterDisplay.textContent = '0';
        hitCounterDisplay.textContent = '0';
        mainTitle.textContent = config.title;

        // Mostrar instrucciones
        instructionsText.textContent = config.instructions;
        instructionsPanel.classList.remove('hidden');

        // Restablecer el botón a su estado inicial

        // Ajustar tamaño del canvas al contenedor
        const rect = testContainer.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        testContainer.style.backgroundImage = config.backgroundImage;
        testContainer.style.backgroundSize = 'contain';

        // Crear y posicionar los círculos
        config.positions.forEach(item => {
            const circle = document.createElement('div');
            circle.classList.add('circle');
            circle.textContent = item.value;
            circle.dataset.value = item.value;
            // Posicionar el círculo. Restamos la mitad del tamaño para centrarlo.
            circle.style.left = `calc(${item.pos[0]}% - 22px)`;
            circle.style.top = `calc(${item.pos[1]}% - 22px)`;
            
            testContainer.appendChild(circle);
        });
    }

    function redrawCanvas() {
        // Limpia el canvas por completo
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Vuelve a dibujar todas las líneas, aplicando el color correcto
        permanentLines.forEach(line => {
            const color = line.isError ? 'blue' : 'rgba(0, 100, 0, 0.7)'; // Azul para errores
            drawLine(line.from, line.to, { color: color });
        });
    }

    function handleMouseMove(e) {
        redrawCanvas();

        // Calcula la posición actual del ratón relativa al canvas
        const rect = canvas.getBoundingClientRect();
        const currentPos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };

        // Dibuja la línea temporal de arrastre (punteada y verde)
        drawLine(state.lastCorrectPosition, currentPos, { isTemporary: true });
    }

    function startTimer() {
        state.startTime = Date.now();
        state.timerInterval = setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        const elapsedTime = Math.floor((Date.now() - state.startTime) / 1000);
        timerDisplay.textContent = `${elapsedTime}s`;
    }

    function drawLine(fromPos, toPos, options = {}) {
        const {
            isTemporary = false,
            color = 'rgba(0, 100, 0, 0.7)', // Verde por defecto
            lineWidth = 3
        } = options;

        ctx.beginPath();
        ctx.moveTo(fromPos.x, fromPos.y);
        ctx.lineTo(toPos.x, toPos.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        if (isTemporary) {
            ctx.setLineDash([5, 10]); // Línea punteada para arrastre
        } else {
            ctx.setLineDash([]); // Línea sólida
        }
        ctx.stroke();
    }

    function endTest() {
        clearInterval(state.timerInterval);
        state.gameActive = false;
        endTestButton.classList.add('hidden');
        document.removeEventListener('mousemove', handleMouseMove);

        const finalTime = Math.floor((Date.now() - state.startTime) / 1000); // en segundos
        const testResult = {
            timeInSeconds: finalTime,
            errors: state.errorCount
        };

        // Desactivar clics en los círculos
        document.querySelectorAll('.circle').forEach(c => {
            c.style.pointerEvents = 'none';
        });

        if (currentPart === 'A') {
            partAResult = testResult;
            console.log("Resultado Parte A (listo para enviar):", partAResult);
            // No se muestran resultados intermedios, solo se prepara para la siguiente parte.

            // Preparar para la Parte B
            resetButton.textContent = 'Iniciar Parte B';
            resetButton.disabled = false;
        } else { // Fin de la Parte B
            const partBResult = testResult;
            console.log("Resultado Parte B (listo para enviar):", partBResult);

            // Mostrar el mensaje final
            resultsDiv.classList.remove('hidden');

            // Habilitar el botón para reiniciar todo el test
            resetButton.textContent = 'Reiniciar Test';
            resetButton.disabled = false;
        }
    }

    function handleControlButtonClick() {
        const action = resetButton.textContent;

        switch (action) {
            case 'Iniciar':
                // El test está listo. Se deshabilita el botón para que el usuario
                // comience en el tablero. El test real empieza con el primer clic.
                resetButton.disabled = true;
                break;
            case 'Iniciar Parte B':
                initializeTest('B');
                // Tras inicializar la parte B, se deshabilita el botón de nuevo.
                resetButton.disabled = true;
                break;
            case 'Reiniciar Test':
                initializeTest('A');
                // Después de reiniciar, volvemos al estado inicial para que el usuario pueda comenzar de nuevo.
                resetButton.textContent = 'Iniciar';
                resetButton.disabled = false;
                break;
        }
    }

    // --- INICIALIZACIÓN ---
    resetButton.addEventListener('click', handleControlButtonClick);
    endTestButton.addEventListener('click', endTest);
    initializeTest('A'); // Preparar la Parte A al cargar la página
    resetButton.textContent = 'Iniciar';
    resetButton.disabled = false;
};
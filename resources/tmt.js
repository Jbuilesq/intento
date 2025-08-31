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

    // --- LAYOUT STYLING ---
    // Centra los componentes principales de la prueba para una mejor presentación.

    // 1. Centrar texto de Título, Estadísticas y Controles
    mainTitle.style.textAlign = 'center';
    if (timerDisplay.parentNode && timerDisplay.parentNode.style) {
        timerDisplay.parentNode.style.textAlign = 'center';
    }
    if (resetButton.parentNode && resetButton.parentNode.style) {
        resetButton.parentNode.style.textAlign = 'center';
    }

    // 2. Estilizar el contenedor principal del test para que sea un cuadrado responsivo y centrado.
    Object.assign(testContainer.style, {
        position: 'relative', // Necesario para posicionar los círculos de forma absoluta.
        width: 'clamp(300px, 80vmin, 700px)', // Ancho responsivo con mínimo y máximo.
        aspectRatio: '1 / 1', // Mantiene el contenedor como un cuadrado.
        margin: '1em auto', // Centrado horizontal y margen vertical.
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    });

    // 3. Estilizar el panel de resultados para que coincida con el diseño centrado.
    Object.assign(resultsDiv.style, {
        maxWidth: '700px', // Mismo ancho máximo que el contenedor del test.
        margin: '2em auto',
        padding: '1.5em',
        border: '1px solid #eee',
        borderRadius: '8px'
    });

    // --- STYLING ---
    // Aplicar estilos al panel de instrucciones para centrarlo y mejorar su apariencia.
    // Esto se hace con JS para no tener que modificar un archivo CSS externo.
    Object.assign(instructionsPanel.style, {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'rgba(245, 245, 245, 0.97)',
        padding: '2em',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
        maxWidth: '500px',
        zIndex: '100' // Asegura que esté por encima del canvas y otros elementos.
    });

    // --- TEST CONFIGURATION ---
    const partAConfig = {
        title: "Trail Making Test (Parte A)",
        instructions: "Una las burbujas en orden numérico ascendente (1-2-3...). El tiempo comenzará cuando presione la burbuja '1'.",
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
        instructions: "Una las burbujas alternando entre números y letras (1-A-2-B...).",
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
                endTestButton.classList.remove('hidden'); // Mostrar botón para terminar manualmente
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

        // Ocultar el tablero y mostrar las instrucciones primero
        testContainer.classList.add('hidden');
        instructionsPanel.classList.remove('hidden');

        // Ocultar resultados al iniciar un nuevo test
        if (part === 'A') {
            resultsDiv.classList.add('hidden');
            partAResult = null;
            const historyContainer = document.getElementById('history-container');
            if (historyContainer) {
                historyContainer.classList.add('hidden');
            }
        }
        endTestButton.classList.add('hidden');

        timerDisplay.textContent = '0s';
        errorCounterDisplay.textContent = '0';
        hitCounterDisplay.textContent = '0';
        mainTitle.textContent = config.title;
        instructionsText.textContent = config.instructions;

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

    function resizeAndClearCanvas() {
        // Ajustar tamaño del canvas al contenedor una vez que es visible
        const rect = testContainer.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
            canvas.width = rect.width;
            canvas.height = rect.height;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
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
            errors: state.errorCount,
            hits: state.hitCount
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

            // --- CÁLCULOS DE RESULTADOS ---
            const correct_answers_A = partAResult.hits;
            const time_A = partAResult.timeInSeconds;
            const score_A = time_A > 0 ? (correct_answers_A / time_A) : 0;

            const correct_answers_B = partBResult.hits;
            const time_B = partBResult.timeInSeconds;
            const score_B = time_B > 0 ? (correct_answers_B / time_B) : 0;

            const total_correct_answers = correct_answers_A + correct_answers_B;
            const total_trail_making = score_A + score_B;

            // --- PREPARAR DATOS PARA GUARDAR ---
            const finalResultData = {
                date: new Date().toLocaleString('es-ES'), // Fecha y hora legibles
                partA: {
                    correct_answers: correct_answers_A,
                    time: time_A,
                    errors: partAResult.errors,
                    score: score_A
                },
                partB: {
                    correct_answers: correct_answers_B,
                    time: time_B,
                    errors: partBResult.errors,
                    score: score_B
                },
                total: {
                    total_correct_answers: total_correct_answers,
                    total_trail_making: total_trail_making
                }
            };

            saveResultToLocalStorage(finalResultData);
            // Los resultados se calculan y guardan, pero no se muestran al usuario.
            // Directamente se habilita el botón para finalizar la prueba.
            resetButton.textContent = 'Finalizar';
            resetButton.disabled = false;
        }
    }

    async function sendResultsAndExit() {
        resetButton.disabled = true;
        resetButton.textContent = 'Enviando...';

        const tmtHistory = JSON.parse(localStorage.getItem('tmtHistory'));

        if (!tmtHistory || tmtHistory.length === 0) {
            console.log("No hay historial para enviar. Redirigiendo...");
            window.location.href = 'login.html';
            return;
        }

        try {
            // IMPORTANTE: Reemplaza '/api/save-tmt-results' con tu endpoint real del backend.
            const response = await fetch('/api/save-tmt-results', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tmtHistory),
            });

            if (response.ok) {
                console.log('Resultados enviados exitosamente al servidor.');
                // 1. Limpiar el historial local después de enviarlo.
                localStorage.removeItem('tmtHistory');
                // 2. Redireccionar al login.
                window.location.href = 'login.html';
            } else {
                console.error('Error al enviar los resultados:', response.statusText);
                alert('Hubo un problema al guardar tus resultados. Por favor, intenta de nuevo.');
                resetButton.disabled = false;
                resetButton.textContent = 'Salir';
            }
        } catch (error) {
            console.error('Error de red al enviar los resultados:', error);
            alert('No se pudieron guardar los resultados. Revisa tu conexión a internet e intenta de nuevo.');
            resetButton.disabled = false;
            resetButton.textContent = 'Salir';
        }
    }

    function saveResultToLocalStorage(resultData) {
        try {
            // 1. Obtener el historial existente (o crear uno nuevo si no existe)
            const tmtHistory = JSON.parse(localStorage.getItem('tmtHistory')) || [];
            // 2. Añadir el nuevo resultado al historial
            tmtHistory.push(resultData);
            // 3. Guardar el historial actualizado en localStorage
            localStorage.setItem('tmtHistory', JSON.stringify(tmtHistory));
            console.log("Resultado guardado en localStorage:", resultData);
        } catch (error) {
            console.error("Error al guardar en localStorage:", error);
        }
    }

    function displayHistory() {
        let historyContainer = document.getElementById('history-container');
        if (!historyContainer) {
            historyContainer = document.createElement('div');
            historyContainer.id = 'history-container';
            // Aplicar estilos para centrar el contenedor del historial.
            Object.assign(historyContainer.style, {
                maxWidth: '700px',
                margin: '2em auto'
            });
            // Insertarlo después del div de resultados para una estructura lógica
            resultsDiv.parentNode.insertBefore(historyContainer, resultsDiv.nextSibling);
        }

        const tmtHistory = JSON.parse(localStorage.getItem('tmtHistory')) || [];

        if (tmtHistory.length === 0) {
            historyContainer.classList.add('hidden');
            return; // No hay nada que mostrar
        }

        historyContainer.classList.remove('hidden');

        // Construir la tabla del historial
        let tableHTML = `
            <hr style="margin: 2em 0;">
            <h3>Historial de Pruebas</h3>
            <table border="1" style="width: 100%; border-collapse: collapse; text-align: center;">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Puntaje (A)</th>
                        <th>Puntaje (B)</th>
                        <th>Aciertos Totales</th>
                        <th>Resultado Final</th>
                    </tr>
                </thead>
                <tbody>
        `;

        // Añadir una fila por cada resultado, mostrando los más recientes primero
        tmtHistory.slice().reverse().forEach(result => {
            tableHTML += `
                <tr>
                    <td>${result.date}</td>
                    <td>${result.partA.score.toFixed(2)}</td>
                    <td>${result.partB.score.toFixed(2)}</td>
                    <td>${result.total.total_correct_answers}</td>
                    <td><strong>${result.total.total_trail_making.toFixed(2)}</strong></td>
                </tr>
            `;
        });

        tableHTML += `</tbody></table>`;
        historyContainer.innerHTML = tableHTML;
    }

    function handleControlButtonClick() {
        const action = resetButton.textContent;

        switch (action) {
            case 'Iniciar Prueba':
                // El usuario ha leído las instrucciones y comienza la prueba.
                // Se ocultan las instrucciones, se muestra el tablero y se deshabilita el botón.
                instructionsPanel.classList.add('hidden');
                testContainer.classList.remove('hidden');
                resizeAndClearCanvas();
                resetButton.disabled = true;
                break;
            case 'Iniciar Parte B':
                // Prepara la Parte B, mostrando sus instrucciones.
                initializeTest('B');
                // Cambia el botón para que el usuario pueda iniciar la Parte B cuando esté listo.
                resetButton.textContent = 'Iniciar Prueba';
                resetButton.disabled = false;
                break;
            case 'Finalizar':
                // Ocultar el área de la prueba y mostrar un mensaje final.
                testContainer.classList.add('hidden');
                mainTitle.textContent = '¡Has finalizado la prueba!';

                // Cambiar el botón a "Salir" para el siguiente paso.
                resetButton.textContent = 'Salir';
                resetButton.disabled = false;
                break;
            case 'Salir':
                // Llama a la función que envía los datos, limpia el storage y redirige.
                //sendResultsAndExit();
                window.location.href = '/logout';
                break;
        }
    }

    // --- INICIALIZACIÓN ---
    resetButton.addEventListener('click', handleControlButtonClick);
    endTestButton.addEventListener('click', endTest);
    initializeTest('A'); // Preparar la Parte A al cargar la página
    resetButton.textContent = 'Iniciar Prueba'; // El botón se habilita para que el usuario comience
    resetButton.disabled = false; // cuando esté listo.
};
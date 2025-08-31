export function initStroop() {
    // Puedes agregar lógica de inicialización aquí si es necesario

    // VARIABLES
    const colors = ["ROJO", "AZUL", "VERDE", "AMARILLO"];
    const colorCodes = {
        ROJO: "red",
        AZUL: "blue",
        VERDE: "green",
        AMARILLO: "orange"
    };

    // TODAS LAS RESPUESTAS (100 elementos por tarea)
    const respuestas = {
        tarea1: [
            "ROJO", "VERDE", "AZUL", "VERDE", "ROJO", "AZUL", "ROJO", "AZUL", "VERDE", "AZUL", "VERDE", "ROJO", "VERDE", "AZUL", "ROJO", "AZUL", "ROJO", "VERDE", "ROJO", "VERDE",
            "AZUL", "VERDE", "ROJO", "AZUL", "ROJO", "VERDE", "AZUL", "VERDE", "ROJO", "AZUL", "ROJO", "AZUL", "VERDE", "AZUL", "VERDE", "ROJO", "AZUL", "ROJO",
            "VERDE", "ROJO", "AZUL", "ROJO", "VERDE", "AZUL", "VERDE", "ROJO", "AZUL", "VERDE", "AZUL", "ROJO", "AZUL", "ROJO", "VERDE", "ROJO", "AZUL", "VERDE", "ROJO", "VERDE",
            "ROJO", "AZUL", "VERDE", "ROJO", "AZUL", "VERDE", "AZUL", "VERDE", "ROJO", "AZUL", "ROJO", "VERDE", "ROJO", "VERDE", "AZUL", "VERDE", "ROJO", "AZUL", "VERDE", "AZUL",
            "AZUL", "VERDE", "ROJO", "AZUL", "VERDE", "ROJO", "VERDE", "ROJO", "AZUL", "VERDE", "ROJO", "AZUL", "VERDE", "ROJO", "AZUL", "ROJO", "VERDE", "AZUL", "ROJO", "VERDE"
        ],
        tarea2: [
            "AZUL", "ROJO", "VERDE", "AZUL", "VERDE", "ROJO", "VERDE", "ROJO", "AZUL", "ROJO", "AZUL", "VERDE", "ROJO", "VERDE", "AZUL", "VERDE", "AZUL", "ROJO", "VERDE", "AZUL",
            "ROJO", "AZUL", "VERDE", "ROJO", "VERDE", "AZUL", "VERDE", "ROJO", "AZUL", "ROJO", "AZUL", "VERDE", "AZUL", "VERDE", "ROJO", "VERDE", "ROJO", "AZUL", "ROJO", "VERDE",
            "AZUL", "VERDE", "ROJO", "AZUL", "ROJO", "VERDE", "ROJO", "AZUL", "VERDE", "ROJO", "VERDE", "AZUL", "ROJO", "VERDE", "AZUL", "VERDE", "ROJO", "AZUL", "VERDE", "AZUL",
            "VERDE", "ROJO", "AZUL", "VERDE", "ROJO", "AZUL", "VERDE", "ROJO", "AZUL", "VERDE", "AZUL", "ROJO", "AZUL", "ROJO", "VERDE", "AZUL", "VERDE", "ROJO", "AZUL", "ROJO",
            "ROJO", "AZUL", "VERDE", "ROJO", "AZUL", "VERDE", "ROJO", "AZUL", "VERDE", "AZUL", "VERDE", "ROJO", "AZUL", "VERDE", "ROJO", "AZUL", "ROJO", "VERDE", "AZUL", "ROJO"
        ],
        tarea3: [
            "AZUL", "ROJO", "VERDE", "AZUL", "VERDE", "ROJO", "VERDE", "ROJO", "AZUL", "ROJO", "AZUL", "VERDE", "ROJO", "VERDE", "AZUL", "VERDE", "AZUL", "ROJO", "VERDE", "AZUL",
            "ROJO", "AZUL", "VERDE", "ROJO", "VERDE", "AZUL", "VERDE", "ROJO", "AZUL", "ROJO", "AZUL", "VERDE", "AZUL", "VERDE", "ROJO", "VERDE", "ROJO", "AZUL", "ROJO", "VERDE",
            "AZUL", "VERDE", "ROJO", "AZUL", "ROJO", "VERDE", "ROJO", "AZUL", "VERDE", "ROJO", "VERDE", "AZUL", "ROJO", "VERDE", "AZUL", "VERDE", "ROJO", "AZUL", "VERDE", "AZUL",
            "VERDE", "ROJO", "AZUL", "VERDE", "ROJO", "AZUL", "VERDE", "ROJO", "AZUL", "VERDE", "AZUL", "ROJO", "AZUL", "ROJO", "VERDE", "AZUL", "VERDE", "ROJO", "AZUL", "ROJO",
            "ROJO", "AZUL", "VERDE", "ROJO", "AZUL", "VERDE", "ROJO", "AZUL", "VERDE", "AZUL", "VERDE", "ROJO", "AZUL", "VERDE", "ROJO", "AZUL", "ROJO", "VERDE", "AZUL", "ROJO"
        ]
    };

    const tasks = [
        { name: "Tarea 1", instructions: "Selecciona la palabra correcta (ignora el color).", type: "word" },
        { name: "Tarea 2", instructions: "Selecciona el color de las XXXX.", type: "colorXXXX" },
        { name: "Tarea 3", instructions: "Selecciona el color con que está escrita la palabra (palabra aleatoria distinta del color).", type: "colorWord" }
    ];

    let currentTask = 0;
    let currentTrial = 0;
    let score = 0;
    let timer;
    let timeLeft = 45;
    let scoresPorTarea = [0, 0, 0];

    // Variables para almacenar los resultados de cada tarea
    let p = 0;   // Tarea 1
    let c = 0;   // Tarea 2
    let pc = 0;  // Tarea 3

    // Variable para almacenar el resultado de la ecuación P_C
    let P_C = 0;

    // variable que se encarga de calcular la interferencia 
    let Interference = 0;

    // Variables para almacenar el tiempo de cada tarea
    let time_homework_p = 0;
    let time_homework_c = 0;
    let time_homework_pc = 0;

    let time = 0; // Variable para almacenar el tiempo total en segundos
    let climb = "Prueba";

    // DOM
    const startBtn = document.getElementById('stroop-start-btn');
    const startTaskBtn = document.getElementById('stroop-start-task-btn');
    const testDiv = document.getElementById('stroop-test');
    const taskTitle = document.getElementById('stroop-task-title');
    const instructions = document.getElementById('stroop-instructions');
    const stimulusDiv = document.getElementById('stroop-stimulus');
    const optionsDiv = document.getElementById('stroop-options');
    const resultDiv = document.getElementById('stroop-result');
    const timerDiv = document.getElementById('stroop-timer');
    const taskCounter = document.getElementById('stroop-task-counter');


    // Iniciar test

    startBtn.addEventListener('click', () => {
        loadState();
        startBtn.classList.add('hidden');
        testDiv.classList.remove('hidden');
        showInstructions();
        saveState();
    });





    // Mostrar instrucciones
    function showInstructions() {
        if (currentTask >= tasks.length) {
            showResult();
            return;
        }
        const task = tasks[currentTask];
        taskTitle.textContent = task.name;
        taskTitle.classList.remove('hidden');
        instructions.textContent = task.instructions;
        instructions.classList.remove('hidden');
        taskCounter.textContent = `Tarea ${currentTask + 1} de ${tasks.length}`;
        startTaskBtn.classList.remove('hidden');
        timerDiv.classList.add('hidden');
        stimulusDiv.textContent = "";
        stimulusDiv.classList.add('hidden');
        optionsDiv.innerHTML = "";
    }

    // Botón para comenzar tarea
    startTaskBtn.addEventListener('click', () => {
        startTaskBtn.classList.add('hidden');
        instructions.classList.add('hidden'); // oculta el enunciado
        taskTitle.classList.add('hidden');    // oculta el título de la tarea
        taskCounter.classList.add('hidden');  // oculta el contador
        timerDiv.classList.add('hidden');     // oculta el tiempo
        loadTask();
        saveState();
    });

    // Cronómetro ya no se muestra en pantalla, pero sigue contando internamente
    function startTimer() {
        // Si timeLeft ya tiene un valor (restaurado), úsalo; si no, ponlo en 45 para el localstorage
        if (typeof timeLeft !== "number" || timeLeft > 45 || timeLeft <= 0) {
            timeLeft = 45;
        }
        timer = setInterval(() => {
            timeLeft--;
            saveState(); // Guarda el tiempo restante en cada tick
            if (timeLeft <= 0) {
                if (currentTask === 0) time_homework_p = 45;
                if (currentTask === 1) time_homework_c = 45;
                if (currentTask === 2) time_homework_pc = 45;
                time += 45;
                clearInterval(timer);
                saveState();
                nextTask();
            }
        }, 1000);
    }

    // Cargar tarea
    function loadTask() {
        if (currentTask >= tasks.length) {
            showResult();
            return;
        }
        currentTrial = 0;
        startTimer();
        nextTrial();
    }

    // Mostrar estímulos
    function nextTrial() {
        let totalTrials = respuestas.tarea1.length; // 100
        if (currentTrial >= totalTrials) {
            // Al terminar la tarea, guarda el resultado en la variable correspondiente
            if (currentTask === 0) p = scoresPorTarea[0];
            if (currentTask === 1) c = scoresPorTarea[1];
            if (currentTask === 2) pc = scoresPorTarea[2];
            saveState();
            nextTask();
            return;
        }
        optionsDiv.innerHTML = "";
        let correctAnswer = "";

        stimulusDiv.classList.remove('hidden');

        if (tasks[currentTask].type === "word") {
            correctAnswer = respuestas.tarea1[currentTrial];
            stimulusDiv.textContent = correctAnswer;
            stimulusDiv.style.color = "black";
        } else if (tasks[currentTask].type === "colorXXXX") {
            correctAnswer = respuestas.tarea2[currentTrial];
            stimulusDiv.textContent = "XXXX";
            stimulusDiv.style.color = colorCodes[correctAnswer];
        } else if (tasks[currentTask].type === "colorWord") {
            correctAnswer = respuestas.tarea3[currentTrial];
            let randomWord;
            do {
                randomWord = colors[Math.floor(Math.random() * colors.length)];
            } while (randomWord === correctAnswer); // aseguramos que NO coincidan
            stimulusDiv.textContent = randomWord;
            stimulusDiv.style.color = colorCodes[correctAnswer];
        }

        colors.forEach(color => {
            const btn = document.createElement('button');
            btn.textContent = color;
            btn.onclick = () => {
                if (btn.textContent === correctAnswer) {
                    score++;
                    scoresPorTarea[currentTask]++;
                }
                currentTrial++;
                saveState();
                nextTrial();
            };
            optionsDiv.appendChild(btn);
        });
    }

    // Siguiente tarea
    function nextTask() {
        clearInterval(timer);
        // Guarda el tiempo usado en esta tarea (45 - timeLeft)
        let usedTime = 45 - timeLeft;
        if (currentTask === 0) time_homework_p = usedTime;
        if (currentTask === 1) time_homework_c = usedTime;
        if (currentTask === 2) time_homework_pc = usedTime;
        time += usedTime;
        timeLeft = 45; // Reinicia el tiempo para la siguiente tarea
        currentTask++;
        saveState();
        showInstructions();
    }


    // Variable para almacenar el resultado de la ecuación total_stroop
    let total_stroop = 0;

    // Función para clasificar el resultado de total_stroop
    function climbs(total_stroop) {
        if (total_stroop <= 0.29) {
            return "muy bajo";
        } else if (total_stroop <= 0.6) {
            return "bajo";
        } else if (total_stroop <= 0.9) {
            return "medio";
        } else {
            return "alto";
        }
    }

    function showResult() {
        testDiv.classList.add('hidden');
        resultDiv.classList.remove('hidden');

        // Asigna los resultados finales a las variables por si acaso
        p = scoresPorTarea[0];
        c = scoresPorTarea[1];
        pc = scoresPorTarea[2];

        // Calcula P_C solo si P + C no es 0 para evitar división por cero
        if ((p + c) !== 0) {
            P_C = (p * c) / (p + c);
        } else {
            P_C = 0;
        }

        // calcular la interferencia
        Interference = pc - P_C;

        // Calcula total_stroop solo si time no es 0 para evitar división por cero
        if (time !== 0) {
            total_stroop = (p + c + pc) / time;
        } else {
            total_stroop = 0;
        }

        // Clasificación usando climb
        climb = climbs(total_stroop);

        //fin del test
        let detalle = `
    <h2>test completado</h2>
    <button id="stroop-next-test-btn">
    <a href="/gonogo" id="stroop-next-test-link">Siguiente test</a>
    </button>
    `;
        resultDiv.innerHTML = detalle;

        // Limpiar el estado guardado al salir para permitir volver a hacer el test
        // const exitLink = document.getElementById('stroop-next-test-link');
        // if (exitLink) {
        //     exitLink.addEventListener('click', () => {
        //         localStorage.removeItem('stroop_state');
        //     });
        // }
    }

    // Guardar estado en localStorage
    function saveState() {
        const state = {
            currentTask,
            currentTrial,
            score,
            scoresPorTarea,
            p,
            c,
            pc,
            P_C,
            Interference,
            time_homework_p,
            time_homework_c,
            time_homework_pc,
            time,
            total_stroop,
            timeLeft, // <-- Guarda el tiempo restante de la tarea actual
            climb
        };
        localStorage.setItem('stroop_state', JSON.stringify(state));
    }

    // Cargar estado desde localStorage
    function loadState() {
        const state = JSON.parse(localStorage.getItem('stroop_state'));
        if (state) {
            currentTask = state.currentTask;
            currentTrial = state.currentTrial;
            score = state.score;
            scoresPorTarea = state.scoresPorTarea;
            p = state.p;
            c = state.c;
            pc = state.pc;
            P_C = state.P_C;
            Interference = state.Interference;
            time_homework_p = state.time_homework_p;
            time_homework_c = state.time_homework_c;
            time_homework_pc = state.time_homework_pc;
            time = state.time;
            total_stroop = state.total_stroop;
            if (typeof state.timeLeft === "number") {
                timeLeft = state.timeLeft; // <-- Restaura el tiempo restante
            } else {
                timeLeft = 45;
            }
            climb = state.climb;
        }
    }

    // Al cargar la página, si hay estado guardado, reanuda automáticamente
    window.addEventListener('DOMContentLoaded', () => {
        const state = localStorage.getItem('stroop_state');
        if (state) {
            loadState();
            startBtn.classList.add('hidden');
            testDiv.classList.remove('hidden');
            // Si estabas en medio de una tarea, reanuda la tarea
            if (currentTask < tasks.length) {
                showInstructions();
                // Si ya habías empezado la tarea, reanuda la tarea directamente
                if (currentTrial > 0 && currentTrial < respuestas.tarea1.length) {
                    startTaskBtn.classList.add('hidden');
                    instructions.classList.add('hidden');
                    taskTitle.classList.add('hidden');
                    taskCounter.classList.add('hidden');
                    timerDiv.classList.add('hidden');
                    loadTask();
                }
            } else {
                showResult();
            }
        }
    });

}

export function GoNoGoGame() {
    const container = document.getElementById('GoNoGo-section');
    const STAGE_DURATION_MS = 45000;
    const MAX_RESPONSE = 100;
    const STAGES = [
        {
            name: 'Palabras',
            stimuli: ["No", "Otro", "Si", "Otro", "Otro", "Otro", "No", "Si"],
            getExpectedResponse: (s) => {
                const normalized = s.trim().toUpperCase();
                if (normalized === 'SI') return 'no';
                if (normalized === 'NO') return 'si';
                return 'otro';
            },
            renderStimulus: (s, el) => {
                el.textContent = s;
                el.classList.add('stimulus-text');
            },
            instructions: `Marca "NO" cuando veas "SI", "SÍ" cuando veas "NO" y "OTRO" con cualquier otra sílaba.`
        },
        {
            name: 'Colores Invertidos',
            stimuli: ["rojo", "otro", "azul", "otro", "azul", "rojo"],
            getExpectedResponse: (c) => {
                const normalized = c.toLowerCase();
                if (normalized === 'rojo') return 'azul';
                if (normalized === 'azul') return 'rojo';
                return 'otro';
            },
            renderStimulus: (c, el) => {
                el.textContent = '';
                let displayColor = c;
                if (c === 'otro') {
                    displayColor = Math.random() < 0.5 ? 'amarillo' : 'verde';
                }
                el.classList.add('stimulus-circle', `color-${displayColor}`);
            },
            instructions: 'Presiona "AZUL" si ves ROJO, "ROJO" si ves AZUL, o "OTRO" para cualquier otro color.'
        },
        {
            name: 'Signos',
            stimuli: ["/", "( )", ">", "%", "( )", "&"],
            getExpectedResponse: (s) => {
                if (s === '/') return '>';
                if (s === '>') return '/';
                if (s === '( )') return 'x';
                return 'otro';
            },
            renderStimulus: (s, el) => {
                el.textContent = s;
                el.classList.add('stimulus-sign');
            },
            instructions: 'Marca ">" cuando aparece "/", "/" cuando aparece ">", "x" cuando aparece "()", y "OTRO" en cualquier otro símbolo.'
        }
    ];

    // --- Estado ---
    let stageIndex = 0;
    let currentStage = null;
    let running = false;
    let responded = false;
    let trialStartTime = 0;
    let currentStimulus = '';
    let data = [];
    let stageTimer = null;
    let stageStartTime = 0;
    let endedByTimeout = false;

    // métricas
    let hw_time_1 = 0, hw_time_2 = 0, hw_time_3 = 0;
    let hw_answer_1 = 0, hw_answer_2 = 0, hw_answer_3 = 0;
    let hw_score_1 = 0, hw_score_2 = 0, hw_score_3 = 0;

    // elementos DOM
    const el = {
        stimulus: container.querySelector('#stimulus'),
        results: container.querySelector('#results'),
        startBtn: container.querySelector('#start'),
        stageIntro: container.querySelector('#stage-intro'),
        stageTitle: container.querySelector('#stage-title'),
        stageInstructions: container.querySelector('#stage-instructions'),
        stageProgress: container.querySelector('#stage-progress'),
        beginStageBtn: container.querySelector('#begin-stage'),
        encabezado: container.querySelector('#encabezado'),
        nextStageBtn: container.querySelector('#next-stage'),
    };

    // ==== helpers ====
    function resetStimulusStyle() {
        el.stimulus.className = '';
        el.stimulus.textContent = '';
    }

    function showButtonsForStage(stageName) {
        const siNoOtro = container.querySelector('#section-si-no-otro');
        const colores = container.querySelector('#section-colores');
        const signals = container.querySelector('#section-signals');
        [siNoOtro, colores, signals].forEach(sec => {
            sec.classList.add('d-none');
            sec.classList.remove('d-flex', 'justify-content-center', 'gap-3', 'mt-3');
        });
        const show = (el) => { el.classList.remove('d-none'); el.classList.add('d-flex', 'justify-content-center', 'gap-3', 'mt-3'); };
        if (stageName === 'Palabras') show(siNoOtro);
        else if (stageName === 'Colores Invertidos') show(colores);
        else if (stageName === 'Signos') show(signals);
    }

    // ==== lógica ====
    function showStageIntro(stage, index) {
        el.encabezado.classList.add('d-none');
        el.stimulus.style.display = 'none';
        el.results.innerHTML = '';
        el.stageTitle.textContent = `Etapa ${index + 1}: ${stage.name}`;
        el.stageInstructions.textContent = stage.instructions;
        el.stageProgress.textContent = `Etapa ${index + 1} de ${STAGES.length}`;
        el.stageIntro.classList.remove('d-none');

        el.beginStageBtn.onclick = () => {
            el.stageIntro.classList.add('d-none');
            runStage(stage);
        };
    }

    function runStage(stage) {
        currentStage = stage;
        data = [];
        responded = false;
        el.results.innerHTML = '';
        el.startBtn.style.display = 'none';
        el.nextStageBtn.classList.add('d-none');
        showButtonsForStage(stage.name);

        running = true;
        el.stimulus.style.display = 'flex';
        stageStartTime = Date.now();
        endedByTimeout = false;
        nextTrial(stage);

        stageTimer = setTimeout(() => {
            running = false;
            endedByTimeout = true;
            showResults(stage.name);
        }, STAGE_DURATION_MS);
    }

    function nextTrial(stage) {
        if (!running) return;
        resetStimulusStyle();
        responded = false;
        currentStimulus = stage.stimuli[Math.floor(Math.random() * stage.stimuli.length)];
        stage.renderStimulus(currentStimulus, el.stimulus);
        trialStartTime = Date.now();
    }

    function recordResponse(response) {
        if (!running || responded || !currentStage) return;
        responded = true;
        const expected = currentStage.getExpectedResponse(currentStimulus);
        const correct = response === expected;
        const now = Date.now();
        data.push({
            stimulus: currentStimulus, response, expected, correct,
            rt: now - trialStartTime, tStimulus: trialStartTime, tResponse: now
        });
        if (data.length >= MAX_RESPONSE) {
            running = false;
            clearTimeout(stageTimer);
            endedByTimeout = false;
            showResults(currentStage.name);
            return;
        }
        nextTrial(currentStage);
    }

    function showResults(stageName) {
        if (stageTimer) clearTimeout(stageTimer);
        el.stimulus.style.display = 'none';
        showButtonsForStage('');

        let stageDurationMs = endedByTimeout ? STAGE_DURATION_MS : (data.length > 0 ? (data[data.length - 1].tResponse - stageStartTime) : STAGE_DURATION_MS);
        const correct = data.filter(d => d.correct).length;
        const durationSec = stageDurationMs / 1000;
        const score = durationSec > 0 ? (correct / durationSec) : 0;

        if (stageIndex === 0) { hw_time_1 = +durationSec.toFixed(3); hw_answer_1 = correct; hw_score_1 = +score.toFixed(3); }
        else if (stageIndex === 1) { hw_time_2 = +durationSec.toFixed(3); hw_answer_2 = correct; hw_score_2 = +score.toFixed(3); }
        else if (stageIndex === 2) { hw_time_3 = +durationSec.toFixed(3); hw_answer_3 = correct; hw_score_3 = +score.toFixed(3); }

        // guardar en localStorage
        savePartialResult();

        stageIndex++;
        if (stageIndex < STAGES.length) {
            showStageIntro(STAGES[stageIndex], stageIndex);
        } else {
            computeAndFinish();
        }
    }

    function savePartialResult() {
        const payload = {
            hw_time_1, hw_time_2, hw_time_3,
            hw_answer_1, hw_answer_2, hw_answer_3,
            hw_score_1, hw_score_2, hw_score_3
        };
        localStorage.setItem("gonogo_progress", JSON.stringify({ stageIndex, payload }));
    }

    function computeAndFinish() {
        const a1 = hw_answer_1 || 0, a2 = hw_answer_2 || 0, a3 = hw_answer_3 || 0;
        const s1 = hw_score_1 || 0, s2 = hw_score_2 || 0, s3 = hw_score_3 || 0;
        let total_homewor = (a1 + a2) !== 0 ? (a1 * a2) / (a1 + a2) : 0;
        let Interference = a3 - total_homewor;
        let total_gonogo = ((s1 + s2 + s3) / 3).toFixed(3);
        let total_gonogo_answer = ((a1 + a2 + a3) / 3).toFixed(3);
        let climb = 'Bajo';
        if (total_gonogo > 0.87) climb = 'Alto';
        else if (total_gonogo > 0.44) climb = 'Medio';

        const finalPayload = {
            hw_time_1, hw_time_2, hw_time_3,
            hw_answer_1, hw_answer_2, hw_answer_3,
            hw_score_1, hw_score_2, hw_score_3,
            total_homewor: +total_homewor.toFixed(3),
            Interference: +Interference.toFixed(3),
            total_gonogo: +total_gonogo,
            total_gonogo_answer: +total_gonogo_answer,
            climb
        };

        localStorage.setItem("gonogo_final", JSON.stringify(finalPayload));

        el.results.innerHTML = '<b>¡Juego finalizado!</b>';
        el.nextStageBtn.textContent = "Siguiente test";
        el.nextStageBtn.classList.remove('d-none');
        el.nextStageBtn.onclick = () => {
            window.location.href = "/tower";
        };


        // === listeners ===
        const responseMap = [
            ['#si', 'si'], ['#no', 'no'], ['#otro', 'otro'],
            ['#rojo', 'rojo'], ['#azul', 'azul'], ['#otro-color', 'otro'],
            ['#xl', '>'], ['#l', '/'], ['#xx', 'x'], ['#otro-signo', 'otro']
        ];
        responseMap.forEach(([sel, resp]) => {
            const btn = container.querySelector(sel);
            if (btn) {
                btn.addEventListener('click', () => {
                    // feedback visual
                    btn.classList.add('pressed');
                    setTimeout(() => btn.classList.remove('pressed'), 150);

                    // registrar respuesta
                    recordResponse(resp);
                });
            }
        });

    }

    // === listeners ===
    const responseMap = [
        ['#si', 'si'], ['#no', 'no'], ['#otro', 'otro'],
        ['#rojo', 'rojo'], ['#azul', 'azul'], ['#otro-color', 'otro'],
        ['#xl', '>'], ['#l', '/'], ['#xx', 'x'], ['#otro-signo', 'otro']
    ];
    responseMap.forEach(([sel, resp]) => {
        const btn = container.querySelector(sel);
        if (btn) btn.addEventListener('click', () => recordResponse(resp));
    });
    el.startBtn.addEventListener('click', () => start());

    function start() {
        // validar progreso previo
        const saved = JSON.parse(localStorage.getItem("gonogo_progress") || "null");
        if (saved) {
            stageIndex = saved.stageIndex;
            Object.assign({
                hw_time_1, hw_time_2, hw_time_3,
                hw_answer_1, hw_answer_2, hw_answer_3,
                hw_score_1, hw_score_2, hw_score_3
            }, saved.payload);
        } else stageIndex = 0;

        if (stageIndex < STAGES.length) showStageIntro(STAGES[stageIndex], stageIndex);
        else computeAndFinish();
    }

    return { start };
}

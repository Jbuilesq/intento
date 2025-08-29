export default class GoNoGoGame {

    static #STAGE_DURATION_MS = 45000; // 45s por etapa
    static #MAX_RESPONSE = 100;
    static #STAGES = [
        {
            name: 'Palabras',
            stimuli: [" No", "Otro", "Si", "Otro", "Otro", "Otro", "No", "Si", "Otro", "Otro", "Otro", "No", "Otro", "No", "Otro", "Si", "No", "Otro", "No", "No", "Si",
                "Otro", "Otro", "No", "Si", "No", "Otro", "Si", "Otro", "Otro", "Otro", "No", "Si", "Otro", "Otro", "Otro", "No", "Otro", "No", "Otro", "Si", "No",
                "Otro", "No", "No", "Si", "Otro", "Otro", "No", "Si", "Si", "Otro", "Otro", "Otro", "No", "Otro", "No", "Otro", "Si", "No", "Otro", "No", "No", "Si",
                "Otro", "Otro", "No", "Si", "No", "Otro", "Si", "Otro", "Otro", "Otro", "No", "Si", "Otro", "Otro", "Otro", "No", "Otro", "No", "Otro", "No", "Si", "Si", "Otro", "Otro", "Otro",
                "No", "Otro", "No", "Otro", "Otro", "No", "Otro", "Si", "No", "Otro", "No", "No", "Si", "Otro"
            ],
            getExpectedResponse: (s) => {
                const normalized = s.trim().toUpperCase();
                if (normalized === 'SI') return 'no';
                if (normalized === 'NO') return 'si';
                return 'otro';
            },
            renderStimulus: (s, stimulusEl) => {
                stimulusEl.textContent = s;
                stimulusEl.classList.add('stimulus-text');
            },
            instructions:
                `Marca "NO" cuando veas "SI", "SÍ" cuando veas "NO" y "OTRO" con cualquier otra sílaba.`
        },
        {
            name: 'Colores Invertidos',
            stimuli: ["rojo", "otro", "azul", "otro", "azul", "rojo", "otro", "azul", "otro", "otro", "azul", "otro", "rojo", "otro", "azul", "azul", "rojo", "otro", "azul", "rojo",
                "otro", "azul", "otro", "rojo", "otro", "rojo", "otro", "azul", "otro", "azul", "rojo", "otro", "azul", "otro", "otro", "azul", "otro", "rojo", "otro", "azul",
                "otro", "rojo", "otro", "azul", "rojo", "otro", "azul", "otro", "rojo", "otro", "azul", "otro", "otro", "azul", "otro", "rojo", "otro", "otro", "azul", "rojo",
                "otro", "azul", "rojo", "otro", "azul", "otro", "rojo", "otro", "rojo", "otro", "azul", "otro", "azul", "rojo", "otro", "azul", "otro", "otro", "azul", "otro",
                "azul", "otro", "azul", "rojo", "otro", "azul", "otro", "otro", "azul", "otro", "rojo", "otro", "azul", "otro", "azul", "rojo", "otro", "azul", "otro", "rojo"
            ],
            getExpectedResponse: (c) => {
                const normalized = c.toLowerCase();
                if (normalized === 'rojo') return 'azul';
                if (normalized === 'azul') return 'rojo';
                return 'otro';
            },
            renderStimulus: (c, stimulusEl) => {
                stimulusEl.textContent = '';
                let displayColor = c;
                if (c === 'otro') {
                    displayColor = Math.random() < 0.5 ? 'amarillo' : 'verde';
                }
                stimulusEl.classList.add('stimulus-circle', `color-${displayColor}`);
            },
            instructions:
                'Presiona "AZUL" si ves ROJO, "ROJO" si ves AZUL, o "OTRO" para cualquier otro color (amarillo o verde).'
        },
        {
            name: 'Signos',
            stimuli: ["/", "( )", ">", "%", "( )", "&", "( )", "/", "( )", "&", "/", "( )", "( )", "%", "/", "&", ">", "/", "%",
                "/", "( )", "/", ">", "( )", "/", ">", "%", "( )", "&", "( )", "/", ">", "( )", "&", "/", ">", "( )", "( )", "%",
                "/", "&", ">", "/", "%", "/", "( )", "/", "&", "( )", "/", "( )", "&", "%", "( )", "&", "( )", "/", "&", "( )",
                "&", "/", "( )", "( )", "%", "/", "&", ">", "/", "%", "/", "( )", "/", "&", "( )", "/", "( )", "&", ">", "/", "%",
                "/", "( )", "/", "( )", "&", "( )", "/", "( )", "&", "/", "( )", "( )", "%", "/", "&", ">", "/", "%",
            ],
            getExpectedResponse: (s) => {
                if (s === '/') return '>';
                if (s === '>') return '/';
                if (s === '( )') return 'x';
                return 'otro';
            },
            renderStimulus: (s, stimulusEl) => {
                stimulusEl.textContent = s;
                stimulusEl.classList.add('stimulus-sign');
            },
            instructions:
                'Marca ">" cuando aparece "/", "/" cuando aparece ">", "x" cuando aparece "()", y "OTRO" en cualquier otro símbolo (&, %).'
        }
    ];

    constructor(container, onComplete, options = {}) {
        this.container = container;
        this.onComplete = onComplete;
        this.debug = options.debug ?? false;
        this.participantId = options.participantId || null;
        this.sessionId = options.sessionId || null;

        // --- Estado del juego ---
        this.hw_time_1 = 0; this.hw_time_2 = 0; this.hw_time_3 = 0;
        this.hw_answer_1 = 0; this.hw_answer_2 = 0; this.hw_answer_3 = 0;
        this.hw_score_1 = 0; this.hw_score_2 = 0; this.hw_score_3 = 0;
        this.stageStartTime = 0;
        this.endedByTimeout = false;
        this.data = [];
        this.running = false;
        this.currentStimulus = '';
        this.trialStartTime = 0;
        this.responded = false;
        this.stageIndex = 0;
        this.stageTimer = null;
        this.currentStage = null;

        this.#findElements();
        this.#attachInitialListeners();
    }

    #findElements() {
        this.elements = {
            stimulus: this.container.querySelector('#stimulus'),
            results: this.container.querySelector('#results'),
            startBtn: this.container.querySelector('#start'),
            stageIntro: this.container.querySelector('#stage-intro'),
            stageTitle: this.container.querySelector('#stage-title'),
            stageInstructions: this.container.querySelector('#stage-instructions'),
            stageProgress: this.container.querySelector('#stage-progress'),
            beginStageBtn: this.container.querySelector('#begin-stage'),
            nextStageBtn: this.container.querySelector('#next-stage'),
            encabezado: this.container.querySelector('#encabezado'),
        };
    }

    
    #resetStimulusStyle() {
   
        this.elements.stimulus.className = '';
        this.elements.stimulus.textContent = '';
    }

    #showButtonsForStage(stageName) {
        const sectionSiNoOtro = this.container.querySelector('#section-si-no-otro');
        const sectionColores = this.container.querySelector('#section-colores');
        const sectionSignals = this.container.querySelector('#section-signals');

        [sectionSiNoOtro, sectionColores, sectionSignals].forEach(sec => {
            sec.classList.add('d-none');
            sec.classList.remove('d-flex', 'justify-content-center', 'gap-3', 'mt-3');
        });

        const show = (el) => {
            el.classList.remove('d-none');
            el.classList.add('d-flex', 'justify-content-center', 'gap-3', 'mt-3');
        };

        if (stageName === 'Palabras') show(sectionSiNoOtro);
        else if (stageName === 'Colores Invertidos') show(sectionColores);
        else if (stageName === 'Signos') show(sectionSignals);
    }

  
    #showStageIntro(stage, index) {
        this.container.querySelector('#encabezado').classList.add('d-none');

        this.elements.stimulus.style.display = 'none';
        this.elements.results.innerHTML = '';
        this.elements.stageTitle.textContent = `Etapa ${index + 1}: ${stage.name}`;
        this.elements.stageInstructions.textContent = stage.instructions;
        this.elements.stageProgress.textContent = `Etapa ${index + 1} de ${GoNoGoGame.#STAGES.length}`;

        this.elements.stageIntro.classList.remove('d-none');

        this.elements.beginStageBtn.onclick = () => {
            this.elements.stageIntro.classList.add('d-none');
            this.#runStage(stage);
        };
    }

    #runStage(stage) {
        this.currentStage = stage;  
        this.data = [];
        this.responded = false;
        this.elements.results.innerHTML = '';
        this.elements.startBtn.style.display = 'none';
        this.elements.nextStageBtn.classList.add('d-none');
        this.#showButtonsForStage(stage.name);

        this.running = true;
        this.elements.stimulus.style.display = 'flex';

        this.stageStartTime = Date.now();
        this.endedByTimeout = false;

        this.#nextTrial(stage);

        
        this.stageTimer = setTimeout(() => {
            this.running = false;
            this.endedByTimeout = true;
    
            this.#showResults(this.currentStage.name);
        }, GoNoGoGame.#STAGE_DURATION_MS);
    }

    #nextTrial(stage) {
        if (!this.running) return;
        this.#resetStimulusStyle();
        this.responded = false;

        this.currentStimulus = stage.stimuli[Math.floor(Math.random() * stage.stimuli.length)];
        stage.renderStimulus(this.currentStimulus, this.elements.stimulus);
        this.trialStartTime = Date.now();
    }

    #recordResponse(response) {
        if (!this.running || this.responded || !this.currentStage) {
            console.log('Ignorado clic', { running: this.running, responded: this.responded, currentStage: this.currentStage?.name });
            return;
        }
        this.responded = true;

        const expected = this.currentStage.getExpectedResponse(this.currentStimulus);
        const correct = response === expected;
        const now = Date.now();

        this.data.push({
            stimulus: this.currentStimulus,
            response,
            expected,
            correct,
            rt: now - this.trialStartTime,
            tStimulus: this.trialStartTime,
            tResponse: now
        });


        if (this.data.length >= GoNoGoGame.#MAX_RESPONSE) {
            this.running = false;
            clearTimeout(this.stageTimer);
            this.endedByTimeout = false;
            this.#showResults(this.currentStage.name);
            return;
        }


        this.#nextTrial(this.currentStage);
    }


    #showResults(stageName) {
        if (this.stageTimer) clearTimeout(this.stageTimer);
        this.elements.stimulus.style.display = 'none';
        this.#showButtonsForStage('');

        let stageDurationMs;
        if (this.endedByTimeout) {
            stageDurationMs = GoNoGoGame.#STAGE_DURATION_MS;
        } else if (this.data.length > 0) {
            stageDurationMs = this.data[this.data.length - 1].tResponse - this.stageStartTime;
        } else {
            stageDurationMs = GoNoGoGame.#STAGE_DURATION_MS;
        }

        const correct = this.data.filter(d => d.correct).length;
        const durationSec = stageDurationMs / 1000;

        const score = durationSec > 0 ? (correct / durationSec) : 0;
        if (this.stageIndex === 0) {
            this.hw_time_1 = Number(durationSec.toFixed(3));
            this.hw_answer_1 = correct;
            this.hw_score_1 = Number(score.toFixed(3));
        } else if (this.stageIndex === 1) {
            this.hw_time_2 = Number(durationSec.toFixed(3));
            this.hw_answer_2 = correct;
            this.hw_score_2 = Number(score.toFixed(3));
        } else if (this.stageIndex === 2) {
            this.hw_time_3 = Number(durationSec.toFixed(3));
            this.hw_answer_3 = correct;
            this.hw_score_3 = Number(score.toFixed(3));
        }


        console.log('Métricas etapa', this.stageIndex + 1, {
            stage: stageName,
            duration: (this.stageIndex === 0 ? this.hw_time_1 : this.stageIndex === 1 ? this.hw_time_2 : this.hw_time_3),
            correctAnswers: (this.stageIndex === 0 ? this.hw_answer_1 : this.stageIndex === 1 ? this.hw_answer_2 : this.hw_answer_3),
            score: (this.stageIndex === 0 ? this.hw_score_1 : this.stageIndex === 1 ? this.hw_score_2 : this.hw_score_3)
        });


        this.elements.nextStageBtn.classList.remove('d-none');
    }

    #attachInitialListeners() {
        const responseMap = [
            ['#si', 'si'],
            ['#no', 'no'],
            ['#otro', 'otro'],
            ['#rojo', 'rojo'],
            ['#azul', 'azul'],
            ['#otro-color', 'otro'],
            ['#xl', '>'],
            ['#l', '/'],
            ['#xx', 'x'],
            ['#otro-signo', 'otro'],
        ];

        responseMap.forEach(([selector, resp]) => {
            const btn = this.container.querySelector(selector);
            if (!btn) return;
            this.#addBounceEffect(btn);
            btn.addEventListener('click', () => {
                this.#recordResponse(resp);
            });
        });

        this.elements.startBtn.addEventListener('click', () => this.start());

        this.elements.nextStageBtn.addEventListener('click', () => {
            this.elements.nextStageBtn.classList.add('d-none');
            this.stageIndex++;
            if (this.stageIndex < GoNoGoGame.#STAGES.length) {
                this.#showStageIntro(GoNoGoGame.#STAGES[this.stageIndex], this.stageIndex);
            } else {
                this.#computeAndSendFinalResults();
            }
        });
    }

    #addBounceEffect(button) {
        if (!button) return;
        button.addEventListener('click', () => {
            button.classList.remove('btn-bounce');
            void button.offsetWidth;
            button.classList.add('btn-bounce');
        });
    }

    start() {
        this.stageIndex = 0;
        this.#showStageIntro(GoNoGoGame.#STAGES[this.stageIndex], this.stageIndex);
    }


    #computeAndSendFinalResults() {

        const a1 = Number(this.hw_answer_1 || 0);
        const a2 = Number(this.hw_answer_2 || 0);
        const a3 = Number(this.hw_answer_3 || 0);
        const s1 = Number(this.hw_score_1 || 0);
        const s2 = Number(this.hw_score_2 || 0);
        const s3 = Number(this.hw_score_3 || 0);

        let total_homework = 0;
        if ((a1 + a2) !== 0) {
            total_homework = (a1 * a2) / (a1 + a2);
        } else {
            total_homework = 0; 
        }

    
        let interference = a3 - total_homework;

  
        let total_gonogo = (s1 + s2 + s3) / 3;


        let total_gonogo_answer = (a1 + a2 + a3) / 3;

        total_gonogo = Number(total_gonogo.toFixed(3));

        let climb = 'Bajo'; // default
    if (total_gonogo <= 0.44) {
        climb = 'Bajo';
    } else if (total_gonogo <= 0.87) {
        climb = 'Medio';
    } else {
        climb = 'Alto';
    }

        const finalPayload = {
            hw_time_1: this.hw_time_1,
            hw_time_2: this.hw_time_2,
            hw_time_3: this.hw_time_3,
            hw_answer_1: this.hw_answer_1,
            hw_answer_2: this.hw_answer_2,
            hw_answer_3: this.hw_answer_3,
            hw_score_1: this.hw_score_1,
            hw_score_2: this.hw_score_2,
            hw_score_3: this.hw_score_3,
            total_homework: Number(total_homework.toFixed(3)),
            interference: Number(interference.toFixed(3)),
            total_gonogo: total_gonogo,
            total_gonogo_answer: Number(total_gonogo_answer.toFixed(3)),
            climb
        };
        
        this.elements.results.innerHTML = '<b>¡Juego finalizado!</b>';

  
        if (!this.debug) {
            const finalPayloadWrapper = {
                participantId: this.participantId,
                sessionId: this.sessionId,
                game: 'gonogo',
                timestamp: new Date().toISOString(),
                result: finalPayload,
                meta: { client: 'gonogo-frontend', version: '1.1-class' }
            };


            sendToSPA(finalPayloadWrapper.game, finalPayloadWrapper);

            sendToServer(finalPayload);
        }

        if (typeof this.onComplete === 'function') {
            this.onComplete(finalPayload);
        }
    }
}



function sendToSPA(gameId, payload) {
    if (window.SPA && typeof window.SPA.receiveGameResult === 'function') {
        try {
            window.SPA.receiveGameResult(gameId, payload);
            return Promise.resolve({ ok: true, via: 'direct' });
        } catch (err) {
            console.warn('SPA direct API failed', err);
        }
    }
    try {
        window.dispatchEvent(new CustomEvent('game:result', { detail: { game: gameId, payload } }));
        return Promise.resolve({ ok: true, via: 'customevent' });
    } catch (err) {
        console.warn('dispatch CustomEvent failed', err);
    }
    try {
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: 'GAME_RESULT', game: gameId, payload }, '*');
            return Promise.resolve({ ok: true, via: 'postMessage' });
        }
    } catch (err) {
        console.warn('postMessage failed', err);
    }
    queueOutbox({ game: gameId, payload, ts: new Date().toISOString() });
    return Promise.resolve({ ok: false, via: 'outbox' });
}

const BACKEND_URL = window.BACKEND_URL || 'https://tu-backend.example.com/api/save-game-result';
const AUTH_TOKEN = window.API_TOKEN || null;

async function sendToServer(payload) {
    try {
        const res = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(AUTH_TOKEN ? { 'Authorization': `Bearer ${AUTH_TOKEN}` } : {})
            },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Network response not ok: ' + res.status);
        const body = await res.json();
        return { ok: true, body };
    } catch (err) {
        console.warn('sendToServer failed, queueing', err);
        queueOutbox({ game: payload.game, payload, ts: new Date().toISOString(), sendAttempted: true });
        return { ok: false, error: String(err) };
    }
}

function queueOutbox(item) {
  try {
    const k = 'games_outbox_v1';
    const arr = JSON.parse(localStorage.getItem(k) || '[]');
    arr.push(item);
    localStorage.setItem(k, JSON.stringify(arr));
  } catch (e) { console.error('Outbox queue failed', e); }
}

async function flushOutbox() {
  const k = 'games_outbox_v1';
  const arr = JSON.parse(localStorage.getItem(k) || '[]');
  if (!arr.length) return;
  const remaining = [];
  for (const it of arr) {
    try {
      const payload = it.payload || it;
      const r = await sendToServer(payload);
      if (!r.ok) remaining.push(it);
    } catch (e) { remaining.push(it); }
  }
  localStorage.setItem(k, JSON.stringify(remaining));
}

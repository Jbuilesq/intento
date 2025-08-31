export async function updateTestResults() {
    const btnEnd = document.getElementById("btn-end");
    btnEnd.addEventListener("click", async () => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
            return;
        }

        try {

            // === Gonogo ===
            const gonogo = JSON.parse(localStorage.getItem("gonogo_final"));
            if (gonogo) {
                await fetch(`https://lifelens-db.vercel.app/gonogo/${user.id_gonogo}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        hw_time_1: gonogo.hw_time_1,
                        hw_answer_1: gonogo.hw_answer_1,
                        hw_score_1: gonogo.hw_score_1,
                        hw_time_2: gonogo.hw_time_2,
                        hw_answer_2: gonogo.hw_answer_2,
                        hw_score_2: gonogo.hw_score_2,
                        hw_time_3: gonogo.hw_time_3,
                        hw_answer_3: gonogo.hw_answer_3,
                        hw_score_3: gonogo.hw_score_3,
                        total_homewor: gonogo.total_homework, // cuidado: la API lo pide así
                        Interference: gonogo.interference,    // mayúscula
                        total_gonogo_answer: gonogo.total_gonogo_answer,
                        total_gonogo: gonogo.total_gonogo,
                        climb: gonogo.climb
                    })
                });
            }

            // === Stroop ===
            const stroop = JSON.parse(localStorage.getItem("stroop_state"));
            if (stroop) {
                await fetch(`https://lifelens-db.vercel.app/stroop/${user.id_stroop}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        p: stroop.p,
                        c: stroop.c,
                        pc: stroop.pc,
                        P_C: stroop.P_C,
                        Interference: stroop.interference, // corregido
                        time: stroop.time,
                        time_homework_p: stroop.time_homework_p,
                        time_homework_c: stroop.time_homework_c,
                        time_homework_pc: stroop.time_homework_pc,
                        total_stroop: stroop.total_stroop,
                        climb: stroop.climb || "sin calcular"
                    })
                });
            }

            // === Torre de Hanói ===
            const hanoi = JSON.parse(localStorage.getItem("towerGameData"));
            if (hanoi) {
                await fetch(`https://lifelens-db.vercel.app/t_hanoi/${user.id_t_hanoi}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        number_pieces: hanoi.totalDisks,
                        number_pieces_r_side: hanoi.disksInC,
                        motion_rating: hanoi.motion_rating,
                        time: hanoi.timeUsed,
                        motion_rating2: hanoi.motion_rating2,
                        total_hanoi: hanoi.total_hanoi
                    })
                });
            }

            // === Trail Making ===
            const tmtHistory = JSON.parse(localStorage.getItem("tmtHistory"));
            if (tmtHistory && tmtHistory.length > 0) {
                const last = tmtHistory[tmtHistory.length - 1]; // último intento
                await fetch(`https://lifelens-db.vercel.app/trail_making/${user.id_trail_making}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        correct_answers_A: last.partA.correct_answers,
                        time_A: last.partA.time,
                        score_A: last.partA.score,
                        correct_answers_B: last.partB.correct_answers,
                        time_B: last.partB.time,
                        score_B: last.partB.score,
                        total_correct_answers: last.total.total_correct_answers,
                        total_trail_making: last.total.total_trail_making
                    })
                });
            }
            localStorage.removeItem("gonogo_final");
            localStorage.removeItem("stroop_state");
            localStorage.removeItem("towerGameData");
            localStorage.removeItem("tmtHistory");
            localStorage.removeItem("user");
            localStorage.removeItem("gonogo_progress");


            window.location.href = "/login";
            console.log("Resultados enviados y sesión cerrada.");

        } catch (error) {
            console.error("Error al enviar resultados:", err);
        }
    });
}

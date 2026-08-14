/* ============================================================
   AL ESTUDIO — fondo.js
   Fondo vivo que reacciona AL SCROLL (no al cursor: en móvil no hay).
   Un solo canvas fijo detrás de todo. Se redibuja solo cuando el
   scroll cambia; en reposo no gasta un frame.
   ============================================================ */
(function () {
    "use strict";

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const canvas = document.createElement("canvas");
    canvas.id = "ac-fondo";
    canvas.setAttribute("aria-hidden", "true");
    document.body.prepend(canvas);
    const ctx = canvas.getContext("2d", { alpha: true });

    const NEGRO = "27, 27, 27";
    const ACIDO = "230, 0, 51";

    let W = 0, H = 0, dpr = 1;
    let paso = 28;            // separación de la retícula
    let movil = false;

    /* Bloques con parallax: cada uno viaja a su propia velocidad */
    let bloques = [];

    function sembrarBloques() {
        // Determinista: mismas posiciones en cada carga, sin Math.random()
        const semillas = [
            [0.08, 0.10, 96, 64, 0.55, 1],
            [0.78, 0.22, 132, 44, 0.30, 0],
            [0.30, 0.42, 56, 56, 0.80, 0],
            [0.62, 0.58, 180, 72, 0.22, 1],
            [0.12, 0.74, 72, 120, 0.45, 0],
            [0.88, 0.86, 88, 48, 0.65, 1],
            [0.45, 0.94, 140, 40, 0.35, 0],
            [0.68, 0.06, 48, 48, 0.72, 0]
        ];
        bloques = semillas.map(function (s) {
            return { x: s[0], y: s[1], w: s[2], h: s[3], vel: s[4], acido: s[5] === 1 };
        });
        if (movil) bloques = bloques.slice(0, 4);
    }

    function medir() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = window.innerWidth;
        H = window.innerHeight;
        movil = W < 768;
        paso = movil ? 22 : 32;
        canvas.width = Math.floor(W * dpr);
        canvas.height = Math.floor(H * dpr);
        canvas.style.width = W + "px";
        canvas.style.height = H + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        sembrarBloques();
    }

    /* --- Estado de scroll --------------------------------------- */
    let y = window.scrollY || 0;
    let yPrevio = y;
    let velocidad = 0;        // px por frame, suavizado
    let sucio = true;
    let corriendo = false;

    function alturaDocumento() {
        return Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    }

    function dibujar() {
        const progreso = Math.min(1, y / alturaDocumento());
        ctx.clearRect(0, 0, W, H);

        // La velocidad estira las líneas: scroll rápido = rastro largo
        const estiron = Math.min(Math.abs(velocidad) / 28, 1);

        /* 1 · Retícula que se desplaza con el scroll */
        const desfase = (y * 0.35) % paso;
        ctx.lineWidth = 1;

        // verticales (parallax lateral sutil, según el progreso)
        const deriva = (progreso * paso * 2) % paso;
        for (let x = -paso; x <= W + paso; x += paso) {
            const px = Math.round(x - deriva) + 0.5;
            ctx.strokeStyle = "rgba(" + NEGRO + ",0.055)";
            ctx.beginPath();
            ctx.moveTo(px, 0);
            ctx.lineTo(px, H);
            ctx.stroke();
        }

        // horizontales: las cercanas a la línea de escaneo se encienden
        const scanY = H * (0.18 + progreso * 0.64);
        for (let f = -paso; f <= H + paso; f += paso) {
            const py = Math.round(f - desfase) + 0.5;
            const cerca = 1 - Math.min(Math.abs(py - scanY) / (paso * 3.2), 1);
            if (cerca > 0.05) {
                ctx.strokeStyle = "rgba(" + ACIDO + "," + (cerca * 0.55).toFixed(3) + ")";
                ctx.lineWidth = 1 + cerca * 1.6;
            } else {
                ctx.strokeStyle = "rgba(" + NEGRO + ",0.055)";
                ctx.lineWidth = 1;
            }
            ctx.beginPath();
            ctx.moveTo(0, py);
            ctx.lineTo(W, py);
            ctx.stroke();
        }

        /* 2 · Línea de escaneo: marca dónde vas en la página */
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(" + ACIDO + ",0.9)";
        ctx.beginPath();
        ctx.moveTo(0, Math.round(scanY) + 0.5);
        ctx.lineTo(W * (0.12 + estiron * 0.5), Math.round(scanY) + 0.5);
        ctx.stroke();

        ctx.fillStyle = "rgba(" + NEGRO + ",1)";
        ctx.fillRect(0, Math.round(scanY) - 3, 6, 6);

        /* 3 · Bloques con parallax por scroll */
        bloques.forEach(function (b, i) {
            const bx = b.x * W;
            const by = ((b.y * H) - y * b.vel * 0.6) % (H + 260);
            const py = by < -240 ? by + H + 260 : by;
            const h = b.h * (1 + estiron * 0.8);   // se estiran al scrollear rápido

            ctx.save();
            ctx.translate(Math.round(bx), Math.round(py));

            if (b.acido) {
                ctx.fillStyle = "rgba(" + ACIDO + ",0.20)";
                ctx.fillRect(0, 0, b.w, h);
            }
            ctx.strokeStyle = "rgba(" + NEGRO + ",0.16)";
            ctx.lineWidth = 2;
            ctx.strokeRect(0.5, 0.5, b.w, h);

            // esquina marcada, como una mira
            ctx.strokeStyle = "rgba(" + NEGRO + ",0.4)";
            ctx.beginPath();
            ctx.moveTo(0, 10); ctx.lineTo(0, 0); ctx.lineTo(10, 0);
            ctx.stroke();

            if (!movil && i % 3 === 0) {
                ctx.fillStyle = "rgba(" + NEGRO + ",0.35)";
                ctx.font = "500 10px 'JetBrains Mono', monospace";
                ctx.fillText(String(i + 1).padStart(2, "0"), 4, h - 6);
            }
            ctx.restore();
        });

        /* 4 · Vector de progreso pegado al borde derecho */
        const barra = 3;
        ctx.fillStyle = "rgba(" + NEGRO + ",0.10)";
        ctx.fillRect(W - barra, 0, barra, H);
        ctx.fillStyle = "rgba(" + ACIDO + ",0.95)";
        ctx.fillRect(W - barra, 0, barra, H * progreso);
    }

    function bucle() {
        const objetivo = window.scrollY || 0;
        const delta = objetivo - yPrevio;
        yPrevio = objetivo;

        // suavizado: el fondo persigue al scroll, no lo copia
        y += (objetivo - y) * 0.18;
        velocidad += (delta - velocidad) * 0.25;

        const quieto = Math.abs(objetivo - y) < 0.4 && Math.abs(velocidad) < 0.4;
        if (quieto) {
            y = objetivo;
            velocidad = 0;
        }

        dibujar();

        if (!quieto || sucio) {
            sucio = false;
            requestAnimationFrame(bucle);
        } else {
            corriendo = false;
        }
    }

    function despertar() {
        sucio = true;
        if (!corriendo) {
            corriendo = true;
            requestAnimationFrame(bucle);
        }
    }

    /* --- Arranque ------------------------------------------------ */
    medir();

    if (reduce) {
        // Sin movimiento: una sola pasada estática.
        y = window.scrollY || 0;
        dibujar();
        window.addEventListener("resize", function () { medir(); dibujar(); });
        return;
    }

    despertar();
    window.addEventListener("scroll", despertar, { passive: true });
    window.addEventListener("resize", function () { medir(); despertar(); });
    // El contenido que aparece con el scroll cambia la altura del documento
    window.addEventListener("load", despertar);
})();

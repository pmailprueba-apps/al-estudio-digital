/* ============================================================
   AL ESTUDIO — main.js
   Header/footer compartidos, menú móvil, formulario a WhatsApp,
   portafolio y animaciones por scroll. Sin dependencias.
   ============================================================ */
(function () {
    "use strict";

    /* ---------- Datos del sitio ---------- */
    const SITE = {
        nombre: "AL ESTUDIO",
        whatsapp: "526141073188",
        whatsappBonito: "614 107 3188",
        ciudad: "San Luis Potosí, S.L.P.",
        nav: [
            { label: "TRABAJOS", href: "index.html", id: "trabajo" },
            { label: "SERVICIOS", href: "servicios.html", id: "servicios" },
            { label: "CONTACTO", href: "contacto.html", id: "contacto" }
        ]
    };

    function waLink(mensaje) {
        return "https://wa.me/" + SITE.whatsapp + "?text=" + encodeURIComponent(mensaje);
    }

    /* ---------- API pública (útil para pruebas) ---------- */
    const api = window.ACSTUDIO = window.ACSTUDIO || {};
    api.site = SITE;
    api.waLink = waLink;

    /* Solo navega a esquemas seguros. `abrirEnlace` es alcanzable desde
       cualquier script de la página (incluido el widget del bot): sin este
       filtro, un `javascript:` acabaría ejecutándose con nuestro origen. */
    const ESQUEMAS_OK = /^(https?:|mailto:|tel:)/i;
    api.abrirEnlace = function (url) {
        if (typeof url !== "string" || !ESQUEMAS_OK.test(url.trim())) {
            console.warn("[AC] enlace bloqueado:", url);
            return;
        }
        window.location.href = url;
    };

    /* Escape para todo lo que se arme como HTML. Hoy los datos son
       constantes de este archivo, pero las plantillas se construyen con
       concatenación: si mañana un texto viene de otro lado, no se convierte
       en un agujero. */
    function esc(v) {
        return String(v == null ? "" : v)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }
    api.esc = esc;

    /* ---------- Utilidades ---------- */
    const $ = (sel, ctx) => (ctx || document).querySelector(sel);
    const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
    const paginaActual = () => document.body.dataset.page || "inicio";

    /* ---------- Header ---------- */
    function renderHeader() {
        const slot = $('[data-component="header"]');
        if (!slot) return;
        const actual = paginaActual();

        const links = SITE.nav.map(function (item) {
            const activo = item.id === actual ? ' aria-current="page"' : "";
            return '<a class="nav-link font-button-text text-button-text text-on-surface-variant px-3 py-2" href="' +
                esc(item.href) + '"' + activo + ">" + esc(item.label) + "</a>";
        }).join("");

        const linksMobile = SITE.nav.map(function (item) {
            const activo = item.id === actual ? ' aria-current="page"' : "";
            return '<a class="nav-link font-button-text text-button-text text-on-surface-variant block px-4 py-4 border-b-border-width-standard border-primary" href="' +
                esc(item.href) + '"' + activo + ">" + esc(item.label) + "</a>";
        }).join("");

        slot.outerHTML =
            '<header class="sticky top-0 z-50 bg-surface border-b-border-width-standard border-primary w-full">' +
                '<div class="progreso" id="barra-progreso"></div>' +
                '<div class="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4">' +
                    '<a class="font-headline-lg text-headline-lg-mobile lg:text-headline-lg tracking-tighter uppercase text-primary flex items-center gap-3 shrink-0 whitespace-nowrap" href="index.html">' +
                        '<span class="w-10 h-10 md:w-12 md:h-12 brutal-border overflow-hidden flex items-center justify-center shrink-0 rounded-full">' +
                            '<img alt="Logo de AL ESTUDIO" class="w-full h-full object-cover" src="assets/img/logo.jpg"/>' +
                        "</span>" +
                        "<span>AL ESTUDIO</span>" +
                    "</a>" +
                    '<nav aria-label="Navegación principal" class="hidden md:flex items-center gap-2">' + links + "</nav>" +
                    '<a class="hidden md:inline-block font-button-text text-button-text bg-primary text-on-primary px-6 py-3 brutal-border brutal-shadow brutal-sink whitespace-nowrap" href="contacto.html">QUIERO UNO</a>' +
                    '<button aria-controls="mobile-menu" aria-expanded="false" aria-label="Abrir menú" class="md:hidden brutal-border bg-surface p-2 brutal-shadow brutal-sink" id="menu-toggle" type="button">' +
                        '<span class="material-symbols-outlined text-3xl align-middle" id="menu-icon">menu</span>' +
                    "</button>" +
                "</div>" +
                '<div class="md:hidden border-t-border-width-standard border-primary bg-surface-container-lowest" id="mobile-menu">' +
                    linksMobile +
                    '<a class="block font-button-text text-button-text bg-primary text-on-primary px-4 py-4 text-center" href="contacto.html">QUIERO UNO</a>' +
                "</div>" +
            "</header>";

        const toggle = $("#menu-toggle");
        const menu = $("#mobile-menu");
        const icon = $("#menu-icon");
        if (toggle && menu) {
            toggle.addEventListener("click", function () {
                const abierto = menu.classList.toggle("is-open");
                toggle.setAttribute("aria-expanded", String(abierto));
                toggle.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
                if (icon) icon.textContent = abierto ? "close" : "menu";
            });
        }
    }

    /* ---------- Footer ---------- */
    function renderFooter() {
        const slot = $('[data-component="footer"]');
        if (!slot) return;
        const anio = new Date().getFullYear();

        const enlaces = SITE.nav.map(function (item) {
            return '<a class="text-on-primary-container hover:text-secondary-fixed transition-colors" href="' +
                esc(item.href) + '">' + esc(item.label) + "</a>";
        }).join("");

        slot.outerHTML =
            '<footer class="bg-primary text-on-primary border-t-border-width-thick border-primary w-full mt-auto">' +
                '<div class="grid grid-cols-1 md:grid-cols-12 gap-gutter px-margin-mobile md:px-margin-desktop py-12 md:py-margin-desktop">' +
                    '<div class="md:col-span-5 flex flex-col gap-4">' +
                        '<div class="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase tracking-tighter">AL ESTUDIO</div>' +
                        '<p class="font-body-md text-on-primary-container max-w-sm">Hacemos que tu negocio conteste solo y que tu página cierre ventas. San Luis Potosí, S.L.P..</p>' +
                        '<a class="font-button-text text-button-text bg-secondary-container text-primary px-5 py-3 w-fit brutal-border brutal-shadow-acid-sm brutal-sink mt-2" href="' +
                            waLink("Hola AL Estudio, vi su sitio y quiero información.") + '" rel="noopener" target="_blank">ESCRÍBENOS POR WHATSAPP</a>' +
                    "</div>" +
                    '<div class="md:col-span-4 flex flex-col gap-3 font-label-mono text-label-mono">' +
                        '<span class="text-outline uppercase">[SECCIONES]</span>' + enlaces +
                    "</div>" +
                    '<div class="md:col-span-3 flex flex-col gap-3 font-label-mono text-label-mono">' +
                        '<span class="text-outline uppercase">[CONTACTO]</span>' +
                        '<a class="text-on-primary-container hover:text-secondary-fixed transition-colors" href="' +
                            waLink("Hola AL Estudio, quiero información.") + '" rel="noopener" target="_blank">WhatsApp ' + SITE.whatsappBonito + "</a>" +
                        '<span class="text-on-primary-container">' + SITE.ciudad + "</span>" +
                        '<span class="text-on-primary-container">©' + anio + " AL ESTUDIO</span>" +
                    "</div>" +
                "</div>" +
            "</footer>";
    }

    /* ---------- Barra de progreso del scroll ---------- */
    function initProgreso() {
        const barra = $("#barra-progreso");
        if (!barra) return;
        let pendiente = false;
        function pintar() {
            const alto = document.documentElement.scrollHeight - window.innerHeight;
            const p = alto > 0 ? Math.min(1, window.scrollY / alto) : 0;
            barra.style.width = (p * 100).toFixed(2) + "%";
            pendiente = false;
        }
        window.addEventListener("scroll", function () {
            if (!pendiente) { pendiente = true; requestAnimationFrame(pintar); }
        }, { passive: true });
        pintar();
    }

    /* ---------- Revelado y diagramas al entrar en pantalla ---------- */
    function initReveal() {
        const items = $$(".reveal, [data-anima], [data-contador]");
        if (!items.length) return;

        if (!("IntersectionObserver" in window)) {
            items.forEach(function (el) { el.classList.add("is-visible", "en-vista"); });
            return;
        }
        const io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible", "en-vista");
                if (entry.target.dataset.contador !== undefined) contar(entry.target);
                io.unobserve(entry.target);
            });
        }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });

        items.forEach(function (el) { io.observe(el); });

        setTimeout(function () {
            items.forEach(function (el) { el.classList.add("is-visible", "en-vista"); });
        }, 3000);
    }

    /* ---------- Contadores ---------- */
    function contar(el) {
        const destino = parseFloat(el.dataset.contador);
        const sufijo = el.dataset.sufijo || "";
        if (isNaN(destino)) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            el.textContent = destino + sufijo;
            return;
        }
        const dur = 900;
        let t0 = null;
        function paso(t) {
            if (t0 === null) t0 = t;
            const p = Math.min(1, (t - t0) / dur);
            const suave = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(destino * suave) + sufijo;
            if (p < 1) requestAnimationFrame(paso);
        }
        requestAnimationFrame(paso);
    }

    /* ---------- Toast ---------- */
    function toast(mensaje, tipo) {
        let el = $("#toast");
        if (!el) {
            el = document.createElement("div");
            el.id = "toast";
            el.setAttribute("role", "status");
            el.setAttribute("aria-live", "polite");
            document.body.appendChild(el);
        }
        const acento = tipo === "error" ? "bg-error text-on-error" : "bg-secondary-container text-primary";
        el.className = acento + " brutal-border brutal-shadow font-label-mono text-label-mono px-4 py-3 uppercase";
        el.textContent = mensaje;
        requestAnimationFrame(function () { el.classList.add("is-visible"); });
        clearTimeout(el._t);
        el._t = setTimeout(function () { el.classList.remove("is-visible"); }, 4500);
    }

    /* ---------- Formulario → WhatsApp ---------- */
    function initFormulario() {
        const form = $("#form-contacto");
        if (!form) return;

        const salida = $("#form-log");
        const boton = form.querySelector('button[type="submit"]');

        function log(linea) {
            if (!salida) return;
            const p = document.createElement("div");
            p.textContent = "> " + linea;
            salida.appendChild(p);
            salida.scrollTop = salida.scrollHeight;
        }

        function marcarError(campo, mensaje) {
            campo.setAttribute("aria-invalid", "true");
            const err = document.getElementById(campo.id + "-error");
            if (err) { err.textContent = "// " + mensaje; err.classList.add("is-visible"); }
        }
        function limpiarError(campo) {
            campo.removeAttribute("aria-invalid");
            const err = document.getElementById(campo.id + "-error");
            if (err) err.classList.remove("is-visible");
        }

        $$("input, textarea, select", form).forEach(function (campo) {
            campo.addEventListener("input", function () { limpiarError(campo); });
            campo.addEventListener("change", function () { limpiarError(campo); });
        });

        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const nombre = $("#nombre", form);
            const negocio = $("#negocio", form);
            const necesito = $("#necesito", form);
            const detalle = $("#detalle", form);
            let ok = true;

            [nombre, negocio, necesito, detalle].forEach(limpiarError);

            if (!nombre.value.trim()) { marcarError(nombre, "Dinos cómo te llamas"); ok = false; }
            if (!negocio.value.trim()) { marcarError(negocio, "¿De qué es tu negocio?"); ok = false; }
            if (!necesito.value) { marcarError(necesito, "Elige qué necesitas"); ok = false; }
            if (detalle.value.trim().length < 10) {
                marcarError(detalle, "Cuéntanos un poco más (mínimo 10 caracteres)"); ok = false;
            }

            if (!ok) {
                log("Faltan datos. Revisa lo marcado en rojo.");
                toast("Faltan datos", "error");
                return;
            }

            boton.disabled = true;
            boton.classList.add("opacity-60");
            log("Armando tu mensaje...");

            const mensaje =
                "Hola AL Estudio, soy " + nombre.value.trim() + " de " + negocio.value.trim() + ".\n" +
                "Necesito: " + necesito.options[necesito.selectedIndex].text + "\n\n" +
                detalle.value.trim();

            setTimeout(function () {
                api.abrirEnlace(waLink(mensaje));
                log("Listo. Se abrió WhatsApp con tu mensaje: solo dale enviar.");
                toast("WhatsApp abierto");
                boton.disabled = false;
                boton.classList.remove("opacity-60");
            }, 500);
        });
    }

    /* ---------- Portafolio ----------
       `caja` controla el desorden de la rejilla: ancho de columna, desfase
       vertical y giro. Es a propósito que no cierren parejo. */
    const PROYECTOS = [
        {
            id: "AC-02",
            caja: "lg:col-span-5 rota-der sangria-der",
            nombre: "Barbería",
            tipo: "sitios",
            etiqueta: "SITIO DE MUESTRA",
            estado: "demo",
            tags: ["Barbería", "Citas por WhatsApp"],
            texto: "Sitio para una barbería: servicios con precio, galería del local y el botón de apartar cita siempre a la mano.",
            imgEsc: "assets/img/portafolio/barberia-esc.jpg",
            imgMov: "assets/img/portafolio/barberia-mov.jpg",
            alt: "Sitio de muestra para una barbería"
        },
        {
            id: "AC-03",
            caja: "lg:col-span-5 desfase-1 rota-der sangria-der",
            nombre: "AL Estudio Ads",
            tipo: "video",
            etiqueta: "SISTEMA PROPIO",
            estado: "vivo",
            tags: ["Video vertical", "Remotion"],
            texto: "Los anuncios se arman con código, no a mano. Cambias el precio o la foto y sale un video nuevo en minutos, listo para Reels y TikTok. Este es uno real, para un negocio de alitas.",
            video: "assets/img/portafolio/ac-ads.mp4",
            poster: "assets/img/portafolio/ac-ads-poster.jpg",
            alt: "Anuncio vertical de costillas con precio"
        },
        {
            id: "AC-04",
            caja: "lg:col-span-5 rota-der sangria-izq",
            nombre: "Restaurante de alitas",
            tipo: "sitios",
            etiqueta: "SITIO DE MUESTRA",
            estado: "demo",
            tags: ["Restaurante", "Pedidos por WhatsApp"],
            texto: "Sitio para un restaurante: carta que se lee bien en el celular y termina en un pedido por WhatsApp. El cliente elige salsa, arma su orden y el mensaje sale escrito solo.",
            imgEsc: "assets/img/portafolio/ac-wings-ribs-esc.jpg",
            imgMov: "assets/img/portafolio/ac-wings-ribs-mov.jpg",
            alt: "Portada del sitio de alitas y costillas"
        },
        {
            id: "AC-05",
            caja: "lg:col-span-4 desfase-3 rota-izq sangria-izq",
            nombre: "Gimnasio",
            tipo: "sitios",
            etiqueta: "SITIO DE MUESTRA",
            estado: "demo",
            tags: ["Clases", "Planes"],
            texto: "Sitio para un gimnasio: clases, planes y entrenadores. El interesado pregunta por WhatsApp sin llenar un formulario de diez campos.",
            imgEsc: "assets/img/portafolio/gimnasio-esc.jpg",
            imgMov: "assets/img/portafolio/gimnasio-mov.jpg",
            alt: "Sitio de muestra para un gimnasio"
        },
        {
            id: "AC-06",
            caja: "lg:col-span-6 desfase-2 rota-der sangria-der",
            nombre: "AC Shoes",
            tipo: "sitios",
            etiqueta: "SISTEMA PROPIO",
            estado: "demo",
            pie: "BASE DE DATOS EN PAUSA",
            tags: ["Tienda en línea", "Carrito y pago", "Panel propio"],
            texto: "Nuestra tienda: catálogo, carrito, pago y un panel donde el dueño sube productos y precios sin depender de nadie. Hoy su base de datos está en pausa, pero la tienda está completa.",
            imgEsc: "assets/img/portafolio/ac-shoes-esc.jpg",
            imgMov: "assets/img/portafolio/ac-shoes-mov.jpg",
            alt: "Portada de la tienda de calzado"
        },
        {
            id: "AC-07",
            caja: "lg:col-span-4 rota-der sangria-der",
            nombre: "Cafetería",
            tipo: "sitios",
            etiqueta: "SITIO DE MUESTRA",
            estado: "demo",
            tags: ["Menú", "Repostería"],
            texto: "Sitio para una cafetería: el menú y la repostería del día se ven bien en el celular, y el pedido para llevar sale por WhatsApp.",
            imgEsc: "assets/img/portafolio/cafeteria-esc.jpg",
            imgMov: "assets/img/portafolio/cafeteria-mov.jpg",
            alt: "Sitio de muestra para una cafetería"
        },
        {
            id: "AC-09",
            caja: "lg:col-span-5 desfase-2 rota-der sangria-der",
            nombre: "Taller mecánico",
            tipo: "sitios",
            etiqueta: "SITIO DE MUESTRA",
            estado: "demo",
            tags: ["Servicios", "Cita previa"],
            texto: "Sitio para un taller: qué servicios hacen, cuánto tardan y cómo agendar sin tener que llamar por teléfono.",
            imgEsc: "assets/img/portafolio/taller-esc.jpg",
            imgMov: "assets/img/portafolio/taller-mov.jpg",
            alt: "Sitio de muestra para un taller mecánico"
        },
        {
            id: "AC-10",
            caja: "lg:col-span-4 rota-izq sangria-izq",
            nombre: "Consultorio médico",
            tipo: "sitios",
            etiqueta: "SITIO DE MUESTRA",
            estado: "demo",
            tags: ["Salud", "Agendar cita"],
            texto: "Sitio para un consultorio médico: especialidades claras y todo empujando a lo mismo, agendar la cita, con el botón siempre a la vista.",
            imgEsc: "assets/img/portafolio/ac-clinica-esc.jpg",
            imgMov: "assets/img/portafolio/ac-clinica-mov.jpg",
            alt: "Portada del sitio de una clínica"
        },
        {
            id: "AC-11",
            caja: "lg:col-span-7 desfase-1 rota-der sangria-der",
            nombre: "Bienes raíces",
            tipo: "sitios",
            etiqueta: "SITIO DE MUESTRA",
            estado: "demo",
            tags: ["Propiedades", "Filtros por zona"],
            texto: "Sitio para venta y renta de casas: fichas con fotos, filtros por zona y contacto directo con el asesor de esa propiedad.",
            imgEsc: "assets/img/portafolio/inmobiliaria-esc.jpg",
            imgMov: "assets/img/portafolio/inmobiliaria-mov.jpg",
            alt: "Sitio de muestra para una inmobiliaria"
        },
        {
            id: "AC-12",
            caja: "lg:col-span-5 desfase-3 rota-izq sangria-izq",
            nombre: "Salón de belleza",
            tipo: "sitios",
            etiqueta: "SITIO DE MUESTRA",
            estado: "demo",
            tags: ["Belleza", "Agenda"],
            texto: "Sitio para un salón de belleza: servicios, precios y agenda. La clienta aparta su cita por WhatsApp y ve antes cuánto va a pagar.",
            imgEsc: "assets/img/portafolio/spa-esc.jpg",
            imgMov: "assets/img/portafolio/spa-mov.jpg",
            alt: "Sitio de muestra para un salón de belleza"
        }
    ];

    api.proyectos = PROYECTOS;

    function tarjetaProyecto(p, i) {
        const vivo = p.estado === "vivo";

        /* Tres casos:
           · video   → el anuncio, en bucle
           · fija    → una captura de pantalla (un panel): se ve completa y quieta
           · el resto → la página entera en una tira que el marco recorre */
        let media;
        if (p.video) {
            media = '<div class="marco marco--video"><video autoplay class="w-full h-full object-cover" loop muted playsinline poster="' + esc(p.poster) + '"><source src="' + esc(p.video) + '" type="video/mp4"/></video></div>';
        } else if (p.fija) {
            media = '<div class="captura">' +
                        '<img alt="' + esc(p.alt) + '" class="w-full h-auto block" loading="lazy" src="' + esc(p.imgEsc) + '"/>' +
                    "</div>";
        } else {
            media = '<div class="marco">' +
                        '<picture>' +
                            '<source media="(max-width: 767px)" srcset="' + esc(p.imgMov) + '"/>' +
                            '<img alt="' + esc(p.alt) + '" class="tira" loading="lazy" src="' + esc(p.imgEsc) + '"/>' +
                        "</picture>" +
                        '<span class="marco__pista font-label-mono">' +
                            '<span class="md:hidden">TÓCALO ⤢</span>' +
                            '<span class="hidden md:inline">PASA EL MOUSE ↓</span>' +
                        "</span>" +
                    "</div>";
        }

        const tags = p.tags.map(function (t) {
            return '<span class="brutal-border px-2 py-1 font-label-mono text-[12px] bg-surface-container-high">' + esc(t) + "</span>";
        }).join("");

        return (
            '<article class="reveal group bg-surface-container-lowest border-border-width-thick border-primary flex flex-col ' +
                (p.caja || "") + " " +
                (vivo ? "brutal-shadow-acid" : "brutal-shadow-lg") + '" data-retardo="' + (i % 3) +
                '" data-tipo="' + p.tipo + '" data-indice="' + i + '">' +
                '<div class="border-b-border-width-thick border-primary ' + (vivo ? "bg-primary" : "bg-primary-container") +
                    ' p-3 flex justify-between items-center text-on-primary gap-2">' +
                    '<span class="font-label-mono text-label-mono ' + (vivo ? "text-secondary-container" : "") + '">[' + esc(p.id) + "]</span>" +
                    '<span class="font-label-mono text-[11px] ' + (vivo ? "text-secondary-container" : "text-on-primary-container") + '">' + esc(p.etiqueta) + "</span>" +
                "</div>" +
                media +
                '<div class="p-5 md:p-6 flex-grow flex flex-col gap-3 md:gap-4">' +
                    '<h2 class="font-headline-lg text-[26px] leading-[28px] md:text-headline-lg-mobile text-primary uppercase tracking-tighter">' + esc(p.nombre) + "</h2>" +
                    '<div class="flex flex-wrap gap-2 tags-tarjeta">' + tags + "</div>" +
                    '<p class="font-body-md text-[15px] leading-[22px] md:text-body-md text-on-surface-variant flex-grow cuerpo-largo">' + esc(p.texto) + "</p>" +
                "</div>" +
                '<div class="hidden md:flex border-t-border-width-standard border-primary bg-surface-container-low p-4 justify-end items-center gap-3">' +
                    '<a class="font-label-mono text-label-mono border-b-border-width-standard border-primary hover:bg-secondary-container" href="' +
                        waLink("Hola AL Estudio, vi en su portafolio el sitio de " + p.nombre.toLowerCase() + " y quiero algo parecido.") +
                        '" rel="noopener" target="_blank">QUIERO ALGO ASÍ &gt;</a>' +
                "</div>" +
            "</article>"
        );
    }

    /* ---------- Visor: el sitio corriendo dentro de un teléfono ----------
       En el celular las tarjetas son un catálogo quieto de dos columnas.
       El movimiento aparece al tocar una: sale el marco del teléfono y
       ahí adentro el sitio se recorre solo. */
    function initVisor() {
        const grid = $("#grid-proyectos");
        if (!grid) return;

        const visor = document.createElement("div");
        visor.id = "visor";
        visor.setAttribute("role", "dialog");
        visor.setAttribute("aria-modal", "true");
        visor.setAttribute("aria-label", "Vista del sitio en un teléfono");
        visor.innerHTML =
            '<div class="visor__barra">' +
                '<span class="visor__titulo" id="visor-titulo"></span>' +
                '<button class="visor__cerrar" type="button" id="visor-cerrar" aria-label="Cerrar">CERRAR ✕</button>' +
            "</div>" +
            '<div class="telefono">' +
                '<div class="telefono__pantalla">' +
                    '<div class="telefono__status">' +
                        '<span id="visor-hora">9:41</span>' +
                        '<span class="señal">' +
                            /* señal, wifi y batería: sin estos tres la barra no se lee como iOS */
                            '<svg width="17" height="11" viewBox="0 0 17 11" fill="#fff"><rect x="0" y="7.5" width="3" height="3.5" rx="1"/><rect x="4.6" y="5.2" width="3" height="5.8" rx="1"/><rect x="9.2" y="2.6" width="3" height="8.4" rx="1"/><rect x="13.8" y="0" width="3" height="11" rx="1"/></svg>' +
                            '<svg width="15" height="11" viewBox="0 0 15 11" fill="#fff"><path d="M7.5 10.6 5.4 8.3a3.1 3.1 0 0 1 4.2 0zM2.9 5.8a6.6 6.6 0 0 1 9.2 0l-1.4 1.5a4.5 4.5 0 0 0-6.4 0zM.3 3.1a10.2 10.2 0 0 1 14.4 0l-1.4 1.5a8.1 8.1 0 0 0-11.6 0z"/></svg>' +
                            '<svg width="25" height="12" viewBox="0 0 25 12"><rect x="0.5" y="0.5" width="21" height="11" rx="3" fill="none" stroke="#fff" stroke-opacity=".45"/><rect x="2" y="2" width="16" height="8" rx="1.6" fill="#fff"/><path d="M23 4v4a2.2 2.2 0 0 0 0-4z" fill="#fff" fill-opacity=".45"/></svg>' +
                        "</span>" +
                    "</div>" +
                    '<span class="telefono__isla"></span>' +
                    '<div class="telefono__lienzo" id="visor-lienzo"><img alt="" id="visor-img"/></div>' +
                "</div>" +
            "</div>" +
            '<a class="visor__wa" id="visor-wa" rel="noopener" target="_blank">QUIERO ALGO ASÍ</a>';
        document.body.appendChild(visor);

        const img = $("#visor-img", visor);
        const lienzo = $("#visor-lienzo", visor);
        const titulo = $("#visor-titulo", visor);
        const wa = $("#visor-wa", visor);
        let ultimoFoco = null;

        /* Cuánto tiene que recorrer la captura dentro de la pantalla.
           Se calcula con las medidas naturales de la imagen, NO con
           getBoundingClientRect: al abrir el visor el layout todavía no
           está resuelto y devuelve 0 — por eso algunas no se movían. */
        function medirRecorrido() {
            if (!img.naturalWidth) return;
            const caja = lienzo.getBoundingClientRect();
            if (!caja.height) return;                  // todavía sin layout: se re-mide después

            const altoRender = caja.width * (img.naturalHeight / img.naturalWidth);
            const sobra = Math.round(altoRender - caja.height);

            if (sobra < 40) {
                // captura corta: se estira para cubrir, sin animación ni hueco
                lienzo.classList.add("es-corta");
                return;
            }
            lienzo.classList.remove("es-corta");
            img.style.setProperty("--alto-pantalla", Math.round(caja.height) + "px");
            // ~90px por segundo: se alcanza a leer sin desesperar
            img.style.setProperty("--dur", Math.min(34, Math.max(10, sobra / 90)).toFixed(1) + "s");
        }

        function abrir(p, disparador) {
            ultimoFoco = disparador || null;
            titulo.textContent = p.nombre;
            img.alt = p.alt;
            img.src = p.imgMov || p.imgEsc || p.poster;
            wa.href = waLink("Hola AL Estudio, vi en su portafolio el sitio de " +
                p.nombre.toLowerCase() + " y quiero algo parecido.");
            // la hora real, como la traería el teléfono de quien está viendo
            const d = new Date();
            const h12 = d.getHours() % 12 || 12;
            $("#visor-hora", visor).textContent = h12 + ":" + String(d.getMinutes()).padStart(2, "0");

            visor.classList.add("is-open");
            document.body.classList.add("visor-abierto");
            $("#visor-cerrar", visor).focus();

            // se mide cuando el layout ya está resuelto, no antes
            requestAnimationFrame(function () { requestAnimationFrame(medirRecorrido); });
            img.onload = function () { requestAnimationFrame(medirRecorrido); };
        }

        function cerrar() {
            visor.classList.remove("is-open");
            document.body.classList.remove("visor-abierto");
            img.removeAttribute("src");
            if (ultimoFoco) ultimoFoco.focus();
        }

        $("#visor-cerrar", visor).addEventListener("click", cerrar);
        visor.addEventListener("click", function (e) {
            if (e.target === visor) cerrar();      // tocar fuera del teléfono
        });
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && visor.classList.contains("is-open")) cerrar();
        });

        grid.addEventListener("click", function (e) {
            if (e.target.closest("a")) return;      // los enlaces siguen siendo enlaces
            const card = e.target.closest("article[data-indice]");
            if (!card) return;
            const p = PROYECTOS[Number(card.dataset.indice)];
            if (!p || p.video) return;              // el anuncio ya se ve en bucle
            abrir(p, card);
        });

        api.abrirVisor = abrir;
    }

    function initPortafolio() {
        const grid = $("#grid-proyectos");
        if (!grid) return;
        grid.innerHTML = PROYECTOS.map(tarjetaProyecto).join("");

        const filtros = $$("[data-filtro]");
        filtros.forEach(function (btn) {
            btn.addEventListener("click", function () {
                const valor = btn.dataset.filtro;
                filtros.forEach(function (b) {
                    const activo = b === btn;
                    b.classList.toggle("bg-secondary-container", activo);
                    b.classList.toggle("bg-surface", !activo);
                    b.setAttribute("aria-pressed", String(activo));
                });
                let visibles = 0;
                $$("#grid-proyectos > article").forEach(function (card) {
                    const coincide = valor === "todos" || card.dataset.tipo === valor;
                    card.style.display = coincide ? "" : "none";
                    if (coincide) visibles++;
                });
                const cuenta = $("#cuenta-proyectos");
                if (cuenta) cuenta.textContent = visibles;
            });
        });

        const cuenta = $("#cuenta-proyectos");
        if (cuenta) cuenta.textContent = PROYECTOS.length;
    }

    /* ---------- Enlaces de WhatsApp declarativos ---------- */
    function initWhatsApp() {
        $$("[data-wa]").forEach(function (el) {
            el.setAttribute("href", waLink(el.dataset.wa || "Hola AL Estudio, quiero información."));
            el.setAttribute("target", "_blank");
            el.setAttribute("rel", "noopener");
        });
    }

    /* ---------- Reloj ---------- */
    function initReloj() {
        const el = $("#reloj");
        if (!el) return;
        function tick() {
            const d = new Date();
            const pad = function (n) { return String(n).padStart(2, "0"); };
            el.textContent = pad(d.getHours()) + ":" + pad(d.getMinutes());
        }
        tick();
        setInterval(tick, 20000);
    }

    /* ---------- Arranque ---------- */
    function init() {
        renderHeader();
        renderFooter();
        initPortafolio();
        initVisor();
        initWhatsApp();
        initProgreso();
        initReveal();
        initFormulario();
        initReloj();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();

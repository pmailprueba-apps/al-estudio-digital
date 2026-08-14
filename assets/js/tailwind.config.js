/* AL ESTUDIO — Kinetic Brutalist
   Config compartida por todas las páginas. Debe cargarse DESPUÉS del CDN de Tailwind. */
tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#000000",
                "on-primary": "#ffffff",
                "primary-container": "#1b1b1b",
                "on-primary-container": "#848484",
                "inverse-primary": "#c6c6c6",
                "secondary": "#a30024",
                "on-secondary": "#ffffff",
                "secondary-container": "#E60033",
                "on-secondary-container": "#ffffff",
                "tertiary": "#000000",
                "on-tertiary": "#ffffff",
                "tertiary-container": "#1a1c1c",
                "on-tertiary-container": "#838484",
                "error": "#ba1a1a",
                "on-error": "#ffffff",
                "error-container": "#ffdad6",
                "on-error-container": "#93000a",
                "background": "#f9f9f9",
                "on-background": "#1b1b1b",
                "surface": "#f9f9f9",
                "surface-dim": "#dadada",
                "surface-bright": "#f9f9f9",
                "surface-container-lowest": "#ffffff",
                "surface-container-low": "#f3f3f3",
                "surface-container": "#eeeeee",
                "surface-container-high": "#e8e8e8",
                "surface-container-highest": "#e2e2e2",
                "surface-variant": "#e2e2e2",
                "surface-tint": "#5e5e5e",
                "on-surface": "#1b1b1b",
                "on-surface-variant": "#4c4546",
                "inverse-surface": "#303030",
                "inverse-on-surface": "#f1f1f1",
                "outline": "#7e7576",
                "outline-variant": "#cfc4c5",
                "primary-fixed": "#e2e2e2",
                "primary-fixed-dim": "#c6c6c6",
                "on-primary-fixed": "#1b1b1b",
                "on-primary-fixed-variant": "#474747",
                "secondary-fixed": "#b4f700",
                "secondary-fixed-dim": "#9ed900",
                "on-secondary-fixed": "#141f00",
                "on-secondary-fixed-variant": "#374e00",
                "tertiary-fixed": "#e2e2e2",
                "tertiary-fixed-dim": "#c6c6c7",
                "on-tertiary-fixed": "#1a1c1c",
                "on-tertiary-fixed-variant": "#454747"
            },
            borderRadius: {
                "DEFAULT": "0px",
                "lg": "0px",
                "xl": "0px",
                "full": "9999px"
            },
            spacing: {
                "base": "4px",
                "gutter": "24px",
                "margin-mobile": "20px",
                "margin-desktop": "64px",
                "border-width-standard": "2px",
                "border-width-thick": "4px"
            },
            borderWidth: {
                "border-width-standard": "2px",
                "border-width-thick": "4px"
            },
            fontFamily: {
                "label-mono": ["JetBrains Mono", "monospace"],
                "headline-xl": ["JetBrains Mono", "monospace"],
                "headline-lg": ["JetBrains Mono", "monospace"],
                "headline-lg-mobile": ["JetBrains Mono", "monospace"],
                "button-text": ["JetBrains Mono", "monospace"],
                "body-lg": ["Hanken Grotesk", "sans-serif"],
                "body-md": ["Hanken Grotesk", "sans-serif"]
            },
            fontSize: {
                "label-mono": ["14px", { "lineHeight": "20px", "fontWeight": "500" }],
                "body-lg": ["20px", { "lineHeight": "30px", "fontWeight": "400" }],
                "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
                "headline-xl": ["80px", { "lineHeight": "80px", "letterSpacing": "-0.04em", "fontWeight": "800" }],
                "headline-lg": ["48px", { "lineHeight": "52px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
                "headline-lg-mobile": ["32px", { "lineHeight": "36px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
                "button-text": ["16px", { "lineHeight": "16px", "fontWeight": "700" }]
            }
        }
    }
}

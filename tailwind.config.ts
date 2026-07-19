import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        cream: {
          50: "#FDFCFA",
          100: "#FAF6EF",
          200: "#F3EBDC",
          300: "#E9DCC5",
        },
        ink: {
          50: "#F4F2EF",
          100: "#E4E0D9",
          300: "#9C958A",
          500: "#5F594E",
          700: "#332E27",
          800: "#241F1A",
          900: "#191510",
          950: "#100D0A",
        },
        rust: {
          50: "#FDF1EC",
          100: "#FADFD2",
          200: "#F2B79C",
          300: "#E8935F",
          400: "#DD7233",
          500: "#C1502E",
          600: "#A33F24",
          700: "#82331E",
          800: "#5F2516",
          900: "#3E170E",
        },
        pine: {
          50: "#EEF3EF",
          100: "#D2E0D6",
          300: "#7DA98B",
          500: "#3B6B51",
          600: "#2F5641",
          700: "#254432",
          900: "#152A1D",
        },
        gold: {
          300: "#E9C877",
          500: "#C68A2E",
          600: "#A66F20",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(25, 21, 16, 0.06), 0 8px 24px -12px rgba(25, 21, 16, 0.18)",
        "card-hover": "0 2px 4px rgba(25, 21, 16, 0.08), 0 16px 36px -14px rgba(25, 21, 16, 0.26)",
        pop: "0 10px 40px -10px rgba(193, 80, 46, 0.35)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;

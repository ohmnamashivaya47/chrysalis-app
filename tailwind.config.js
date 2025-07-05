/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Chrysalis Brand Colors - stone, clay, green
        primary: "#6B8E23", // Green - nature, growth, meditation
        secondary: "#8B7355", // Stone - grounding, stability
        accent: "#A0937D", // Clay - warmth, comfort
        background: "#F5F5DC", // Neutral beige - calm, professional
        "text-primary": "#2C2C2C", // Dark grey - readability
        "text-secondary": "#6B7355", // Muted stone - secondary text
        
        // Extended color palette for UI components
        deepTeal: "#2F5233", // Darker version of primary for contrast
        sage: {
          50: "#F7F8F4",
          100: "#EEEEF0", 
          200: "#D6D8D2",
          300: "#B5B8B0",
          400: "#94988C",
          500: "#6B8E23", // Primary green
          600: "#5A7A1E",
          700: "#4A6619",
          800: "#3A5214",
          900: "#2F4310",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      animation: {
        breathing: "breathing 8s ease-in-out infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        breathing: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

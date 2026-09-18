export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#E7EAED",
        surface: "#FFFFFF",
        ink: "#101418",
        muted: "#5B656E",
        line: "#CBD2D8",

        word: "#2F5EA8",
        excel: "#1E7A4C",
        ppt: "#C0512B",
        html5: "#8C4BC7",
        css3: "#0E7490",

        success: "#15803D",
        alert: "#B91C1C",
      },
      fontFamily: {
        display: ["Chivo", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
      borderRadius: {
        DEFAULT: "3px",
        md: "5px",
        lg: "8px",
      },
    },
  },
  plugins: [],
};

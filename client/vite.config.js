import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr({
      // Habilitar exportación nombrada "ReactComponent"
      exportAsDefault: false,
      svgrOptions: {
        // Opciones de SVGR si las necesitas
        icon: true,
      },
    }),
  ],
  server: {
    port: 4000,
  },
})
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 0.0.0.0 — LAN + Cloudflare Tunnel
    port: 5174,
    strictPort: true,
  },
})

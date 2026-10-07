import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/morning_coffee_form', // <-- Ganti sesuai nama repo GitHub kamu
})
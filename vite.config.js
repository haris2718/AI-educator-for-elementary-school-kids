import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  //base: '/~champa/dist/',//καθορίζει την βασικη διαδρομη base: './',
  plugins: [react()],
  base: './',
  server: {
    historyApiFallback: true, // Fallback για διαδρομές
  },

})

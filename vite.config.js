import { defineConfig } from 'vite'

export default defineConfig({
  preview: {
    allowedHosts: [
      'pet-ecom-qt9a.onrender.com',
    ]
  },
  server: {
    host: true, 
    allowedHosts: [
      'pet-ecom-qt9a.onrender.com'
    ]
  }
})
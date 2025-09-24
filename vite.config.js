import { defineConfig } from 'vite'

export default defineConfig({
  preview: {
    allowedHosts: [
      'pet-ecom-3na2.onrender.com',
    ]
  },
  server: {
    host: true, 
    allowedHosts: [
      'pet-ecom-3na2.onrender.com'
    ]
  }
})
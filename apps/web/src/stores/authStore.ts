import { defineStore } from 'pinia'
import { shallowRef } from 'vue'

const SESSION_KEY = 'kompra-em-promo:session'
const DEMO_EMAIL = 'admin@kompraempromo.com.br'
const DEMO_PASSWORD = 'admin123'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = shallowRef(localStorage.getItem(SESSION_KEY) === 'authenticated')

  function login(email: string, password: string) {
    if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      return false
    }

    localStorage.setItem(SESSION_KEY, 'authenticated')
    isAuthenticated.value = true
    return true
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY)
    isAuthenticated.value = false
  }

  return { isAuthenticated, login, logout }
})

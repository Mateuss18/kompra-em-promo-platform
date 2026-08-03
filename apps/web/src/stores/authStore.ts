import { defineStore } from 'pinia'
import { computed, shallowRef } from 'vue'

import { authService, setAccessToken } from '@/services/authService'
import type { AuthSession, AuthUser } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = shallowRef<string | null>(null)
  const user = shallowRef<AuthUser | null>(null)
  const isInitialized = shallowRef(false)
  const isLoading = shallowRef(false)
  const errorMessage = shallowRef('')
  const isAuthenticated = computed(() => accessToken.value !== null && user.value !== null)

  function applySession(session: AuthSession) {
    accessToken.value = session.accessToken
    setAccessToken(session.accessToken)
    user.value = session.user
  }

  function clearSession() {
    accessToken.value = null
    setAccessToken(null)
    user.value = null
  }

  async function restoreSession() {
    if (isInitialized.value) {
      return isAuthenticated.value
    }

    isLoading.value = true

    try {
      applySession(await authService.refresh())
      return true
    } catch {
      clearSession()
      return false
    } finally {
      isInitialized.value = true
      isLoading.value = false
    }
  }

  async function login(email: string, password: string) {
    isLoading.value = true
    errorMessage.value = ''

    try {
      applySession(await authService.login({ email: email.trim(), password }))
      isInitialized.value = true
      return true
    } catch (error) {
      clearSession()
      errorMessage.value =
        error instanceof Error && 'status' in error && error.status === 401
          ? 'E-mail ou senha inválidos.'
          : 'Não foi possível entrar. Tente novamente.'
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    isLoading.value = true
    errorMessage.value = ''
    await authService.logout().catch(() => undefined)
    clearSession()
    isInitialized.value = true
    isLoading.value = false
  }

  return {
    accessToken,
    user,
    isInitialized,
    isLoading,
    errorMessage,
    isAuthenticated,
    restoreSession,
    login,
    logout,
  }
})

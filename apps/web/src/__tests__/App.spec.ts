import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, describe, expect, it, vi } from 'vitest'

import App from '../App.vue'
import router from '../router'

const apiUrl = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('App', () => {
  it('protects the dashboard and supports login and logout', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(
        Response.json({
          accessToken: 'access-token',
          user: { id: 'admin-id', email: 'admin@example.com', role: 'ADMIN' },
        }),
      )
      .mockResolvedValueOnce(Response.json({ items: [], page: 1, pageCount: 1, total: 0 }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
    vi.stubGlobal('fetch', fetchMock)
    const pinia = createPinia()
    setActivePinia(pinia)
    await router.push('/dashboard')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router],
      },
    })

    expect(router.currentRoute.value.name).toBe('login')

    await wrapper.get('input[type="email"]').setValue('admin@example.com')
    await wrapper.get('input[type="password"]').setValue('senha-incorreta')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(wrapper.get('[role="alert"]').text()).toBe('E-mail ou senha inválidos.')

    await wrapper.get('input[type="password"]').setValue('senha-correta')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(wrapper.get('h1').text()).toBe('Visão geral')
    expect(wrapper.text()).toContain('admin@example.com')

    await wrapper.get('button[aria-label="Sair da sessão"]').trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('login')
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      `${apiUrl}/api/auth/refresh`,
      expect.objectContaining({ credentials: 'include', method: 'POST' }),
    )
    expect(fetchMock).toHaveBeenNthCalledWith(
      5,
      `${apiUrl}/api/auth/logout`,
      expect.objectContaining({ credentials: 'include', method: 'POST' }),
    )
  })
})

import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import App from '../App.vue'
import router from '../router'

describe('App', () => {
  it('protects the dashboard and supports login and logout', async () => {
    localStorage.clear()
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

    await wrapper.get('input[type="email"]').setValue('admin@kompraempromo.com.br')
    await wrapper.get('input[type="password"]').setValue('senha-incorreta')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.get('[role="alert"]').text()).toBe('E-mail ou senha inválidos.')
    expect(localStorage.getItem('kompra-em-promo:session')).toBeNull()

    await wrapper.get('input[type="password"]').setValue('admin123')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(wrapper.get('h1').text()).toBe('Visão geral')
    expect(localStorage.getItem('kompra-em-promo:session')).toBe('authenticated')

    await wrapper.get('button[aria-label="Sair da sessão"]').trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('login')
    expect(localStorage.getItem('kompra-em-promo:session')).toBeNull()
  })
})

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import DashboardLinkInput from '@/components/dashboard/DashboardLinkInput.vue'

describe('DashboardLinkInput', () => {
  it('emits the trimmed URL', async () => {
    const wrapper = mount(DashboardLinkInput, {
      props: { errorMessage: '', isCreating: false },
    })

    await wrapper.get('input').setValue('  https://amzn.to/product  ')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('submit')).toEqual([['https://amzn.to/product']])
  })

  it('blocks duplicate submission while creating', async () => {
    const wrapper = mount(DashboardLinkInput, {
      props: { errorMessage: '', isCreating: true },
    })

    await wrapper.get('form').trigger('submit')

    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.get('button').attributes('disabled')).toBeDefined()
  })
})

import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { generatePromotionImage } from '../src/modules/images/imageGenerationService.js'

describe('image generation', () => {
  it('generates a 1080x1080 PNG and saves it to the public directory', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'kompra-image-'))

    try {
      const result = await generatePromotionImage(
        {
          id: 'promo_image_test',
          productImageUrl: null,
          title: 'Produto de teste',
        },
        tempDir,
      )

      expect(result.publicUrl).toMatch(/^\/generated-images\/[a-f0-9]+\.png$/)
      expect(result.path).toContain(tempDir)
      expect(result.path).toMatch(/\.png$/)
    } finally {
      await rm(tempDir, { recursive: true, force: true })
    }
  })
})

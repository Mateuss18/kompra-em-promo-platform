import { createHash } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

import sharp from 'sharp'

const CANVAS_SIZE = 1080
const LOGO_WIDTH = 320
const LOGO_HEIGHT = 80
const LOGO_PADDING = 40

const BRAND_BACKGROUND = '#00d992'
const BRAND_TEXT = '#101010'

async function downloadImageAsBase64(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(10_000) })
    if (!response.ok) return null

    const contentType = response.headers.get('content-type') ?? 'image/jpeg'
    const buffer = Buffer.from(await response.arrayBuffer())

    return `data:${contentType};base64,${buffer.toString('base64')}`
  } catch {
    return null
  }
}

function buildPlaceholderBackground(): string {
  return `<rect width="${CANVAS_SIZE}" height="${CANVAS_SIZE}" fill="#101010"/>`
}

function buildProductImageLayer(imageDataUrl: string | null): string {
  if (!imageDataUrl) {
    return buildPlaceholderBackground()
  }

  return `<image href="${imageDataUrl}" width="${CANVAS_SIZE}" height="${CANVAS_SIZE}" preserveAspectRatio="xMidYMid slice"/>`
}

function buildLogoLayer(): string {
  return `
    <rect x="${LOGO_PADDING}" y="${LOGO_PADDING}" width="${LOGO_WIDTH}" height="${LOGO_HEIGHT}" rx="8" fill="${BRAND_BACKGROUND}" opacity="0.95"/>
    <text x="${LOGO_PADDING + LOGO_WIDTH / 2}" y="${LOGO_PADDING + LOGO_HEIGHT / 2 + 6}" font-family="system-ui, sans-serif" font-size="24" font-weight="700" fill="${BRAND_TEXT}" text-anchor="middle" dominant-baseline="middle">KOMPRA EM PROMO</text>
  `
}

function buildSvg(productImageDataUrl: string | null): string {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS_SIZE}" height="${CANVAS_SIZE}" viewBox="0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}">
      ${buildProductImageLayer(productImageDataUrl)}
      ${buildLogoLayer()}
    </svg>
  `
}

export interface ImageGenerationInput {
  id: string
  productImageUrl: string | null
  title: string
}

export interface GeneratedImage {
  path: string
  publicUrl: string
}

export class ImageGenerationError extends Error {
  constructor(message: string) {
    super(message)
  }
}

export async function generatePromotionImage(
  input: ImageGenerationInput,
  publicDir: string,
): Promise<GeneratedImage> {
  const productImageDataUrl = input.productImageUrl
    ? await downloadImageAsBase64(input.productImageUrl)
    : null

  const svg = buildSvg(productImageDataUrl)
  const pngBuffer = await sharp(Buffer.from(svg)).resize(CANVAS_SIZE, CANVAS_SIZE).png().toBuffer()

  const fileName = `${createHash('sha256').update(input.id).digest('hex').slice(0, 16)}.png`
  const relativePath = `/generated-images/${fileName}`
  const absolutePath = join(publicDir, relativePath)

  await mkdir(dirname(absolutePath), { recursive: true })
  await writeFile(absolutePath, pngBuffer)

  return {
    path: absolutePath,
    publicUrl: relativePath,
  }
}

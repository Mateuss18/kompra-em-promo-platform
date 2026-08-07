import { amazonParser } from './amazonParser.js'
import { mercadoLivreParser } from './mercadoLivreParser.js'
import { shopeeParser } from './shopeeParser.js'
import type { StoreParser } from './types.js'

export { amazonParser, mercadoLivreParser, shopeeParser }

export const parsers: StoreParser[] = [amazonParser, mercadoLivreParser, shopeeParser]

export function selectParser(url: string): StoreParser | null {
  return parsers.find((parser) => parser.canHandle(url)) ?? null
}

export type { ParsedProduct, StoreParser } from './types.js'

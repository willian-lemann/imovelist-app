import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merges Tailwind class names, resolving any conflicts.
 *
 * @param inputs - An array of class names to merge.
 * @returns A string of merged and optimized class names.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function formatMoney(money: string | number) {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  const cents = Number(money)
  money = Number.isNaN(cents) ? 0 : cents / 100
  return formatter.format(+Number(money).toFixed(2))
}

export function createSlug(propertyName: string) {
  return propertyName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function extractIdFromSlug(url: string) {
  const parts = url.split('/')
  const slug = parts[parts.length - 1]
  if (!slug) {
    return 0
  }
  const id = slug.split('-')[0]
  return +id
}

export function Capitalize(value: string | null) {
  if (!value) return ''
  return value.charAt(0).toUpperCase() + value.slice(1)
}

// tests/lib/utils.test.ts
import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn utility', () => {
  it('merges classnames correctly', () => {
    expect(cn('base', true && 'conditional', false && 'hidden')).toBe('base conditional')
  })

  it('handles tailwind conflicts', () => {
    expect(cn('p-2 p-4')).toBe('p-4')
  })
})
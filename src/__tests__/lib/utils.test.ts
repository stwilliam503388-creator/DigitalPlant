import { describe, it, expect } from 'vitest';
import { cn } from '../../lib/utils';

describe('cn utility', () => {
  it('returns an empty string when called with no arguments', () => {
    expect(cn()).toBe('');
  });

  it('returns a single class name unchanged', () => {
    expect(cn('foo')).toBe('foo');
  });

  it('joins multiple class names with a space', () => {
    expect(cn('foo', 'bar', 'baz')).toBe('foo bar baz');
  });

  it('filters out falsy values', () => {
    expect(cn('foo', undefined, null, false, 'bar')).toBe('foo bar');
  });

  it('handles conditional class objects', () => {
    expect(cn({ active: true, disabled: false })).toBe('active');
  });

  it('merges conflicting Tailwind classes (last wins)', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('handles array inputs', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar');
  });

  it('combines object and string inputs', () => {
    expect(cn('base', { extra: true })).toBe('base extra');
  });
});

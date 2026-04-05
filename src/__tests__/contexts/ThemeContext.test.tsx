import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from '../../contexts/ThemeContext';

function ThemeDisplay() {
  const { theme, toggleTheme } = useTheme();
  return (
    <>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </>
  );
}

describe('ThemeContext', () => {
  it('defaults to light when no localStorage value and system prefers light', () => {
    render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme').textContent).toBe('light');
  });

  it('reads saved theme from localStorage', () => {
    localStorage.setItem('theme', 'dark');
    render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme').textContent).toBe('dark');
  });

  it('defaults to dark when system prefers dark and no saved value', () => {
    vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme').textContent).toBe('dark');
  });

  it('toggles from light to dark', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme').textContent).toBe('light');
    await user.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(screen.getByTestId('theme').textContent).toBe('dark');
  });

  it('toggles from dark to light', async () => {
    const user = userEvent.setup();
    localStorage.setItem('theme', 'dark');
    render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>
    );
    await user.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(screen.getByTestId('theme').textContent).toBe('light');
  });

  it('persists theme to localStorage when toggled', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>
    );
    await user.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('adds "dark" class to document root when theme is dark', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>
    );
    await user.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('removes "dark" class from document root when theme is light', async () => {
    const user = userEvent.setup();
    localStorage.setItem('theme', 'dark');
    document.documentElement.classList.add('dark');
    render(
      <ThemeProvider>
        <ThemeDisplay />
      </ThemeProvider>
    );
    await user.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('throws when useTheme is used outside ThemeProvider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<ThemeDisplay />)).toThrow(
      'useTheme must be used within a ThemeProvider'
    );
    consoleError.mockRestore();
  });
});

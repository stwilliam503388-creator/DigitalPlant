import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider, useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../translations';

function LanguageDisplay() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <>
      <span data-testid="language">{language}</span>
      <span data-testid="title">{t.home.title}</span>
      <button onClick={() => setLanguage('en')}>English</button>
      <button onClick={() => setLanguage('zh')}>Chinese</button>
      <button onClick={() => setLanguage('jp')}>Japanese</button>
    </>
  );
}

describe('LanguageContext', () => {
  it('defaults to Chinese (zh) when no saved preference', () => {
    render(
      <LanguageProvider>
        <LanguageDisplay />
      </LanguageProvider>
    );
    expect(screen.getByTestId('language').textContent).toBe('zh');
  });

  it('reads saved language from localStorage', () => {
    localStorage.setItem('app_language', 'en');
    render(
      <LanguageProvider>
        <LanguageDisplay />
      </LanguageProvider>
    );
    expect(screen.getByTestId('language').textContent).toBe('en');
  });

  it('provides correct translation strings for default language (zh)', () => {
    render(
      <LanguageProvider>
        <LanguageDisplay />
      </LanguageProvider>
    );
    expect(screen.getByTestId('title').textContent).toBe(translations.zh.home.title);
  });

  it('switches to English when setLanguage("en") is called', async () => {
    const user = userEvent.setup();
    render(
      <LanguageProvider>
        <LanguageDisplay />
      </LanguageProvider>
    );
    await user.click(screen.getByRole('button', { name: 'English' }));
    expect(screen.getByTestId('language').textContent).toBe('en');
    expect(screen.getByTestId('title').textContent).toBe(translations.en.home.title);
  });

  it('switches to Japanese when setLanguage("jp") is called', async () => {
    const user = userEvent.setup();
    render(
      <LanguageProvider>
        <LanguageDisplay />
      </LanguageProvider>
    );
    await user.click(screen.getByRole('button', { name: 'Japanese' }));
    expect(screen.getByTestId('language').textContent).toBe('jp');
    expect(screen.getByTestId('title').textContent).toBe(translations.jp.home.title);
  });

  it('persists selected language to localStorage', async () => {
    const user = userEvent.setup();
    render(
      <LanguageProvider>
        <LanguageDisplay />
      </LanguageProvider>
    );
    await user.click(screen.getByRole('button', { name: 'English' }));
    expect(localStorage.getItem('app_language')).toBe('en');
  });

  it('throws when useLanguage is used outside LanguageProvider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<LanguageDisplay />)).toThrow(
      'useLanguage must be used within a LanguageProvider'
    );
    consoleError.mockRestore();
  });
});

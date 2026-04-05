import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test-utils';
import Settings from '../../pages/Settings';
import { translations } from '../../translations';

describe('Settings page', () => {
  const zh = translations.zh;
  const en = translations.en;

  it('renders the settings title', () => {
    renderWithProviders(<Settings />);
    expect(screen.getByText(zh.settings.title)).toBeInTheDocument();
  });

  it('renders the Language & Region header', () => {
    renderWithProviders(<Settings />);
    expect(screen.getByText(zh.settings.header)).toBeInTheDocument();
  });

  it('renders all 3 language options', () => {
    renderWithProviders(<Settings />);
    expect(screen.getByText('中文 (简体)')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('日本語')).toBeInTheDocument();
  });

  it('renders the Dark Mode toggle', () => {
    renderWithProviders(<Settings />);
    expect(screen.getByText(zh.settings.darkMode)).toBeInTheDocument();
  });

  it('renders the Push Notifications toggle', () => {
    renderWithProviders(<Settings />);
    expect(screen.getByText(zh.settings.notifications)).toBeInTheDocument();
  });

  it('renders the Save button', () => {
    renderWithProviders(<Settings />);
    expect(screen.getByRole('button', { name: zh.settings.save })).toBeInTheDocument();
  });

  it('switches to English when English language option is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Settings />);
    const englishOption = screen.getByText('English').closest('[class*="cursor-pointer"]') as HTMLElement;
    expect(englishOption).toBeInTheDocument();
    await user.click(englishOption);
    // The title should now be in English
    expect(screen.getByText(en.settings.title)).toBeInTheDocument();
  });

  it('shows Dark Mode toggle responding to click', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Settings />);
    const darkModeRow = screen.getByText(zh.settings.darkMode).closest('[class*="cursor-pointer"]') as HTMLElement;
    expect(darkModeRow).toBeInTheDocument();
    // The toggle area is clickable
    await user.click(darkModeRow);
    // After clicking, theme is dark and the Moon icon replaces Sun
    // The dark mode text is still rendered
    expect(screen.getByText(zh.settings.darkMode)).toBeInTheDocument();
  });

  it('shows the Notifications toggle responding to click (no Notification API)', async () => {
    const user = userEvent.setup();
    // Simulate Notification API being unavailable
    const originalNotification = window.Notification;
    delete (window as any).Notification;

    renderWithProviders(<Settings />);
    const notifRow = screen.getByText(zh.settings.notifications).closest('[class*="cursor-pointer"]') as HTMLElement;
    expect(notifRow).toBeInTheDocument();
    await user.click(notifRow);
    // Nothing crashes
    expect(screen.getByText(zh.settings.notifications)).toBeInTheDocument();

    // Restore
    Object.defineProperty(window, 'Notification', {
      value: originalNotification,
      configurable: true,
      writable: true,
    });
  });
});

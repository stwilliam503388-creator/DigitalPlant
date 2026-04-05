import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider } from '../../contexts/LanguageContext';
import { NotificationProvider, useNotifications } from '../../contexts/NotificationContext';

function NotificationDisplay() {
  const { notificationsEnabled, requestPermission, toggleNotifications } = useNotifications();
  return (
    <>
      <span data-testid="enabled">{String(notificationsEnabled)}</span>
      <button onClick={requestPermission}>Request</button>
      <button onClick={toggleNotifications}>Toggle</button>
    </>
  );
}

function renderNotifications() {
  return render(
    <LanguageProvider>
      <NotificationProvider>
        <NotificationDisplay />
      </NotificationProvider>
    </LanguageProvider>
  );
}

describe('NotificationContext', () => {
  it('defaults to false when no saved preference', () => {
    renderNotifications();
    expect(screen.getByTestId('enabled').textContent).toBe('false');
  });

  it('reads enabled state from localStorage', () => {
    localStorage.setItem('notificationsEnabled', 'true');
    renderNotifications();
    expect(screen.getByTestId('enabled').textContent).toBe('true');
  });

  it('requestPermission does nothing when Notification API is absent', async () => {
    const user = userEvent.setup();
    // Make Notification unavailable by deleting it (now possible since configurable: true in setup)
    const originalNotification = window.Notification;
    delete (window as any).Notification;

    renderNotifications();
    await user.click(screen.getByRole('button', { name: 'Request' }));
    expect(screen.getByTestId('enabled').textContent).toBe('false');

    // Restore
    Object.defineProperty(window, 'Notification', {
      value: originalNotification,
      configurable: true,
      writable: true,
    });
  });

  it('requestPermission sets enabled to true when permission is granted', async () => {
    const user = userEvent.setup();
    const mockRequestPermission = vi.fn().mockResolvedValue('granted');
    Object.defineProperty(window, 'Notification', {
      writable: true,
      value: class {
        static requestPermission = mockRequestPermission;
      },
    });

    renderNotifications();
    await user.click(screen.getByRole('button', { name: 'Request' }));
    expect(screen.getByTestId('enabled').textContent).toBe('true');
    expect(localStorage.getItem('notificationsEnabled')).toBe('true');
  });

  it('requestPermission does not enable when permission is denied', async () => {
    const user = userEvent.setup();
    const mockRequestPermission = vi.fn().mockResolvedValue('denied');
    Object.defineProperty(window, 'Notification', {
      writable: true,
      value: class {
        static requestPermission = mockRequestPermission;
      },
    });

    renderNotifications();
    await user.click(screen.getByRole('button', { name: 'Request' }));
    expect(screen.getByTestId('enabled').textContent).toBe('false');
    expect(localStorage.getItem('notificationsEnabled')).toBe('false');
  });

  it('toggleNotifications disables when currently enabled', async () => {
    const user = userEvent.setup();
    localStorage.setItem('notificationsEnabled', 'true');

    renderNotifications();
    await user.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(screen.getByTestId('enabled').textContent).toBe('false');
    expect(localStorage.getItem('notificationsEnabled')).toBe('false');
  });

  it('throws when useNotifications is used outside NotificationProvider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<NotificationDisplay />)).toThrow(
      'useNotifications must be used within a NotificationProvider'
    );
    consoleError.mockRestore();
  });
});
